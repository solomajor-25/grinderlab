/**
 * Game tree builder.
 * Constructs the solver's game tree from a spot configuration.
 * The tree represents all possible action sequences for both players.
 *
 * Investment tracking: Each node tracks oopInvested/ipInvested —
 * the amount each player has added from their stack into the pot.
 * This is critical for correct utility calculations at terminal nodes.
 */

import type {
  GameTreeConfig,
  GameTreeData,
  TreeNode,
  Action,
  WeightedCombo,
  StreetBetConfig,
} from './types'
import { NodeType, ActionType } from './types'
import { precomputeShowdowns, handConflictsWithBoard } from './showdown'

/**
 * Build the complete game tree from a spot configuration.
 */
export function buildGameTree(config: GameTreeConfig): GameTreeData {
  const { board, pot, effectiveStack, oopRange, ipRange, betSizes } = config

  // Filter ranges to remove hands that conflict with the board
  const oopHands = filterRange(oopRange, board)
  const ipHands = filterRange(ipRange, board)
  const oopWeights = new Float32Array(oopHands.map(h => h.weight))
  const ipWeights = new Float32Array(ipHands.map(h => h.weight))

  // Precompute showdowns for the current board
  const oopCards = oopHands.map(h => h.cards)
  const ipCards = ipHands.map(h => h.cards)
  const showdownMatrix = precomputeShowdowns(board, oopCards, ipCards)

  // Build the action tree
  const nodes: TreeNode[] = []
  let totalStrategySize = 0

  const streetIdx = config.street === 'flop' ? 0 : config.street === 'turn' ? 1 : 2

  function getStreetConfig(street: number): StreetBetConfig {
    if (street === 0) return betSizes.flop
    if (street === 1) return betSizes.turn
    return betSizes.river
  }

  function makeNode(
    type: NodeType,
    parentIdx: number,
    actionFromParent: number,
    pot: number,
    stack: number,
    street: number,
    player: number,
    foldWinner: number,
    strategyOffset: number,
    oopInv: number,
    ipInv: number,
  ): TreeNode {
    return {
      type, parent: parentIdx, actionFromParent,
      children: [], actions: [],
      pot, stack, street, player, foldWinner, strategyOffset,
      oopInvested: oopInv, ipInvested: ipInv,
    }
  }

  /**
   * Recursively build the tree.
   */
  function buildNode(
    currentPot: number,
    currentStack: number,
    street: number,
    player: number,
    parentIdx: number,
    actionFromParent: number,
    facingBet: number,
    checkCount: number,
    oopInv: number,
    ipInv: number,
  ): number {
    // Check if both checked → showdown or next street
    if (checkCount >= 2) {
      return createTerminalShowdown(currentPot, currentStack, street, parentIdx, actionFromParent, oopInv, ipInv)
    }

    const handCount = player === 0 ? oopHands.length : ipHands.length
    const streetConfig = getStreetConfig(street)

    // Determine available actions
    const actions: Action[] = []

    if (facingBet > 0) {
      // Facing a bet/raise: fold, call, or raise
      actions.push({ type: ActionType.Fold, size: 0, label: 'Fold' })
      actions.push({ type: ActionType.Call, size: facingBet, label: 'Call' })

      const stackAfterCall = currentStack - facingBet
      if (stackAfterCall > 0) {
        const potAfterCall = currentPot + facingBet * 2
        for (const raiseSize of streetConfig.raiseSizes) {
          const raiseAmount = Math.round(potAfterCall * raiseSize * 10) / 10
          const totalBet = facingBet + raiseAmount
          if (totalBet < currentStack) {
            if (totalBet / currentStack >= streetConfig.allinThreshold) {
              if (!actions.some(a => a.type === ActionType.AllIn)) {
                actions.push({ type: ActionType.AllIn, size: currentStack, label: 'All-In' })
              }
            } else {
              const pctLabel = Math.round(raiseSize * 100)
              actions.push({ type: ActionType.Raise, size: totalBet, label: `Raise ${pctLabel}%` })
            }
          } else if (!actions.some(a => a.type === ActionType.AllIn)) {
            actions.push({ type: ActionType.AllIn, size: currentStack, label: 'All-In' })
          }
        }
        if (!actions.some(a => a.type === ActionType.AllIn) && stackAfterCall > potAfterCall * 0.1) {
          actions.push({ type: ActionType.AllIn, size: currentStack, label: 'All-In' })
        }
      }
    } else {
      // Not facing a bet: check or bet
      actions.push({ type: ActionType.Check, size: 0, label: 'Check' })

      for (const betSize of streetConfig.betSizes) {
        const betAmount = Math.round(currentPot * betSize * 10) / 10
        if (betAmount < currentStack) {
          if (betAmount / currentStack >= streetConfig.allinThreshold) {
            if (!actions.some(a => a.type === ActionType.AllIn)) {
              actions.push({ type: ActionType.AllIn, size: currentStack, label: 'All-In' })
            }
          } else {
            const pctLabel = Math.round(betSize * 100)
            actions.push({ type: ActionType.Bet, size: betAmount, label: `Bet ${pctLabel}%` })
          }
        } else if (!actions.some(a => a.type === ActionType.AllIn)) {
          actions.push({ type: ActionType.AllIn, size: currentStack, label: 'All-In' })
        }
      }
      if (!actions.some(a => a.type === ActionType.AllIn) && currentStack > currentPot * 0.1) {
        actions.push({ type: ActionType.AllIn, size: currentStack, label: 'All-In' })
      }
    }

    // Create this player node
    const numActions = actions.length
    const strategyOffset = totalStrategySize
    totalStrategySize += handCount * numActions

    const nodeIdx = nodes.length
    const node = makeNode(
      player === 0 ? NodeType.PlayerOOP : NodeType.PlayerIP,
      parentIdx, actionFromParent,
      currentPot, currentStack, street, player, -1,
      strategyOffset, oopInv, ipInv,
    )
    node.actions = actions
    nodes.push(node)

    // Recursively build children for each action
    for (let a = 0; a < actions.length; a++) {
      const action = actions[a]
      let childIdx: number

      switch (action.type) {
        case ActionType.Fold: {
          const winner = player === 0 ? 1 : 0
          childIdx = createTerminalFold(
            currentPot, currentStack, street, nodeIdx, a, winner, oopInv, ipInv,
          )
          break
        }

        case ActionType.Check: {
          const nextPlayer = player === 0 ? 1 : 0
          const nextCheckCount = checkCount + 1

          if (nextCheckCount >= 2) {
            childIdx = createTerminalShowdown(currentPot, currentStack, street, nodeIdx, a, oopInv, ipInv)
          } else {
            childIdx = buildNode(currentPot, currentStack, street, nextPlayer, nodeIdx, a, 0, nextCheckCount, oopInv, ipInv)
          }
          break
        }

        case ActionType.Call: {
          const callAmt = facingBet
          const newPot = currentPot + callAmt
          const newStack = currentStack - callAmt
          const newOopInv = player === 0 ? oopInv + callAmt : oopInv
          const newIpInv = player === 1 ? ipInv + callAmt : ipInv

          childIdx = createTerminalShowdown(newPot, Math.max(0, newStack), street, nodeIdx, a, newOopInv, newIpInv)
          break
        }

        case ActionType.Bet:
        case ActionType.Raise: {
          const betAmt = action.size
          const newPot = currentPot + betAmt
          const newStack = currentStack - betAmt
          const nextPlayer = player === 0 ? 1 : 0
          const newOopInv = player === 0 ? oopInv + betAmt : oopInv
          const newIpInv = player === 1 ? ipInv + betAmt : ipInv

          childIdx = buildNode(newPot, newStack, street, nextPlayer, nodeIdx, a, betAmt, 0, newOopInv, newIpInv)
          break
        }

        case ActionType.AllIn: {
          const allInAmt = currentStack
          const newPot = currentPot + allInAmt
          const nextPlayer = player === 0 ? 1 : 0
          const newOopInv = player === 0 ? oopInv + allInAmt : oopInv
          const newIpInv = player === 1 ? ipInv + allInAmt : ipInv

          childIdx = buildNode(newPot, 0, street, nextPlayer, nodeIdx, a, allInAmt, 0, newOopInv, newIpInv)
          break
        }

        default:
          childIdx = createTerminalShowdown(currentPot, currentStack, street, nodeIdx, a, oopInv, ipInv)
      }

      node.children.push(childIdx)
    }

    return nodeIdx
  }

  function createTerminalFold(
    pot: number, stack: number, street: number,
    parentIdx: number, actionFromParent: number, winner: number,
    oopInv: number, ipInv: number,
  ): number {
    const idx = nodes.length
    nodes.push(makeNode(
      NodeType.TerminalFold, parentIdx, actionFromParent,
      pot, stack, street, -1, winner, -1, oopInv, ipInv,
    ))
    return idx
  }

  function createTerminalShowdown(
    pot: number, stack: number, street: number,
    parentIdx: number, actionFromParent: number,
    oopInv: number, ipInv: number,
  ): number {
    const idx = nodes.length
    nodes.push(makeNode(
      NodeType.TerminalShowdown, parentIdx, actionFromParent,
      pot, stack, street, -1, -1, -1, oopInv, ipInv,
    ))
    return idx
  }

  // Build from root: OOP acts first
  // Each player has already contributed pot/2 to the initial pot
  const halfPot = pot / 2
  const rootIdx = buildNode(pot, effectiveStack, streetIdx, 0, -1, -1, 0, 0, halfPot, halfPot)

  // Allocate strategy arrays
  const cumulativeRegret = new Float32Array(totalStrategySize)
  const strategySum = new Float32Array(totalStrategySize)
  const currentStrategy = new Float32Array(totalStrategySize)

  // Initialize to uniform
  for (const node of nodes) {
    if (node.type === NodeType.PlayerOOP || node.type === NodeType.PlayerIP) {
      const handCount = node.type === NodeType.PlayerOOP ? oopHands.length : ipHands.length
      const numActions = node.actions.length
      const uniform = 1.0 / numActions

      for (let h = 0; h < handCount; h++) {
        for (let a = 0; a < numActions; a++) {
          currentStrategy[node.strategyOffset + h * numActions + a] = uniform
        }
      }
    }
  }

  return {
    nodes,
    root: rootIdx,
    cumulativeRegret,
    strategySum,
    currentStrategy,
    totalStrategySize,
    oopHands: oopCards,
    ipHands: ipCards,
    oopWeights,
    ipWeights,
    showdownMatrix,
    board,
    config,
  }
}

/** Filter range combos that conflict with the board */
function filterRange(range: WeightedCombo[], board: number[]): WeightedCombo[] {
  return range.filter(combo => !handConflictsWithBoard(combo.cards, board))
}

/**
 * Get the action history (path from root) for a given node.
 */
export function getActionHistory(tree: GameTreeData, nodeIdx: number): string[] {
  const history: string[] = []
  let current = nodeIdx

  while (current >= 0) {
    const node = tree.nodes[current]
    if (node.parent >= 0) {
      const parent = tree.nodes[node.parent]
      if (parent.actions.length > 0 && node.actionFromParent >= 0) {
        history.unshift(parent.actions[node.actionFromParent].label)
      }
    }
    current = node.parent
  }

  return history
}

/**
 * Count nodes by type for debugging/display.
 */
export function countNodes(tree: GameTreeData): { player: number; terminal: number; total: number } {
  let player = 0
  let terminal = 0

  for (const node of tree.nodes) {
    if (node.type === NodeType.PlayerOOP || node.type === NodeType.PlayerIP) {
      player++
    } else if (node.type === NodeType.TerminalFold || node.type === NodeType.TerminalShowdown) {
      terminal++
    }
  }

  return { player, terminal, total: tree.nodes.length }
}
