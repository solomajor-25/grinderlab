/**
 * Card encoding for the equity engine.
 * Each card is an integer 0-51.
 * rank = card >> 2  (0=2, 1=3, ..., 12=Ace)
 * suit = card & 3   (0=clubs, 1=diamonds, 2=hearts, 3=spades)
 */

import type { Card, Rank, Suit } from '@/types'

// Rank mapping: our types use string ranks, engine uses 0-12
const RANK_TO_INT: Record<Rank, number> = {
  '2': 0, '3': 1, '4': 2, '5': 3, '6': 4, '7': 5, '8': 6,
  '9': 7, 'T': 8, 'J': 9, 'Q': 10, 'K': 11, 'A': 12,
}

const INT_TO_RANK: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

const SUIT_TO_INT: Record<Suit, number> = {
  'c': 0, 'd': 1, 'h': 2, 's': 3,
}

const INT_TO_SUIT: Suit[] = ['c', 'd', 'h', 's']

/** Convert a Card object to an integer 0-51 */
export function cardToInt(card: Card): number {
  return RANK_TO_INT[card.rank] * 4 + SUIT_TO_INT[card.suit]
}

/** Convert an integer 0-51 to a Card object */
export function intToCard(n: number): Card {
  return { rank: INT_TO_RANK[n >> 2], suit: INT_TO_SUIT[n & 3] }
}

/** Get the rank index (0-12) from a card integer */
export function rankOf(card: number): number {
  return card >> 2
}

/** Get the suit index (0-3) from a card integer */
export function suitOf(card: number): number {
  return card & 3
}

/** Full 52-card deck as integers */
export function fullDeck(): number[] {
  const deck: number[] = []
  for (let i = 0; i < 52; i++) deck.push(i)
  return deck
}

/** Deck minus excluded cards */
export function deckWithout(excluded: number[]): number[] {
  const set = new Set(excluded)
  return fullDeck().filter(c => !set.has(c))
}

/** Parse a short string like "Ah" or "Ts" to a card integer */
export function parseCardStr(s: string): number {
  const rank = s[0] as Rank
  const suit = s[1] as Suit
  return cardToInt({ rank, suit })
}

/** Format a card integer to a short string like "Ah" */
export function formatCardInt(n: number): string {
  const card = intToCard(n)
  return `${card.rank}${card.suit}`
}

export { RANK_TO_INT, INT_TO_RANK, SUIT_TO_INT, INT_TO_SUIT }
