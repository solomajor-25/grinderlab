/**
 * CFR+ (Counterfactual Regret Minimization Plus) algorithm.
 *
 * Counterfactual values at terminals are weighted by opponent reach probability
 * (NOT normalized). This is the standard CFR formulation where:
 *
 *   v_i(I) = sum_z [ pi_{-i}(z) * u_i(z) ]
 *
 * Where pi_{-i}(z) is the opponent's reach contribution.
 */

import type { GameTreeData, TreeNode, SolverAlgorithm, DCFRParams } from './types'
import { NodeType, DEFAULT_DCFR_PARAMS } from './types'
import { handsConflict } from './showdown'

/**
 * Update current strategy from cumulative regrets (regret matching).
 */
function updateCurrentStrategy(tree: GameTreeData): void {
  const { nodes, currentStrategy, cumulativeRegret } = tree

  for (const node of nodes) {
    if (node.type !== NodeType.PlayerOOP && node.type !== NodeType.PlayerIP) continue

    const handCount = node.type === NodeType.PlayerOOP ? tree.oopHands.length : tree.ipHands.length
    const numActions = node.actions.length
    const offset = node.strategyOffset

    for (let h = 0; h < handCount; h++) {
      const base = offset + h * numActions
      let sumPositive = 0

      for (let a = 0; a < numActions; a++) {
        const r = cumulativeRegret[base + a]
        if (r > 0) sumPositive += r
      }

      if (sumPositive > 0) {
        for (let a = 0; a < numActions; a++) {
          const r = cumulativeRegret[base + a]
          currentStrategy[base + a] = r > 0 ? r / sumPositive : 0
        }
      } else {
        const uniform = 1.0 / numActions
        for (let a = 0; a < numActions; a++) {
          currentStrategy[base + a] = uniform
        }
      }
    }
  }
}

/**
 * Apply DCFR discounting to cumulative regrets and strategy sums.
 * Called once per iteration before the traversal.
 *
 * Positive regrets *= t^α / (t^α + 1)
 * Negative regrets *= t^β / (t^β + 1)
 * Strategy sums   *= (t / (t+1))^γ
 */
function applyDCFRDiscount(tree: GameTreeData, iteration: number, params: DCFRParams): void {
  const t = iteration
  const { alpha, beta, gamma } = params

  const posDiscount = alpha >= 0 ? Math.pow(t, alpha) / (Math.pow(t, alpha) + 1) : 1
  const negDiscount = beta >= 0 ? Math.pow(t, beta) / (Math.pow(t, beta) + 1) : 0
  const stratDiscount = Math.pow(t / (t + 1), gamma)

  const { cumulativeRegret, strategySum, totalStrategySize } = tree

  for (let i = 0; i < totalStrategySize; i++) {
    const r = cumulativeRegret[i]
    cumulativeRegret[i] = r > 0 ? r * posDiscount : r * negDiscount
  }

  for (let i = 0; i < totalStrategySize; i++) {
    strategySum[i] *= stratDiscount
  }
}

/**
 * Run one CFR iteration for the traversing player.
 * In CFR+ mode, regrets are clipped to 0.
 * In DCFR mode, regrets are accumulated without clipping (discounting happens separately).
 */
export function runCFRIteration(
  tree: GameTreeData,
  traversingPlayer: 0 | 1,
  iterationWeight: number = 1,
  algorithm: SolverAlgorithm = 'cfr+',
): void {
  const oopCount = tree.oopHands.length
  const ipCount = tree.ipHands.length

  const oopReach = new Float32Array(oopCount)
  const ipReach = new Float32Array(ipCount)
  for (let i = 0; i < oopCount; i++) oopReach[i] = tree.oopWeights[i]
  for (let i = 0; i < ipCount; i++) ipReach[i] = tree.ipWeights[i]

  traverseNode(tree, tree.root, oopReach, ipReach, traversingPlayer, iterationWeight, algorithm)
}

/**
 * Recursive CFR traversal.
 * Returns counterfactual values for each hand of the traversing player.
 * These are WEIGHTED by opponent reach (not normalized).
 */
function traverseNode(
  tree: GameTreeData,
  nodeIdx: number,
  oopReach: Float32Array,
  ipReach: Float32Array,
  traversingPlayer: 0 | 1,
  iterationWeight: number,
  algorithm: SolverAlgorithm = 'cfr+',
): Float32Array {
  const node = tree.nodes[nodeIdx]

  if (node.type === NodeType.TerminalFold) {
    return computeFoldValue(tree, node, oopReach, ipReach, traversingPlayer)
  }

  if (node.type === NodeType.TerminalShowdown) {
    return computeShowdownValue(tree, node, oopReach, ipReach, traversingPlayer)
  }

  const isTraverser = node.player === traversingPlayer
  const handCount = node.player === 0 ? tree.oopHands.length : tree.ipHands.length
  const numActions = node.actions.length
  const offset = node.strategyOffset
  const travHandCount = traversingPlayer === 0 ? tree.oopHands.length : tree.ipHands.length

  if (isTraverser) {
    // Traverser's node: compute counterfactual value per action, update regrets
    const actionValues = new Array<Float32Array>(numActions)
    const nodeValue = new Float32Array(travHandCount)

    for (let a = 0; a < numActions; a++) {
      // At traverser's node, we DON'T scale opponent reach by traverser's strategy.
      // We DO scale traverser's own reach for strategy sum accumulation downstream.
      const newOopReach = new Float32Array(oopReach)
      const newIpReach = new Float32Array(ipReach)

      // Scale traverser's own reach for downstream opponent strategy accumulation
      if (traversingPlayer === 0) {
        for (let h = 0; h < handCount; h++) {
          newOopReach[h] = oopReach[h] * tree.currentStrategy[offset + h * numActions + a]
        }
      } else {
        for (let h = 0; h < handCount; h++) {
          newIpReach[h] = ipReach[h] * tree.currentStrategy[offset + h * numActions + a]
        }
      }

      actionValues[a] = traverseNode(
        tree, node.children[a], newOopReach, newIpReach, traversingPlayer, iterationWeight, algorithm,
      )

      // Accumulate weighted node value
      for (let h = 0; h < travHandCount; h++) {
        nodeValue[h] += tree.currentStrategy[offset + h * numActions + a] * actionValues[a][h]
      }
    }

    // Update regrets
    for (let h = 0; h < travHandCount; h++) {
      for (let a = 0; a < numActions; a++) {
        const regret = actionValues[a][h] - nodeValue[h]
        const idx = offset + h * numActions + a
        if (algorithm === 'cfr+') {
          // CFR+: clip negative regrets to 0
          tree.cumulativeRegret[idx] = Math.max(0, tree.cumulativeRegret[idx] + regret)
        } else {
          // DCFR: accumulate without clipping (discounting happens in solve loop)
          tree.cumulativeRegret[idx] += regret
        }
      }
    }

    return nodeValue
  } else {
    // Opponent's node: follow strategy, accumulate strategy sums
    const nodeValue = new Float32Array(travHandCount)

    for (let a = 0; a < numActions; a++) {
      const newOopReach = new Float32Array(oopReach)
      const newIpReach = new Float32Array(ipReach)

      // Scale OPPONENT's reach by their strategy
      if (node.player === 0) {
        for (let h = 0; h < handCount; h++) {
          newOopReach[h] = oopReach[h] * tree.currentStrategy[offset + h * numActions + a]
        }
      } else {
        for (let h = 0; h < handCount; h++) {
          newIpReach[h] = ipReach[h] * tree.currentStrategy[offset + h * numActions + a]
        }
      }

      const childValue = traverseNode(
        tree, node.children[a], newOopReach, newIpReach, traversingPlayer, iterationWeight, algorithm,
      )

      // Sum child values directly (they're already opponent-reach-weighted)
      for (let h = 0; h < travHandCount; h++) {
        nodeValue[h] += childValue[h]
      }
    }

    // Accumulate strategy sum for the opponent (for averaging)
    for (let h = 0; h < handCount; h++) {
      const reach = node.player === 0 ? oopReach[h] : ipReach[h]
      for (let a = 0; a < numActions; a++) {
        tree.strategySum[offset + h * numActions + a] +=
          reach * tree.currentStrategy[offset + h * numActions + a] * iterationWeight
      }
    }

    return nodeValue
  }
}

/**
 * Counterfactual value at a fold terminal.
 *
 * For each traverser hand h:
 *   v[h] = payoff * sum_j(opponent_reach[j]) where j doesn't conflict with h
 */
function computeFoldValue(
  tree: GameTreeData,
  node: TreeNode,
  oopReach: Float32Array,
  ipReach: Float32Array,
  traversingPlayer: 0 | 1,
): Float32Array {
  const travHands = traversingPlayer === 0 ? tree.oopHands : tree.ipHands
  const oppHands = traversingPlayer === 0 ? tree.ipHands : tree.oopHands
  const oppReach = traversingPlayer === 0 ? ipReach : oopReach
  const travCount = travHands.length
  const oppCount = oppHands.length

  const values = new Float32Array(travCount)

  // Determine payoff based on who wins
  let payoff: number
  if (node.foldWinner === traversingPlayer) {
    // Traverser wins: gains opponent's investment
    payoff = traversingPlayer === 0 ? node.ipInvested : node.oopInvested
  } else {
    // Traverser loses: loses own investment
    payoff = traversingPlayer === 0 ? -node.oopInvested : -node.ipInvested
  }

  for (let h = 0; h < travCount; h++) {
    let oppReachSum = 0
    for (let j = 0; j < oppCount; j++) {
      if (handsConflict(travHands[h], oppHands[j])) continue
      oppReachSum += oppReach[j]
    }
    values[h] = payoff * oppReachSum
  }

  return values
}

/**
 * Counterfactual value at a showdown terminal.
 *
 * For each traverser hand h:
 *   v[h] = sum_j(opponent_reach[j] * payoff(h, j))
 * where payoff depends on who wins the showdown.
 */
function computeShowdownValue(
  tree: GameTreeData,
  node: TreeNode,
  oopReach: Float32Array,
  ipReach: Float32Array,
  traversingPlayer: 0 | 1,
): Float32Array {
  const oopCount = tree.oopHands.length
  const ipCount = tree.ipHands.length

  const oopInv = node.oopInvested
  const ipInv = node.ipInvested

  if (traversingPlayer === 0) {
    const values = new Float32Array(oopCount)
    const winPayoff = ipInv
    const losePayoff = -oopInv
    const tiePayoff = (ipInv - oopInv) / 2

    for (let i = 0; i < oopCount; i++) {
      let val = 0
      for (let j = 0; j < ipCount; j++) {
        if (handsConflict(tree.oopHands[i], tree.ipHands[j])) continue
        const reach = ipReach[j]
        if (reach <= 0) continue

        const outcome = tree.showdownMatrix[i * ipCount + j]
        if (outcome > 0) val += reach * winPayoff
        else if (outcome < 0) val += reach * losePayoff
        else val += reach * tiePayoff
      }
      values[i] = val
    }
    return values
  } else {
    const values = new Float32Array(ipCount)
    const winPayoff = oopInv
    const losePayoff = -ipInv
    const tiePayoff = (oopInv - ipInv) / 2

    for (let j = 0; j < ipCount; j++) {
      let val = 0
      for (let i = 0; i < oopCount; i++) {
        if (handsConflict(tree.oopHands[i], tree.ipHands[j])) continue
        const reach = oopReach[i]
        if (reach <= 0) continue

        const outcome = tree.showdownMatrix[i * ipCount + j]
        if (outcome < 0) val += reach * winPayoff      // IP wins
        else if (outcome > 0) val += reach * losePayoff // IP loses
        else val += reach * tiePayoff
      }
      values[j] = val
    }
    return values
  }
}

/**
 * Compute exploitability (Nash distance) of the current average strategy.
 * Returns exploitability in bb.
 */
export function computeExploitability(tree: GameTreeData): number {
  const savedStrategy = new Float32Array(tree.currentStrategy)
  applyAverageStrategy(tree)

  const oopBR = computeBestResponseValue(tree, 0)
  const ipBR = computeBestResponseValue(tree, 1)

  tree.currentStrategy.set(savedStrategy)

  return (oopBR + ipBR) / 2
}

/**
 * Apply the average strategy (from strategySum) to currentStrategy.
 */
function applyAverageStrategy(tree: GameTreeData): void {
  for (const node of tree.nodes) {
    if (node.type !== NodeType.PlayerOOP && node.type !== NodeType.PlayerIP) continue

    const handCount = node.type === NodeType.PlayerOOP ? tree.oopHands.length : tree.ipHands.length
    const numActions = node.actions.length
    const offset = node.strategyOffset

    for (let h = 0; h < handCount; h++) {
      const base = offset + h * numActions
      let sum = 0
      for (let a = 0; a < numActions; a++) {
        sum += tree.strategySum[base + a]
      }
      if (sum > 0) {
        for (let a = 0; a < numActions; a++) {
          tree.currentStrategy[base + a] = tree.strategySum[base + a] / sum
        }
      } else {
        const uniform = 1.0 / numActions
        for (let a = 0; a < numActions; a++) {
          tree.currentStrategy[base + a] = uniform
        }
      }
    }
  }
}

/**
 * Compute best-response EV for a player.
 * This uses normalized utilities (not CFR-weighted) to compute actual EV.
 */
function computeBestResponseValue(tree: GameTreeData, player: 0 | 1): number {
  const handCount = player === 0 ? tree.oopHands.length : tree.ipHands.length
  const weights = player === 0 ? tree.oopWeights : tree.ipWeights

  const oopReach = new Float32Array(tree.oopHands.length)
  const ipReach = new Float32Array(tree.ipHands.length)
  for (let i = 0; i < tree.oopHands.length; i++) oopReach[i] = tree.oopWeights[i]
  for (let i = 0; i < tree.ipHands.length; i++) ipReach[i] = tree.ipWeights[i]

  // For best response, we need normalized utilities
  const utilities = bestResponseTraverse(tree, tree.root, oopReach, ipReach, player)

  // utilities are CFR-style (weighted by opponent reach).
  // Normalize by dividing by total opponent reach per hand to get EV.
  const oppHands = player === 0 ? tree.ipHands : tree.oopHands
  const oppWeights = player === 0 ? tree.ipWeights : tree.oopWeights
  const travHands = player === 0 ? tree.oopHands : tree.ipHands

  let totalUtil = 0
  let totalWeight = 0

  for (let h = 0; h < handCount; h++) {
    // Compute total opponent reach for this hand (for normalization)
    let oppReachSum = 0
    for (let j = 0; j < oppHands.length; j++) {
      if (handsConflict(travHands[h], oppHands[j])) continue
      oppReachSum += oppWeights[j]
    }

    if (oppReachSum > 0) {
      const ev = utilities[h] / oppReachSum
      totalUtil += ev * weights[h]
      totalWeight += weights[h]
    }
  }

  return totalWeight > 0 ? totalUtil / totalWeight : 0
}

/**
 * Best-response traversal: maximize at player's nodes, follow opponent strategy.
 * Returns CFR-style counterfactual values (opponent-reach-weighted).
 */
function bestResponseTraverse(
  tree: GameTreeData,
  nodeIdx: number,
  oopReach: Float32Array,
  ipReach: Float32Array,
  brPlayer: 0 | 1,
): Float32Array {
  const node = tree.nodes[nodeIdx]

  if (node.type === NodeType.TerminalFold) {
    return computeFoldValue(tree, node, oopReach, ipReach, brPlayer)
  }

  if (node.type === NodeType.TerminalShowdown) {
    return computeShowdownValue(tree, node, oopReach, ipReach, brPlayer)
  }

  const handCount = node.player === 0 ? tree.oopHands.length : tree.ipHands.length
  const numActions = node.actions.length
  const offset = node.strategyOffset
  const brHandCount = brPlayer === 0 ? tree.oopHands.length : tree.ipHands.length

  if (node.player === brPlayer) {
    // BR player: take the best action per hand
    const nodeValue = new Float32Array(brHandCount).fill(-1e15)

    for (let a = 0; a < numActions; a++) {
      // Don't modify opponent reach for BR player's actions
      const childValue = bestResponseTraverse(tree, node.children[a], oopReach, ipReach, brPlayer)

      for (let h = 0; h < brHandCount; h++) {
        if (childValue[h] > nodeValue[h]) {
          nodeValue[h] = childValue[h]
        }
      }
    }

    return nodeValue
  } else {
    // Opponent: follow their strategy
    const nodeValue = new Float32Array(brHandCount)

    for (let a = 0; a < numActions; a++) {
      const newOopReach = new Float32Array(oopReach)
      const newIpReach = new Float32Array(ipReach)

      if (node.player === 0) {
        for (let h = 0; h < handCount; h++) {
          newOopReach[h] = oopReach[h] * tree.currentStrategy[offset + h * numActions + a]
        }
      } else {
        for (let h = 0; h < handCount; h++) {
          newIpReach[h] = ipReach[h] * tree.currentStrategy[offset + h * numActions + a]
        }
      }

      const childValue = bestResponseTraverse(tree, node.children[a], newOopReach, newIpReach, brPlayer)

      for (let h = 0; h < brHandCount; h++) {
        nodeValue[h] += childValue[h]
      }
    }

    return nodeValue
  }
}

/**
 * Compute per-action EV (in bb) for a specific hand at a given node.
 * Uses the average strategy. Returns one EV value per action at the node.
 */
export function computeActionEVs(
  tree: GameTreeData,
  nodeIdx: number,
  handIdx: number,
): number[] {
  const node = tree.nodes[nodeIdx]
  if (node.type !== NodeType.PlayerOOP && node.type !== NodeType.PlayerIP) return []

  const numActions = node.actions.length
  if (numActions === 0) return []

  // Save and apply average strategy
  const savedStrategy = new Float32Array(tree.currentStrategy)
  applyAverageStrategy(tree)

  const player = node.player as 0 | 1
  const travHands = player === 0 ? tree.oopHands : tree.ipHands
  const oppHands = player === 0 ? tree.ipHands : tree.oopHands
  const oppWeights = player === 0 ? tree.ipWeights : tree.oopWeights

  // Compute opponent reach normalization for this hand
  let oppReachSum = 0
  for (let j = 0; j < oppHands.length; j++) {
    if (handsConflict(travHands[handIdx], oppHands[j])) continue
    oppReachSum += oppWeights[j]
  }

  if (oppReachSum <= 0) {
    tree.currentStrategy.set(savedStrategy)
    return new Array(numActions).fill(0)
  }

  // For each action, traverse the child subtree using average strategy
  // to compute the EV for this specific hand
  const evs: number[] = []

  for (let a = 0; a < numActions; a++) {
    // Set up reach arrays from root
    const oopReach = new Float32Array(tree.oopHands.length)
    const ipReach = new Float32Array(tree.ipHands.length)
    for (let i = 0; i < tree.oopHands.length; i++) oopReach[i] = tree.oopWeights[i]
    for (let i = 0; i < tree.ipHands.length; i++) ipReach[i] = tree.ipWeights[i]

    // Propagate reach from root to this node following average strategy
    propagateReachToNode(tree, tree.root, nodeIdx, oopReach, ipReach)

    // Traverse the child subtree following average strategy for both players
    const childValues = avgStrategyTraverse(tree, node.children[a], oopReach, ipReach, player)

    // Normalize by opponent reach to get EV in bb
    const ev = childValues[handIdx] / oppReachSum
    evs.push(ev)
  }

  tree.currentStrategy.set(savedStrategy)
  return evs
}

/**
 * Propagate reach arrays from root to a target node following average strategy.
 * Modifies oopReach and ipReach in place.
 */
function propagateReachToNode(
  tree: GameTreeData,
  fromIdx: number,
  targetIdx: number,
  oopReach: Float32Array,
  ipReach: Float32Array,
): boolean {
  if (fromIdx === targetIdx) return true

  const node = tree.nodes[fromIdx]
  if (node.type >= NodeType.TerminalFold) return false

  const handCount = node.player === 0 ? tree.oopHands.length : tree.ipHands.length
  const numActions = node.actions.length
  const offset = node.strategyOffset

  for (let a = 0; a < numActions; a++) {
    const childIdx = node.children[a]
    // Check if target is in this subtree (simple: try recursing)
    const savedOop = new Float32Array(oopReach)
    const savedIp = new Float32Array(ipReach)

    // Apply this node's strategy to the acting player's reach
    if (node.player === 0) {
      for (let h = 0; h < handCount; h++) {
        oopReach[h] *= tree.currentStrategy[offset + h * numActions + a]
      }
    } else {
      for (let h = 0; h < handCount; h++) {
        ipReach[h] *= tree.currentStrategy[offset + h * numActions + a]
      }
    }

    if (propagateReachToNode(tree, childIdx, targetIdx, oopReach, ipReach)) {
      return true
    }

    // Restore if this wasn't the right path
    oopReach.set(savedOop)
    ipReach.set(savedIp)
  }

  return false
}

/**
 * Traverse tree following average strategy for BOTH players.
 * Returns counterfactual values (opponent-reach-weighted) for the target player.
 */
function avgStrategyTraverse(
  tree: GameTreeData,
  nodeIdx: number,
  oopReach: Float32Array,
  ipReach: Float32Array,
  targetPlayer: 0 | 1,
): Float32Array {
  const node = tree.nodes[nodeIdx]

  if (node.type === NodeType.TerminalFold) {
    return computeFoldValue(tree, node, oopReach, ipReach, targetPlayer)
  }
  if (node.type === NodeType.TerminalShowdown) {
    return computeShowdownValue(tree, node, oopReach, ipReach, targetPlayer)
  }

  const handCount = node.player === 0 ? tree.oopHands.length : tree.ipHands.length
  const numActions = node.actions.length
  const offset = node.strategyOffset
  const targetHandCount = targetPlayer === 0 ? tree.oopHands.length : tree.ipHands.length

  const nodeValue = new Float32Array(targetHandCount)

  for (let a = 0; a < numActions; a++) {
    const newOopReach = new Float32Array(oopReach)
    const newIpReach = new Float32Array(ipReach)

    // Scale the acting player's reach by their strategy
    if (node.player === 0) {
      for (let h = 0; h < handCount; h++) {
        newOopReach[h] = oopReach[h] * tree.currentStrategy[offset + h * numActions + a]
      }
    } else {
      for (let h = 0; h < handCount; h++) {
        newIpReach[h] = ipReach[h] * tree.currentStrategy[offset + h * numActions + a]
      }
    }

    const childValue = avgStrategyTraverse(tree, node.children[a], newOopReach, newIpReach, targetPlayer)

    if (node.player === targetPlayer) {
      // At target player's node: weight by their own strategy
      for (let h = 0; h < targetHandCount; h++) {
        nodeValue[h] += tree.currentStrategy[offset + h * numActions + a] * childValue[h]
      }
    } else {
      // At opponent's node: sum directly (opponent reach already applied)
      for (let h = 0; h < targetHandCount; h++) {
        nodeValue[h] += childValue[h]
      }
    }
  }

  return nodeValue
}

/**
 * Run the full solve loop.
 * Supports both CFR+ and DCFR algorithms.
 *
 * CFR+: Clips negative regrets to 0. Uses linear iteration weighting for strategy sum.
 * DCFR: Discounts positive regrets by t^α/(t^α+1), negative by t^β/(t^β+1),
 *        and strategy contributions by (t/(t+1))^γ. From Brown & Sandholm 2018.
 */
export function solve(
  tree: GameTreeData,
  maxIterations: number,
  targetExploitability: number,
  onProgress: (progress: {
    iteration: number
    exploitability: number
    exploitabilityPct: number
    elapsed: number
  }) => void,
  shouldStop: () => boolean,
  algorithm: SolverAlgorithm = 'cfr+',
  dcfrParams: DCFRParams = DEFAULT_DCFR_PARAMS,
): { iterations: number; exploitability: number; exploitabilityPct: number; elapsed: number } {
  const startTime = performance.now()
  let lastProgressTime = startTime

  for (let iter = 0; iter < maxIterations; iter++) {
    if (shouldStop()) break

    // DCFR: discount regrets and strategy sums before each iteration
    if (algorithm === 'dcfr' && iter > 0) {
      applyDCFRDiscount(tree, iter, dcfrParams)
    }

    // CFR+ uses iteration number for linear weighting; DCFR uses 1.0 (weighting via discount)
    const iterWeight = algorithm === 'cfr+' ? iter + 1 : 1

    updateCurrentStrategy(tree)
    runCFRIteration(tree, 0, iterWeight, algorithm)

    updateCurrentStrategy(tree)
    runCFRIteration(tree, 1, iterWeight, algorithm)

    const now = performance.now()
    if (now - lastProgressTime > 500 || iter === maxIterations - 1 || iter < 10) {
      const exploitability = computeExploitability(tree)
      const exploitabilityPct = tree.config.pot > 0
        ? Math.abs((exploitability / tree.config.pot) * 100)
        : 0

      onProgress({
        iteration: iter + 1,
        exploitability: Math.abs(exploitability),
        exploitabilityPct,
        elapsed: now - startTime,
      })

      lastProgressTime = now

      if (exploitabilityPct <= targetExploitability) {
        const elapsed = performance.now() - startTime
        return { iterations: iter + 1, exploitability: Math.abs(exploitability), exploitabilityPct, elapsed }
      }
    }
  }

  const exploitability = computeExploitability(tree)
  const exploitabilityPct = tree.config.pot > 0
    ? Math.abs((exploitability / tree.config.pot) * 100)
    : 0
  const elapsed = performance.now() - startTime

  return { iterations: maxIterations, exploitability: Math.abs(exploitability), exploitabilityPct, elapsed }
}
