/**
 * Range utilities: expand hand notation ("AKs") to specific card combinations.
 */

import { RANK_TO_INT } from './card'
import type { Rank } from '@/types'

// Rank order matching standard notation (A=12, K=11, ..., 2=0)
const NOTATION_RANKS: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

/**
 * Expand a hand string like "AKs", "QQ", "T9o" into all specific
 * two-card combos as [cardInt, cardInt] tuples.
 */
export function expandHand(hand: string): [number, number][] {
  const combos: [number, number][] = []

  if (hand.length === 2) {
    // Pair: e.g., "AA" → 6 combos (4 choose 2)
    const r = RANK_TO_INT[hand[0] as Rank]
    for (let s1 = 0; s1 < 4; s1++) {
      for (let s2 = s1 + 1; s2 < 4; s2++) {
        combos.push([r * 4 + s1, r * 4 + s2])
      }
    }
  } else if (hand[2] === 's') {
    // Suited: e.g., "AKs" → 4 combos
    const r1 = RANK_TO_INT[hand[0] as Rank]
    const r2 = RANK_TO_INT[hand[1] as Rank]
    for (let s = 0; s < 4; s++) {
      combos.push([r1 * 4 + s, r2 * 4 + s])
    }
  } else {
    // Offsuit: e.g., "AKo" → 12 combos
    const r1 = RANK_TO_INT[hand[0] as Rank]
    const r2 = RANK_TO_INT[hand[1] as Rank]
    for (let s1 = 0; s1 < 4; s1++) {
      for (let s2 = 0; s2 < 4; s2++) {
        if (s1 !== s2) {
          combos.push([r1 * 4 + s1, r2 * 4 + s2])
        }
      }
    }
  }

  return combos
}

/**
 * Build a range (list of card-pair combos) from an action map,
 * including only hands matching the specified action classes.
 */
export function buildRange(
  rangeMap: Record<string, string>,
  includeActions: string[]
): [number, number][] {
  const actionSet = new Set(includeActions)
  const combos: [number, number][] = []

  for (const [hand, action] of Object.entries(rangeMap)) {
    if (actionSet.has(action)) {
      combos.push(...expandHand(hand))
    }
  }

  return combos
}

/**
 * Build a range from a boolean selection map (for equity calculator UI).
 */
export function buildRangeFromSelection(
  selected: Record<string, boolean>
): [number, number][] {
  const combos: [number, number][] = []

  for (const [hand, isSelected] of Object.entries(selected)) {
    if (isSelected) {
      combos.push(...expandHand(hand))
    }
  }

  return combos
}

/**
 * Filter combos to remove any that contain dead cards.
 */
export function filterDeadCards(
  combos: [number, number][],
  deadCards: number[]
): [number, number][] {
  const dead = new Set(deadCards)
  return combos.filter(([a, b]) => !dead.has(a) && !dead.has(b))
}

/**
 * Get the canonical hand notation for two card integers.
 * E.g., Ah Kh → "AKs", Ah Kd → "AKo", Ah Ad → "AA"
 */
export function getHandNotation(card1: number, card2: number): string {
  let r1 = card1 >> 2
  let r2 = card2 >> 2
  const s1 = card1 & 3
  const s2 = card2 & 3

  // Ensure higher rank first
  if (r1 < r2) { [r1, r2] = [r2, r1] }

  const rank1 = NOTATION_RANKS[12 - r1]
  const rank2 = NOTATION_RANKS[12 - r2]

  if (r1 === r2) return `${rank1}${rank2}`
  if (s1 === s2) return `${rank1}${rank2}s`
  return `${rank1}${rank2}o`
}

/**
 * All 169 canonical hands in matrix order (row-major, A-high to 2-low).
 * Returns [row][col] where row 0 = A, col 0 = A.
 * Diagonal = pairs, above = suited, below = offsuit.
 */
export function getHandMatrix(): string[][] {
  const matrix: string[][] = []
  for (let i = 0; i < 13; i++) {
    const row: string[] = []
    for (let j = 0; j < 13; j++) {
      if (i === j) {
        row.push(`${NOTATION_RANKS[i]}${NOTATION_RANKS[j]}`)
      } else if (i < j) {
        // Above diagonal = suited (row rank > col rank in display)
        row.push(`${NOTATION_RANKS[i]}${NOTATION_RANKS[j]}s`)
      } else {
        // Below diagonal = offsuit
        row.push(`${NOTATION_RANKS[j]}${NOTATION_RANKS[i]}o`)
      }
    }
    matrix.push(row)
  }
  return matrix
}

/**
 * Count total combos for a selection of hands.
 */
export function countCombos(selected: Record<string, boolean>): number {
  let total = 0
  for (const [hand, isSelected] of Object.entries(selected)) {
    if (!isSelected) continue
    if (hand.length === 2) total += 6       // pair
    else if (hand[2] === 's') total += 4    // suited
    else total += 12                         // offsuit
  }
  return total
}

/** Total possible combos (1326) */
export const TOTAL_COMBOS = 1326
