/**
 * Strategy extraction from the solved game tree.
 * Converts raw strategy arrays into human-readable formats.
 */

import type { GameTreeData, ActionFrequency, ComboStrategy, NodeQueryResult, NodeQuery } from './types'
import { NodeType } from './types'
import { getActionHistory } from './game-tree'
import { getHandNotation } from '../range'
import { intToCard } from '../card'
import { computeActionEVs } from './cfr'

/**
 * Get the average strategy for a specific hand at a specific node.
 */
export function getHandStrategy(
  tree: GameTreeData,
  nodeIdx: number,
  handIdx: number,
): ActionFrequency[] {
  const node = tree.nodes[nodeIdx]
  if (node.type !== NodeType.PlayerOOP && node.type !== NodeType.PlayerIP) return []

  const numActions = node.actions.length
  const offset = node.strategyOffset
  const base = offset + handIdx * numActions

  // Compute average strategy from strategySum
  let sum = 0
  for (let a = 0; a < numActions; a++) {
    sum += tree.strategySum[base + a]
  }

  const result: ActionFrequency[] = []

  if (sum > 0) {
    for (let a = 0; a < numActions; a++) {
      result.push({
        action: node.actions[a].label,
        frequency: tree.strategySum[base + a] / sum,
        ev: 0, // EV calculation would require additional tree traversal
      })
    }
  } else {
    // Uniform when no data
    const uniform = 1.0 / numActions
    for (let a = 0; a < numActions; a++) {
      result.push({
        action: node.actions[a].label,
        frequency: uniform,
        ev: 0,
      })
    }
  }

  return result
}

/**
 * Get strategies for all hands at a node, grouped by hand notation.
 * Returns a map from hand notation (e.g., "AKs") to averaged action frequencies.
 */
export function getRangeStrategy(
  tree: GameTreeData,
  nodeIdx: number,
): Record<string, ActionFrequency[]> {
  const node = tree.nodes[nodeIdx]
  if (node.type !== NodeType.PlayerOOP && node.type !== NodeType.PlayerIP) return {}

  const hands = node.player === 0 ? tree.oopHands : tree.ipHands
  const handCount = hands.length
  const numActions = node.actions.length
  const offset = node.strategyOffset

  // Group combos by hand notation, average their strategies
  const notationGroups: Record<string, { freqs: number[]; count: number }> = {}

  for (let h = 0; h < handCount; h++) {
    const notation = getHandNotation(hands[h][0], hands[h][1])
    const base = offset + h * numActions

    // Get average strategy for this combo
    let sum = 0
    for (let a = 0; a < numActions; a++) {
      sum += tree.strategySum[base + a]
    }

    if (!notationGroups[notation]) {
      notationGroups[notation] = { freqs: new Array(numActions).fill(0), count: 0 }
    }

    const group = notationGroups[notation]
    group.count++

    if (sum > 0) {
      for (let a = 0; a < numActions; a++) {
        group.freqs[a] += tree.strategySum[base + a] / sum
      }
    } else {
      const uniform = 1.0 / numActions
      for (let a = 0; a < numActions; a++) {
        group.freqs[a] += uniform
      }
    }
  }

  // Convert to ActionFrequency arrays
  const result: Record<string, ActionFrequency[]> = {}

  for (const [notation, group] of Object.entries(notationGroups)) {
    result[notation] = node.actions.map((action, a) => ({
      action: action.label,
      frequency: group.freqs[a] / group.count,
      ev: 0,
    }))
  }

  return result
}

/**
 * Get per-combo strategies grouped by hand notation.
 * E.g., "QJs" -> [{ combo: "Q♠J♠", frequencies: [...] }, { combo: "Q♥J♥", frequencies: [...] }]
 */
export function getComboStrategies(
  tree: GameTreeData,
  nodeIdx: number,
): Record<string, ComboStrategy[]> {
  const node = tree.nodes[nodeIdx]
  if (node.type !== NodeType.PlayerOOP && node.type !== NodeType.PlayerIP) return {}

  const SUIT_SYMBOLS: Record<string, string> = { s: '♠', h: '♥', d: '♦', c: '♣' }
  const hands = node.player === 0 ? tree.oopHands : tree.ipHands
  const handCount = hands.length
  const numActions = node.actions.length
  const offset = node.strategyOffset

  const result: Record<string, ComboStrategy[]> = {}

  for (let h = 0; h < handCount; h++) {
    const c1 = hands[h][0]
    const c2 = hands[h][1]
    const notation = getHandNotation(c1, c2)
    const card1 = intToCard(c1)
    const card2 = intToCard(c2)
    const comboLabel = `${card1.rank}${SUIT_SYMBOLS[card1.suit]}${card2.rank}${SUIT_SYMBOLS[card2.suit]}`

    const base = offset + h * numActions
    let sum = 0
    for (let a = 0; a < numActions; a++) {
      sum += tree.strategySum[base + a]
    }

    const frequencies: ActionFrequency[] = []
    if (sum > 0) {
      for (let a = 0; a < numActions; a++) {
        frequencies.push({
          action: node.actions[a].label,
          frequency: tree.strategySum[base + a] / sum,
          ev: 0,
        })
      }
    } else {
      const uniform = 1.0 / numActions
      for (let a = 0; a < numActions; a++) {
        frequencies.push({
          action: node.actions[a].label,
          frequency: uniform,
          ev: 0,
        })
      }
    }

    if (!result[notation]) result[notation] = []
    result[notation].push({ combo: comboLabel, card1: c1, card2: c2, frequencies })
  }

  return result
}

/**
 * Get aggregate strategy across all hands in the range at a node.
 */
export function getAggregateStrategy(
  tree: GameTreeData,
  nodeIdx: number,
): ActionFrequency[] {
  const node = tree.nodes[nodeIdx]
  if (node.type !== NodeType.PlayerOOP && node.type !== NodeType.PlayerIP) return []

  const hands = node.player === 0 ? tree.oopHands : tree.ipHands
  const weights = node.player === 0 ? tree.oopWeights : tree.ipWeights
  const handCount = hands.length
  const numActions = node.actions.length
  const offset = node.strategyOffset

  const totalFreqs = new Array(numActions).fill(0)
  let totalWeight = 0

  for (let h = 0; h < handCount; h++) {
    const base = offset + h * numActions
    const w = weights[h]

    let sum = 0
    for (let a = 0; a < numActions; a++) {
      sum += tree.strategySum[base + a]
    }

    if (sum > 0) {
      for (let a = 0; a < numActions; a++) {
        totalFreqs[a] += (tree.strategySum[base + a] / sum) * w
      }
    } else {
      const uniform = 1.0 / numActions
      for (let a = 0; a < numActions; a++) {
        totalFreqs[a] += uniform * w
      }
    }

    totalWeight += w
  }

  if (totalWeight > 0) {
    return node.actions.map((action, a) => ({
      action: action.label,
      frequency: totalFreqs[a] / totalWeight,
      ev: 0,
    }))
  }

  return node.actions.map(action => ({
    action: action.label,
    frequency: 1.0 / numActions,
    ev: 0,
  }))
}

/**
 * Build a full NodeQueryResult for the UI.
 */
export function queryNode(tree: GameTreeData, query: NodeQuery | number): NodeQueryResult {
  const nodeIdx = typeof query === 'number' ? query : query.nodeIdx
  const handIdx = typeof query === 'number' ? undefined : query.handIdx
  const node = tree.nodes[nodeIdx]
  const actionHistory = getActionHistory(tree, nodeIdx)

  const handStrategies = getRangeStrategy(tree, nodeIdx)
  const comboStrategies = getComboStrategies(tree, nodeIdx)
  const aggregateFrequencies = getAggregateStrategy(tree, nodeIdx)

  const hands = node.player === 0 ? tree.oopHands : tree.ipHands

  // Compute per-action EVs for a specific hand if requested
  let handEVs: number[] | undefined
  const handNotation = typeof query === 'number' ? undefined : query.handNotation

  if (handIdx !== undefined && handIdx >= 0 && handIdx < hands.length) {
    handEVs = computeActionEVs(tree, nodeIdx, handIdx)
  } else if (handNotation) {
    // Find all combo indices matching this notation and average their EVs
    const matchingIndices: number[] = []
    for (let h = 0; h < hands.length; h++) {
      if (getHandNotation(hands[h][0], hands[h][1]) === handNotation) {
        matchingIndices.push(h)
      }
    }
    if (matchingIndices.length > 0) {
      const numActions = node.actions.length
      const avgEVs = new Array(numActions).fill(0)
      for (const idx of matchingIndices) {
        const evs = computeActionEVs(tree, nodeIdx, idx)
        for (let a = 0; a < numActions; a++) {
          avgEVs[a] += evs[a]
        }
      }
      for (let a = 0; a < numActions; a++) {
        avgEVs[a] /= matchingIndices.length
      }
      handEVs = avgEVs
    }
  }

  return {
    nodeIdx,
    actions: node.actions.map(a => a.label),
    player: node.player,
    pot: node.pot,
    stack: node.stack,
    street: node.street,
    actionHistory,
    handStrategies,
    comboStrategies,
    aggregateFrequencies,
    childIndices: node.children,
    totalCombos: hands.length,
    handEVs,
  }
}

/**
 * Get all player nodes in the tree (for navigation).
 */
export function getPlayerNodes(tree: GameTreeData): {
  idx: number
  player: number
  actionHistory: string[]
  pot: number
  street: number
}[] {
  const result: {
    idx: number
    player: number
    actionHistory: string[]
    pot: number
    street: number
  }[] = []

  for (let i = 0; i < tree.nodes.length; i++) {
    const node = tree.nodes[i]
    if (node.type === NodeType.PlayerOOP || node.type === NodeType.PlayerIP) {
      result.push({
        idx: i,
        player: node.player,
        actionHistory: getActionHistory(tree, i),
        pot: node.pot,
        street: node.street,
      })
    }
  }

  return result
}

/**
 * Get the dominant action for a hand at a node (highest frequency).
 */
export function getDominantAction(
  tree: GameTreeData,
  nodeIdx: number,
  handNotation: string,
): string | null {
  const strategies = getRangeStrategy(tree, nodeIdx)
  const handStrategy = strategies[handNotation]
  if (!handStrategy || handStrategy.length === 0) return null

  let maxFreq = 0
  let dominant = handStrategy[0].action

  for (const af of handStrategy) {
    if (af.frequency > maxFreq) {
      maxFreq = af.frequency
      dominant = af.action
    }
  }

  return dominant
}
