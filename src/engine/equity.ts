/**
 * Poker equity calculator.
 * Supports hand vs range and range vs range with board cards.
 * Uses exhaustive enumeration for small runout counts, Monte Carlo for large.
 */

import { evaluateHand } from './hand-evaluator'
import { deckWithout } from './card'

export interface EquityResult {
  equity: number   // 0-1
  wins: number
  ties: number
  total: number
}

/**
 * Calculate equity of a specific hand vs a range of hands.
 * @param hand - Hero's two hole cards [card1, card2]
 * @param range - Array of opponent hand combos, each [card1, card2]
 * @param board - Community cards (0-5 cards)
 * @param maxIterations - Max Monte Carlo iterations (default 10000)
 */
export function handVsRange(
  hand: [number, number],
  range: [number, number][],
  board: number[] = [],
  maxIterations = 10000
): EquityResult {
  // Remove combos that conflict with hero's hand or board
  const dead = new Set([hand[0], hand[1], ...board])
  const validRange = range.filter(([a, b]) => !dead.has(a) && !dead.has(b))

  if (validRange.length === 0) {
    return { equity: 0.5, wins: 0, ties: 0, total: 0 }
  }

  const cardsTocome = 5 - board.length
  const remainingDeck = deckWithout([hand[0], hand[1], ...board])

  let wins = 0
  let ties = 0
  let total = 0

  if (cardsTocome === 0) {
    // All board cards dealt — just compare against each villain hand
    for (const vHand of validRange) {
      if (dead.has(vHand[0]) || dead.has(vHand[1])) continue
      const heroVal = evaluateHand([...hand, ...board])
      const villVal = evaluateHand([...vHand, ...board])
      total++
      if (heroVal > villVal) wins++
      else if (heroVal === villVal) ties++
    }
  } else if (cardsTocome <= 2 && validRange.length <= 200) {
    // Exhaustive enumeration for turn/river
    enumerateExhaustive(hand, validRange, board, remainingDeck, cardsTocome, (w, t, n) => {
      wins += w; ties += t; total += n
    })
  } else {
    // Monte Carlo sampling
    monteCarloHvR(hand, validRange, board, remainingDeck, cardsTocome, maxIterations, (w, t, n) => {
      wins += w; ties += t; total += n
    })
  }

  return {
    equity: total > 0 ? (wins + ties * 0.5) / total : 0.5,
    wins, ties, total
  }
}

/**
 * Calculate equity of range vs range.
 */
export function rangeVsRange(
  range1: [number, number][],
  range2: [number, number][],
  board: number[] = [],
  maxIterations = 10000
): { player1: EquityResult; player2: EquityResult } {
  const deadBoard = new Set(board)
  let p1Wins = 0, p2Wins = 0, p1Ties = 0, total = 0

  // For each combo matchup
  const matchups: [number, number, number, number][] = []
  for (const h1 of range1) {
    if (deadBoard.has(h1[0]) || deadBoard.has(h1[1])) continue
    for (const h2 of range2) {
      if (deadBoard.has(h2[0]) || deadBoard.has(h2[1])) continue
      // No card overlap
      if (h1[0] === h2[0] || h1[0] === h2[1] || h1[1] === h2[0] || h1[1] === h2[1]) continue
      matchups.push([h1[0], h1[1], h2[0], h2[1]])
    }
  }

  if (matchups.length === 0) {
    return {
      player1: { equity: 0.5, wins: 0, ties: 0, total: 0 },
      player2: { equity: 0.5, wins: 0, ties: 0, total: 0 },
    }
  }

  const cardsTocome = 5 - board.length

  if (cardsTocome === 0) {
    // Just evaluate all matchups
    for (const [a, b, c, d] of matchups) {
      const v1 = evaluateHand([a, b, ...board])
      const v2 = evaluateHand([c, d, ...board])
      total++
      if (v1 > v2) p1Wins++
      else if (v1 === v2) p1Ties++
      else p2Wins++
    }
  } else {
    // Monte Carlo: sample matchups and runouts
    const iters = Math.min(maxIterations, matchups.length * 50)
    for (let i = 0; i < iters; i++) {
      const m = matchups[Math.floor(Math.random() * matchups.length)]
      const remaining = deckWithout([m[0], m[1], m[2], m[3], ...board])
      const runout = sampleCards(remaining, cardsTocome)
      const fullBoard = [...board, ...runout]
      const v1 = evaluateHand([m[0], m[1], ...fullBoard])
      const v2 = evaluateHand([m[2], m[3], ...fullBoard])
      total++
      if (v1 > v2) p1Wins++
      else if (v1 === v2) p1Ties++
      else p2Wins++
    }
  }

  return {
    player1: {
      equity: total > 0 ? (p1Wins + p1Ties * 0.5) / total : 0.5,
      wins: p1Wins, ties: p1Ties, total
    },
    player2: {
      equity: total > 0 ? (p2Wins + p1Ties * 0.5) / total : 0.5,
      wins: p2Wins, ties: p1Ties, total
    },
  }
}

/**
 * Calculate equity for N players (2-6). Each player is either a specific hand or a range.
 * Uses Monte Carlo sampling for all cases.
 */
export interface MultiwayPlayer {
  type: 'hand' | 'range'
  hand?: [number, number]
  range?: [number, number][]
}

export function multiwayEquity(
  players: MultiwayPlayer[],
  board: number[] = [],
  maxIterations = 20000
): EquityResult[] {
  const n = players.length
  // Track equity as fractional points (1.0 for a win, 1/k for a k-way tie)
  const equityPoints = new Array(n).fill(0)
  const wins = new Array(n).fill(0)
  const ties = new Array(n).fill(0)
  let total = 0
  const cardsTocome = 5 - board.length

  for (let iter = 0; iter < maxIterations; iter++) {
    const hands: [number, number][] = []
    const allDead = new Set(board)
    let valid = true

    for (const p of players) {
      if (p.type === 'hand' && p.hand) {
        if (allDead.has(p.hand[0]) || allDead.has(p.hand[1])) { valid = false; break }
        allDead.add(p.hand[0])
        allDead.add(p.hand[1])
        hands.push(p.hand)
      } else if (p.type === 'range' && p.range) {
        const validCombos = p.range.filter(([a, b]) => !allDead.has(a) && !allDead.has(b))
        if (validCombos.length === 0) { valid = false; break }
        const combo = validCombos[Math.floor(Math.random() * validCombos.length)]
        allDead.add(combo[0])
        allDead.add(combo[1])
        hands.push(combo)
      } else {
        valid = false; break
      }
    }

    if (!valid) continue

    const remaining = deckWithout([...allDead])
    if (remaining.length < cardsTocome) continue
    const runout = sampleCards(remaining, cardsTocome)
    const fullBoard = [...board, ...runout]

    const values = hands.map(h => evaluateHand([h[0], h[1], ...fullBoard]))
    const best = Math.max(...values)
    const winnersCount = values.filter(v => v === best).length

    total++
    for (let i = 0; i < n; i++) {
      if (values[i] === best) {
        if (winnersCount === 1) {
          wins[i]++
          equityPoints[i] += 1
        } else {
          ties[i]++
          equityPoints[i] += 1 / winnersCount
        }
      }
    }
  }

  return players.map((_, i) => ({
    equity: total > 0 ? equityPoints[i] / total : 1 / n,
    wins: wins[i],
    ties: ties[i],
    total,
  }))
}

// --- Internal helpers ---

function enumerateExhaustive(
  hand: [number, number],
  range: [number, number][],
  board: number[],
  deck: number[],
  cardsTocome: number,
  callback: (wins: number, ties: number, total: number) => void
) {
  let wins = 0, ties = 0, total = 0

  if (cardsTocome === 1) {
    for (const card of deck) {
      const fullBoard = [...board, card]
      for (const vHand of range) {
        if (card === vHand[0] || card === vHand[1]) continue
        const heroVal = evaluateHand([hand[0], hand[1], ...fullBoard])
        const villVal = evaluateHand([vHand[0], vHand[1], ...fullBoard])
        total++
        if (heroVal > villVal) wins++
        else if (heroVal === villVal) ties++
      }
    }
  } else if (cardsTocome === 2) {
    for (let i = 0; i < deck.length; i++) {
      for (let j = i + 1; j < deck.length; j++) {
        const fullBoard = [...board, deck[i], deck[j]]
        for (const vHand of range) {
          if (deck[i] === vHand[0] || deck[i] === vHand[1] ||
              deck[j] === vHand[0] || deck[j] === vHand[1]) continue
          const heroVal = evaluateHand([hand[0], hand[1], ...fullBoard])
          const villVal = evaluateHand([vHand[0], vHand[1], ...fullBoard])
          total++
          if (heroVal > villVal) wins++
          else if (heroVal === villVal) ties++
        }
      }
    }
  }

  callback(wins, ties, total)
}

function monteCarloHvR(
  hand: [number, number],
  range: [number, number][],
  board: number[],
  deck: number[],
  cardsTocome: number,
  iterations: number,
  callback: (wins: number, ties: number, total: number) => void
) {
  let wins = 0, ties = 0, total = 0

  for (let i = 0; i < iterations; i++) {
    // Pick random villain hand
    const vIdx = Math.floor(Math.random() * range.length)
    const vHand = range[vIdx]

    // Build remaining deck excluding villain hand
    const remaining = deck.filter(c => c !== vHand[0] && c !== vHand[1])
    if (remaining.length < cardsTocome) continue

    // Sample runout cards
    const runout = sampleCards(remaining, cardsTocome)
    const fullBoard = [...board, ...runout]

    const heroVal = evaluateHand([hand[0], hand[1], ...fullBoard])
    const villVal = evaluateHand([vHand[0], vHand[1], ...fullBoard])

    total++
    if (heroVal > villVal) wins++
    else if (heroVal === villVal) ties++
  }

  callback(wins, ties, total)
}

/** Sample n random cards from an array without replacement (Fisher-Yates partial) */
function sampleCards(deck: number[], n: number): number[] {
  const arr = [...deck]
  const result: number[] = []
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * (arr.length - i)) + i
    ;[arr[i], arr[idx]] = [arr[idx], arr[i]]
    result.push(arr[i])
  }
  return result
}
