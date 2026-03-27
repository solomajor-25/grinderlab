import type { Card, Suit } from '@/types'
import { cn } from '@/lib/utils'

interface PokerCardProps {
  card: Card
  size?: 'sm' | 'md' | 'lg'
  faceDown?: boolean
}

const SUIT_SYMBOL: Record<Suit, string> = {
  s: '♠',
  h: '♥',
  d: '♦',
  c: '♣',
}

const suitColor: Record<Suit, string> = {
  h: 'text-red-600',
  d: 'text-red-600',
  s: 'text-black',
  c: 'text-black',
}

const sizes = {
  sm: 'px-1 py-0.5 text-xs',
  md: 'px-1.5 py-1 text-sm',
  lg: 'px-2 py-1.5 text-base',
}

export function PokerCard({ card, size = 'md', faceDown }: PokerCardProps) {
  if (faceDown) {
    return (
      <span className={cn(
        'inline-flex items-center justify-center font-mono font-medium bg-forest text-white rounded border border-forest-dark shadow-sm',
        sizes[size]
      )}>
        ??
      </span>
    )
  }

  return (
    <span className={cn(
      'inline-flex items-center justify-center font-mono font-medium bg-white rounded border border-gray-200 shadow-sm',
      suitColor[card.suit],
      sizes[size]
    )}>
      {card.rank}{SUIT_SYMBOL[card.suit]}
    </span>
  )
}

export function HandDisplay({ cards, size = 'md' }: { cards: Card[]; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className="inline-flex gap-1">
      {cards.map((card, i) => (
        <PokerCard key={i} card={card} size={size} />
      ))}
    </span>
  )
}
