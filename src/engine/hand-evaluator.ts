/**
 * Poker hand evaluator using bit manipulation.
 * Evaluates 5-7 card hands and returns a comparable integer (higher = better).
 *
 * Hand classes (high nibble of result):
 * 8 = Straight Flush
 * 7 = Four of a Kind
 * 6 = Full House
 * 5 = Flush
 * 4 = Straight
 * 3 = Three of a Kind
 * 2 = Two Pair
 * 1 = One Pair
 * 0 = High Card
 */

import { rankOf, suitOf } from './card'

// Hand class constants
const STRAIGHT_FLUSH = 8
const FOUR_OF_A_KIND = 7
const FULL_HOUSE = 6
const FLUSH = 5
const STRAIGHT = 4
const THREE_OF_A_KIND = 3
const TWO_PAIR = 2
const ONE_PAIR = 1
const HIGH_CARD = 0

/**
 * Evaluate a 5-card hand. Returns a comparable integer.
 * Higher value = better hand.
 */
function evaluate5(cards: number[]): number {
  // Build rank counts and suit bitmasks
  const rankCounts = new Int32Array(13)
  const suitBits = new Int32Array(4) // bitmask of ranks per suit
  let rankBits = 0 // bitmask of all ranks present

  for (let i = 0; i < 5; i++) {
    const r = rankOf(cards[i])
    const s = suitOf(cards[i])
    rankCounts[r]++
    suitBits[s] |= (1 << r)
    rankBits |= (1 << r)
  }

  // Check for flush
  let isFlush = false
  let flushBits = 0
  for (let s = 0; s < 4; s++) {
    if (popcount(suitBits[s]) >= 5) {
      isFlush = true
      flushBits = suitBits[s]
      break
    }
  }

  // Check for straight
  const straightHigh = findStraightHigh(isFlush ? flushBits : rankBits)
  const isStraight = straightHigh >= 0

  // Straight flush
  if (isFlush && isStraight) {
    return (STRAIGHT_FLUSH << 20) | (straightHigh << 16)
  }

  // Count groups
  let fours = -1, threes = -1, pairs: number[] = []
  for (let r = 12; r >= 0; r--) {
    if (rankCounts[r] === 4) fours = r
    else if (rankCounts[r] === 3) threes = r
    else if (rankCounts[r] === 2) pairs.push(r)
  }

  // Four of a kind
  if (fours >= 0) {
    const kicker = highestRankExcluding(rankCounts, [fours], 1)
    return (FOUR_OF_A_KIND << 20) | (fours << 16) | (kicker[0] << 12)
  }

  // Full house
  if (threes >= 0 && pairs.length > 0) {
    return (FULL_HOUSE << 20) | (threes << 16) | (pairs[0] << 12)
  }

  // Flush
  if (isFlush) {
    const top5 = topNBits(flushBits, 5)
    return (FLUSH << 20) | packKickers(top5)
  }

  // Straight
  if (isStraight) {
    return (STRAIGHT << 20) | (straightHigh << 16)
  }

  // Three of a kind
  if (threes >= 0) {
    const kickers = highestRankExcluding(rankCounts, [threes], 2)
    return (THREE_OF_A_KIND << 20) | (threes << 16) | packKickers(kickers)
  }

  // Two pair
  if (pairs.length >= 2) {
    const kickers = highestRankExcluding(rankCounts, [pairs[0], pairs[1]], 1)
    return (TWO_PAIR << 20) | (pairs[0] << 16) | (pairs[1] << 12) | packKickers(kickers)
  }

  // One pair
  if (pairs.length === 1) {
    const kickers = highestRankExcluding(rankCounts, [pairs[0]], 3)
    return (ONE_PAIR << 20) | (pairs[0] << 16) | packKickers(kickers)
  }

  // High card
  const top5Ranks = topNBits(rankBits, 5)
  return (HIGH_CARD << 20) | packKickers(top5Ranks)
}

/**
 * Evaluate the best 5-card hand from 5, 6, or 7 cards.
 */
export function evaluateHand(cards: number[]): number {
  const n = cards.length
  if (n === 5) return evaluate5(cards)

  let best = 0

  if (n === 6) {
    // C(6,5) = 6 combinations
    for (let skip = 0; skip < 6; skip++) {
      const hand5: number[] = []
      for (let i = 0; i < 6; i++) {
        if (i !== skip) hand5.push(cards[i])
      }
      const val = evaluate5(hand5)
      if (val > best) best = val
    }
    return best
  }

  if (n === 7) {
    // C(7,5) = 21 combinations - skip 2 cards
    for (let s1 = 0; s1 < 7; s1++) {
      for (let s2 = s1 + 1; s2 < 7; s2++) {
        const hand5: number[] = []
        for (let i = 0; i < 7; i++) {
          if (i !== s1 && i !== s2) hand5.push(cards[i])
        }
        const val = evaluate5(hand5)
        if (val > best) best = val
      }
    }
    return best
  }

  return 0
}

// --- Helpers ---

function popcount(x: number): number {
  x = x - ((x >> 1) & 0x55555555)
  x = (x & 0x33333333) + ((x >> 2) & 0x33333333)
  return (((x + (x >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24
}

/**
 * Find the highest card of a straight in the rank bitmask.
 * Returns -1 if no straight. Handles ace-low straight (A-2-3-4-5).
 */
function findStraightHigh(bits: number): number {
  // Check 5-bit windows from top
  for (let high = 12; high >= 4; high--) {
    const mask = 0x1F << (high - 4)
    if ((bits & mask) === mask) return high
  }
  // Check ace-low straight: A-2-3-4-5 = bits 12,0,1,2,3
  if ((bits & 0x100F) === 0x100F) return 3 // 5-high straight
  return -1
}

/** Get top N rank indices from a bitmask, highest first */
function topNBits(bits: number, n: number): number[] {
  const result: number[] = []
  for (let r = 12; r >= 0 && result.length < n; r--) {
    if (bits & (1 << r)) result.push(r)
  }
  return result
}

/** Get highest N ranks excluding specific ranks */
function highestRankExcluding(counts: Int32Array, exclude: number[], n: number): number[] {
  const result: number[] = []
  const exSet = new Set(exclude)
  for (let r = 12; r >= 0 && result.length < n; r--) {
    if (!exSet.has(r) && counts[r] > 0) result.push(r)
  }
  return result
}

/** Pack up to 5 kicker ranks into bits 0-15. Each rank gets 4 bits. */
function packKickers(ranks: number[]): number {
  let result = 0
  for (let i = 0; i < ranks.length && i < 4; i++) {
    result |= (ranks[i] << (12 - i * 4))
  }
  return result
}

/**
 * Get the hand class name for display purposes.
 */
export function handClassName(value: number): string {
  const cls = value >> 20
  switch (cls) {
    case STRAIGHT_FLUSH: return 'Straight Flush'
    case FOUR_OF_A_KIND: return 'Four of a Kind'
    case FULL_HOUSE: return 'Full House'
    case FLUSH: return 'Flush'
    case STRAIGHT: return 'Straight'
    case THREE_OF_A_KIND: return 'Three of a Kind'
    case TWO_PAIR: return 'Two Pair'
    case ONE_PAIR: return 'One Pair'
    default: return 'High Card'
  }
}
