/**
 * Precomputed showdown values.
 * For a given board, builds an OOP x IP outcome matrix
 * to avoid redundant hand evaluation during CFR iterations.
 */

import { evaluateHand } from '../hand-evaluator'

/**
 * Precompute showdown outcomes for all OOP vs IP hand matchups.
 * Returns Int8Array where:
 *   +1 = OOP wins
 *   -1 = IP wins
 *    0 = tie (split pot)
 *
 * Index: oopIdx * ipHandCount + ipIdx
 */
export function precomputeShowdowns(
  board: number[],
  oopHands: [number, number][],
  ipHands: [number, number][],
): Int8Array {
  const oopCount = oopHands.length
  const ipCount = ipHands.length
  const matrix = new Int8Array(oopCount * ipCount)

  // Pre-evaluate all hands against the board
  const oopValues = new Int32Array(oopCount)
  const ipValues = new Int32Array(ipCount)

  for (let i = 0; i < oopCount; i++) {
    const cards = [...board, oopHands[i][0], oopHands[i][1]]
    oopValues[i] = evaluateHand(cards)
  }

  for (let j = 0; j < ipCount; j++) {
    const cards = [...board, ipHands[j][0], ipHands[j][1]]
    ipValues[j] = evaluateHand(cards)
  }

  // Fill the matrix
  for (let i = 0; i < oopCount; i++) {
    const oopCard0 = oopHands[i][0]
    const oopCard1 = oopHands[i][1]
    const oopVal = oopValues[i]
    const rowOffset = i * ipCount

    for (let j = 0; j < ipCount; j++) {
      // Check for card conflicts (can't both hold the same card)
      const ipCard0 = ipHands[j][0]
      const ipCard1 = ipHands[j][1]
      if (oopCard0 === ipCard0 || oopCard0 === ipCard1 ||
          oopCard1 === ipCard0 || oopCard1 === ipCard1) {
        // Conflict — mark as 0 (will be excluded from reach probability)
        matrix[rowOffset + j] = 0
        continue
      }

      const ipVal = ipValues[j]
      if (oopVal > ipVal) matrix[rowOffset + j] = 1
      else if (oopVal < ipVal) matrix[rowOffset + j] = -1
      // else 0 (tie) — already initialized
    }
  }

  return matrix
}

/**
 * Check if two hands share any cards (card conflict).
 */
export function handsConflict(
  hand1: [number, number],
  hand2: [number, number],
): boolean {
  return hand1[0] === hand2[0] || hand1[0] === hand2[1] ||
         hand1[1] === hand2[0] || hand1[1] === hand2[1]
}

/**
 * Check if a hand conflicts with any board cards.
 */
export function handConflictsWithBoard(
  hand: [number, number],
  board: number[],
): boolean {
  for (const bc of board) {
    if (hand[0] === bc || hand[1] === bc) return true
  }
  return false
}
