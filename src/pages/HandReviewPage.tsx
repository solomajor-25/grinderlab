/**
 * Hand Review Page
 * Solver-style position card timeline for entering hand actions.
 * Auto-computes pot, auto-tags hero based on Setup position.
 */

import { useState, useMemo, useCallback } from 'react'
import {
  ClipboardCheck,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Trash2,
  Save,
  Tag,
  X,
  Shuffle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Trophy,
  BookOpen,
  Target,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { INT_TO_RANK } from '@/engine/card'
import {
  analyzeHand,
  type HandData,
  type StreetData,
  type HandAction,
  type HandReview,
  type VerdictLevel,
  type Street,
  type ActionType,
} from '@/engine/hand-review'
import type { Position } from '@/types'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const POSITIONS: Position[] = ['UTG', 'HJ', 'CO', 'BU', 'SB', 'BB']
const POSTFLOP_ORDER: Position[] = ['SB', 'BB', 'UTG', 'HJ', 'CO', 'BU']
const RANKS_DISPLAY = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const SUIT_SYMBOLS: Record<number, string> = { 0: '♣', 1: '♦', 2: '♥', 3: '♠' }
const SUIT_COLORS: Record<number, string> = {
  0: 'text-emerald-400', 1: 'text-blue-400', 2: 'text-red-500', 3: 'text-slate-300',
}
const SUIT_COLORS_LIGHT: Record<number, string> = {
  0: 'text-emerald-600', 1: 'text-blue-600', 2: 'text-red-600', 3: 'text-slate-800',
}

const VERDICT_CONFIG: Record<VerdictLevel, { color: string; bg: string; icon: typeof CheckCircle2; label: string }> = {
  excellent:  { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', icon: CheckCircle2, label: 'Excellent' },
  good:       { color: 'text-forest-light', bg: 'bg-forest/10 border-forest/30', icon: CheckCircle2, label: 'Good' },
  acceptable: { color: 'text-gold', bg: 'bg-gold/10 border-gold/30', icon: Info, label: 'Acceptable' },
  inaccuracy: { color: 'text-warning', bg: 'bg-warning/10 border-warning/30', icon: AlertTriangle, label: 'Inaccuracy' },
  mistake:    { color: 'text-error', bg: 'bg-error/10 border-error/30', icon: AlertTriangle, label: 'Mistake' },
}

const STREET_LABELS: Record<Street, string> = { preflop: 'Preflop', flop: 'Flop', turn: 'Turn', river: 'River' }

const ACTION_STYLE: Record<string, string> = {
  fold:    'bg-error/20 text-error',
  check:   'bg-info/15 text-info',
  call:    'bg-info/20 text-info',
  bet:     'bg-forest/20 text-forest-light',
  raise:   'bg-purple-500/20 text-purple-400',
  'all-in': 'bg-red-500/25 text-red-400',
}

// ---------------------------------------------------------------------------
// Action slot types
// ---------------------------------------------------------------------------

type SlotAction = 'pending' | 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'all-in'

interface ActionSlot {
  position: Position
  action: SlotAction
  size?: number
  isReentry?: boolean
}

// ---------------------------------------------------------------------------
// Action helpers
// ---------------------------------------------------------------------------

function getAvailableActions(priorSlots: ActionSlot[], position: Position, street: Street, remainingStack: number): SlotAction[] {
  // If someone is already all-in and their bet >= our remaining stack,
  // we can only fold or call (which puts us all-in too). No raise possible.
  const facingAllIn = priorSlots.some(s => s.action === 'all-in')
  const highestBet = Math.max(0, ...priorSlots.filter(s => s.action === 'raise' || s.action === 'all-in' || s.action === 'bet').map(s => s.size ?? 0))
  const canRaise = remainingStack > highestBet && !facingAllIn

  if (street === 'preflop') {
    const hasRaise = priorSlots.some(s => s.action === 'raise' || s.action === 'all-in')
    if (!hasRaise) {
      if (position === 'BB') return canRaise ? ['check', 'raise', 'all-in'] : ['check', 'all-in']
      return canRaise ? ['fold', 'call', 'raise', 'all-in'] : ['fold', 'call']
    }
    if (!canRaise) return ['fold', 'call']
    return ['fold', 'call', 'raise', 'all-in']
  }
  // Postflop
  const hasAggression = priorSlots.some(s => s.action === 'bet' || s.action === 'raise' || s.action === 'all-in')
  if (!hasAggression) return canRaise ? ['check', 'bet', 'all-in'] : ['check', 'all-in']
  if (!canRaise) return ['fold', 'call']
  return ['fold', 'call', 'raise', 'all-in']
}

function getActionLabel(action: SlotAction, priorSlots: ActionSlot[], street: Street): string {
  if (action === 'fold') return 'Fold'
  if (action === 'check') return 'Check'
  if (action === 'call') return 'Call'
  if (action === 'bet') return 'Bet'
  if (action === 'all-in') return 'All-In'
  if (action === 'raise') {
    if (street === 'preflop') {
      const raiseCount = priorSlots.filter(s => s.action === 'raise').length
      if (raiseCount === 0) return 'Open'
      if (raiseCount === 1) return '3-Bet'
      if (raiseCount === 2) return '4-Bet'
      return 'Raise'
    }
    return 'Raise'
  }
  return action
}

function getInvested(priorSlots: ActionSlot[], position: Position, street: Street): number {
  if (street === 'preflop') {
    let inv = position === 'SB' ? 0.5 : position === 'BB' ? 1.0 : 0
    for (const s of priorSlots) {
      if (s.position !== position) continue
      if (s.action === 'raise' || s.action === 'all-in') inv = s.size ?? inv
      else if (s.action === 'call') {
        const maxInv = Math.max(...priorSlots.filter(x => x.action === 'raise' || x.action === 'all-in' || x.action === 'call').map(x => x.size ?? 0), 0)
        inv = maxInv
      }
    }
    return inv
  }
  let inv = 0
  for (const s of priorSlots) {
    if (s.position !== position) continue
    if (s.action === 'bet' || s.action === 'raise' || s.action === 'all-in') inv = s.size ?? inv
    else if (s.action === 'call') {
      const maxInv = Math.max(...priorSlots.filter(x => x.action === 'bet' || x.action === 'raise' || x.action === 'all-in').map(x => x.size ?? 0), 0)
      inv = maxInv
    }
  }
  return inv
}

function getDefaultSize(action: SlotAction, priorSlots: ActionSlot[], street: Street, pot: number, position: Position, remainingStack: number): number | undefined {
  if (action === 'all-in') return Math.round(remainingStack * 10) / 10
  if (action !== 'raise' && action !== 'bet') return undefined
  let size: number
  if (street === 'preflop') {
    const lastRaise = [...priorSlots].reverse().find(s => s.action === 'raise' || s.action === 'all-in')
    if (!lastRaise) size = position === 'SB' ? 3 : 2.5
    else size = Math.round((lastRaise.size ?? 2.5) * 3 * 10) / 10
  } else if (action === 'bet') {
    size = Math.round(pot * 0.66 * 10) / 10
  } else {
    const lastBet = [...priorSlots].reverse().find(s => s.action === 'bet' || s.action === 'raise' || s.action === 'all-in')
    size = Math.round((lastBet?.size ?? pot * 0.5) * 3 * 10) / 10
  }
  return Math.min(size, Math.round(remainingStack * 10) / 10)
}

/** Set an action on a slot, rebuilding the tail for re-entries after raises */
function setSlotAction(slots: ActionSlot[], idx: number, action: SlotAction, size?: number): ActionSlot[] {
  const newSlots: ActionSlot[] = slots.slice(0, idx).map(s => ({ ...s }))
  newSlots.push({ ...slots[idx], action, size })

  // Keep remaining pending slots from original
  for (let i = idx + 1; i < slots.length; i++) {
    if (slots[i].action === 'pending') {
      newSlots.push({ ...slots[i] })
    }
  }

  // If aggressive action, add re-entry for active positions before the aggressor
  // IMPORTANT: exclude the aggressor's own position and all-in players from re-entry
  if (action === 'raise' || action === 'bet' || action === 'all-in') {
    const aggressorPosition = slots[idx].position
    const tailPositions = new Set(newSlots.slice(idx + 1).map(s => s.position))
    for (let i = 0; i < idx; i++) {
      const s = newSlots[i]
      if (s.position === aggressorPosition) continue // never re-enter yourself
      if (s.action === 'all-in') continue // all-in players can't act again
      if (s.action !== 'fold' && s.action !== 'pending' && !tailPositions.has(s.position)) {
        newSlots.push({ position: s.position, action: 'pending', isReentry: true })
      }
    }
  }

  return newSlots
}

function computePreflopPot(slots: ActionSlot[]): number {
  const invested: Record<string, number> = { SB: 0.5, BB: 1.0 }
  for (const slot of slots) {
    if (slot.action === 'fold' || slot.action === 'pending' || slot.action === 'check') continue
    if (slot.action === 'raise' || slot.action === 'all-in') {
      invested[slot.position] = slot.size ?? 2.5
    } else if (slot.action === 'call') {
      invested[slot.position] = Math.max(...Object.values(invested))
    }
  }
  return Object.values(invested).reduce((a, b) => a + b, 0)
}

function computePostflopPot(slots: ActionSlot[], potBefore: number): number {
  const invested: Record<string, number> = {}
  for (const slot of slots) {
    if (slot.action === 'fold' || slot.action === 'pending' || slot.action === 'check') continue
    if (slot.action === 'bet' || slot.action === 'raise' || slot.action === 'all-in') {
      invested[slot.position] = slot.size ?? 0
    } else if (slot.action === 'call') {
      const maxBet = Object.keys(invested).length > 0 ? Math.max(...Object.values(invested)) : 0
      invested[slot.position] = maxBet
    }
  }
  return potBefore + Object.values(invested).reduce((a, b) => a + b, 0)
}

function deriveActivePositions(preflopSlots: ActionSlot[]): Position[] {
  const folded = new Set<Position>()
  const allIn = new Set<Position>()
  const active = new Set<Position>()
  for (const s of preflopSlots) {
    if (s.action === 'fold') folded.add(s.position)
    else if (s.action === 'all-in') { allIn.add(s.position); active.add(s.position) }
    else if (s.action !== 'pending') active.add(s.position)
  }
  // All-in players are in the pot but don't act postflop
  return POSTFLOP_ORDER.filter(p => active.has(p) && !folded.has(p) && !allIn.has(p))
}

// ---------------------------------------------------------------------------
// Saved review types
// ---------------------------------------------------------------------------

interface SavedReview {
  id: string
  timestamp: number
  hand: HandData
  review: HandReview
  notes: string
}

function loadSavedReviews(): SavedReview[] {
  try {
    const raw = localStorage.getItem('grinderlab-hand-reviews')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function persistReviews(reviews: SavedReview[]) {
  localStorage.setItem('grinderlab-hand-reviews', JSON.stringify(reviews))
}

// ---------------------------------------------------------------------------
// Card display helpers
// ---------------------------------------------------------------------------

function CardLabel({ card, size = 'md' }: { card: number; size?: 'sm' | 'md' }) {
  const rank = INT_TO_RANK[card >> 2]
  const suit = card & 3
  const sizeClass = size === 'sm' ? 'text-xs px-1 py-0.5' : 'text-sm px-1.5 py-0.5'
  return (
    <span className={cn(
      'inline-flex items-center font-mono font-semibold rounded border shadow-sm bg-white border-gray-200',
      sizeClass,
    )}>
      <span className="text-graphite">{rank}</span>
      <span className={cn(SUIT_COLORS_LIGHT[suit])}>{SUIT_SYMBOLS[suit]}</span>
    </span>
  )
}

function CardSlot({ card, onClick, label, size = 'md' }: {
  card: number | null; onClick?: () => void; label?: string; size?: 'sm' | 'md'
}) {
  const sizeClass = size === 'sm' ? 'w-8 h-10' : 'w-10 h-12'
  if (card !== null) {
    return (
      <button onClick={onClick} className={cn(sizeClass, 'relative group')} title="Click to change">
        <CardLabel card={card} size={size} />
        {onClick && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-600 text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <X className="w-2 h-2" />
          </span>
        )}
      </button>
    )
  }
  return (
    <button onClick={onClick} className={cn(
      sizeClass,
      'rounded border-2 border-dashed flex items-center justify-center text-[10px] font-medium transition-colors',
      'border-slate-border/40 text-ink/30 hover:border-forest/50 hover:text-forest/60',
      'light:border-ivory-border/60 light:text-graphite/30 light:hover:border-forest/50',
    )}>
      {label || '+'}
    </button>
  )
}

function CardPicker({ deadCards, onPick, onClose }: {
  deadCards: number[]; onPick: (card: number) => void; onClose: () => void
}) {
  const dead = new Set(deadCards)
  return (
    <div className="p-3 rounded-lg border bg-slate-surface border-slate-border light:bg-ivory-surface light:border-ivory-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-caption text-ink/50 light:text-graphite/50">Select a card</span>
        <button onClick={onClose} className="text-ink/40 hover:text-ink"><X className="w-4 h-4" /></button>
      </div>
      <div className="inline-grid gap-px" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
        {[3, 2, 1, 0].map(suit =>
          RANKS_DISPLAY.map(rank => {
            const rankIdx = INT_TO_RANK.indexOf(rank as any)
            const cardInt = rankIdx * 4 + suit
            const isDead = dead.has(cardInt)
            return (
              <button
                key={cardInt}
                disabled={isDead}
                onClick={() => onPick(cardInt)}
                className={cn(
                  'w-7 h-7 text-[11px] font-mono font-medium rounded-sm transition-colors flex items-center justify-center',
                  isDead
                    ? 'bg-slate-card/30 text-ink/10 cursor-not-allowed'
                    : cn('hover:bg-forest/20 cursor-pointer', SUIT_COLORS[suit], 'bg-slate-card/60'),
                )}
              >
                {rank}{SUIT_SYMBOLS[suit]}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Position Card (solver-style stacked action buttons)
// ---------------------------------------------------------------------------

function PositionCard({ slot, idx, allSlots, street, pot, heroPosition, effectiveStack, onSetAction, onSizeChange }: {
  slot: ActionSlot
  idx: number
  allSlots: ActionSlot[]
  street: Street
  pot: number
  heroPosition: Position
  effectiveStack: number
  onSetAction: (idx: number, action: SlotAction) => void
  onSizeChange: (idx: number, size: number) => void
}) {
  const priorSlots = allSlots.slice(0, idx).filter(s => s.action !== 'pending')
  const isHero = slot.position === heroPosition
  const isPending = slot.action === 'pending'

  // Compute remaining stack for this position (effective stack minus what they've invested across all prior actions in this street)
  const investedThisStreet = getInvested(priorSlots, slot.position, street)
  const remainingStack = Math.max(0, effectiveStack - investedThisStreet)
  const available = getAvailableActions(priorSlots, slot.position, street, remainingStack)

  return (
    <div className={cn(
      'rounded border transition-all shrink-0',
      slot.isReentry ? 'w-[80px]' : 'w-[88px]',
      isPending
        ? 'border-slate-border/25 bg-slate-card/10'
        : 'border-slate-border/30 bg-slate-card/20',
    )}>
      {/* Position header */}
      <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5">
        <span className="text-[10px] font-bold text-ink/80">
          {slot.isReentry && <span className="text-[7px] text-ink/30 mr-0.5">↩</span>}
          {slot.position}
        </span>
        {isHero && (
          <span className="text-[7px] font-bold px-1 rounded bg-forest/20 text-forest-light">
            HERO
          </span>
        )}
      </div>

      {/* Stacked action list */}
      <div className="px-1 pb-1.5 space-y-px">
        {available.map(act => {
          const isSelected = slot.action === act
          const label = getActionLabel(act, priorSlots, street)
          const defSize = getDefaultSize(act, priorSlots, street, pot, slot.position, remainingStack)
          const showSize = act === 'raise' || act === 'bet' || act === 'all-in'
          const displayLabel = showSize && defSize
            ? `${label} ${isSelected ? (slot.size ?? defSize) : defSize}`
            : label

          return (
            <button
              key={act}
              onClick={() => {
                onSetAction(idx, act)
              }}
              className={cn(
                'w-full text-left px-1.5 py-0.5 rounded text-[9px] font-medium transition-all',
                isSelected
                  ? cn('font-bold', ACTION_STYLE[act] || '')
                  : 'text-ink/30 hover:text-ink/50 hover:bg-slate-card/30',
              )}
            >
              {displayLabel}
            </button>
          )
        })}

        {/* Editable size input for bet/raise (not all-in, which is always full stack) */}
        {(slot.action === 'raise' || slot.action === 'bet') && (
          <input
            type="number"
            value={slot.size ?? ''}
            onClick={e => e.stopPropagation()}
            onChange={e => onSizeChange(idx, Math.max(0, Math.min(remainingStack, Number(e.target.value))))}
            className="w-full bg-slate-card/30 border border-slate-border/15 rounded mt-0.5 px-1 py-0.5 text-[8px] font-mono text-center focus:outline-none focus:border-forest/50"
            step={0.5}
            max={remainingStack}
          />
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Street Timeline (horizontal row of position cards)
// ---------------------------------------------------------------------------

function StreetTimeline({ slots, street, pot, heroPosition, effectiveStack, onSetAction, onSizeChange }: {
  slots: ActionSlot[]
  street: Street
  pot: number
  heroPosition: Position
  effectiveStack: number
  onSetAction: (idx: number, action: SlotAction) => void
  onSizeChange: (idx: number, size: number) => void
}) {
  return (
    <div className="overflow-x-auto">
      <div className="flex items-stretch gap-0.5 min-w-min pb-1">
        {slots.map((slot, idx) => (
          <PositionCard
            key={`${slot.position}-${idx}`}
            slot={slot}
            idx={idx}
            allSlots={slots}
            street={street}
            pot={pot}
            effectiveStack={effectiveStack}
            heroPosition={heroPosition}
            onSetAction={onSetAction}
            onSizeChange={onSizeChange}
          />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Board Card Row (for postflop streets)
// ---------------------------------------------------------------------------

function BoardCardRow({ cards, expected, deadCards, onPick, onRemove, onRandom }: {
  cards: number[]
  expected: number
  deadCards: number[]
  onPick: (card: number) => void
  onRemove: (idx: number) => void
  onRandom: () => void
}) {
  const [picking, setPicking] = useState(false)
  const allDead = useMemo(() => [...deadCards, ...cards], [deadCards, cards])

  const handlePick = (card: number) => {
    onPick(card)
    if (cards.length + 1 >= expected) setPicking(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-ink/50 light:text-graphite/50 w-12">Board</span>
        <div className="flex gap-1.5">
          {cards.map((card, i) => (
            <CardSlot key={i} card={card} onClick={() => onRemove(i)} size="sm" />
          ))}
          {cards.length < expected && (
            <CardSlot card={null} onClick={() => setPicking(true)} label="+" size="sm" />
          )}
        </div>
        {cards.length < expected && (
          <button
            onClick={onRandom}
            className="text-ink/30 hover:text-forest text-xs flex items-center gap-1"
            title="Deal random"
          >
            <Shuffle className="w-3 h-3" />
          </button>
        )}
      </div>
      {picking && (
        <CardPicker deadCards={allDead} onPick={handlePick} onClose={() => setPicking(false)} />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Verdict Card
// ---------------------------------------------------------------------------

function VerdictCard({ verdict }: { verdict: HandReview['verdicts'][number] }) {
  const config = VERDICT_CONFIG[verdict.verdict]
  const Icon = config.icon
  const [expanded, setExpanded] = useState(true)

  return (
    <div className={cn('rounded-lg border p-4 space-y-2', config.bg)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn('w-4 h-4', config.color)} />
          <span className="font-semibold text-sm">{STREET_LABELS[verdict.street]}</span>
          <span className={cn('text-xs font-medium', config.color)}>{config.label}</span>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-ink/40">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      <p className="text-sm font-medium">{verdict.headline}</p>

      {expanded && (
        <>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
            <div>
              <span className="text-ink/40">Preferred: </span>
              <span className="font-medium text-forest-light">{verdict.preferredAction}</span>
            </div>
            <div>
              <span className="text-ink/40">Frequency: </span>
              <span className="font-medium">{verdict.preferredFrequency}</span>
            </div>
            {verdict.confidence !== 'high' && (
              <div>
                <span className="text-ink/40">Confidence: </span>
                <span className={cn('font-medium', verdict.confidence === 'close' ? 'text-gold' : 'text-info')}>
                  {verdict.confidence === 'close' ? 'Close decision' : 'Mixed node'}
                </span>
              </div>
            )}
          </div>

          {verdict.sizingNote && (
            <p className="text-xs text-gold/80 bg-gold/5 rounded px-2 py-1">{verdict.sizingNote}</p>
          )}

          <p className="text-xs text-ink/50 italic">{verdict.evNote}</p>

          <ul className="space-y-1">
            {verdict.reasoning.map((r, i) => (
              <li key={i} className="text-xs text-ink/60 flex gap-1.5">
                <span className="text-ink/20 mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>

          {verdict.heroAction && (
            <div className="text-xs text-ink/30 pt-1 border-t border-current/10">
              Your action: <span className="font-mono">{verdict.heroAction.action}</span>
              {verdict.heroAction.size !== undefined && <span className="font-mono"> {verdict.heroAction.size}bb</span>}
              {' '}from <span className="font-mono">{verdict.heroAction.position}</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Coaching Summary
// ---------------------------------------------------------------------------

function CoachingPanel({ summary, tags }: { summary: HandReview['summary']; tags: string[] }) {
  const gradeConfig = VERDICT_CONFIG[summary.overallGrade]
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-3">
        <Trophy className={cn('w-5 h-5', gradeConfig.color)} />
        <div>
          <p className="text-h4 font-semibold">Session Summary</p>
          <p className={cn('text-xs font-medium', gradeConfig.color)}>{gradeConfig.label}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 text-sm">
        <div className="flex gap-2">
          <Target className="w-4 h-4 text-error/70 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-ink/40">Biggest Deviation</p>
            <p>{summary.biggestDeviation}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400/70 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-ink/40">Best Played</p>
            <p>{summary.bestPlayedStreet}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <TrendingUp className="w-4 h-4 text-gold/70 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-ink/40">Main Adjustment</p>
            <p>{summary.mainAdjustment}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <BookOpen className="w-4 h-4 text-info/70 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-ink/40">Study Direction</p>
            <p>{summary.studyDirection}</p>
          </div>
        </div>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-border/20">
          {tags.map(tag => (
            <span key={tag} className="badge-forest">
              <Tag className="w-2.5 h-2.5 mr-1" />{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Saved Review List
// ---------------------------------------------------------------------------

function SavedReviewsList({ reviews, onLoad, onDelete }: {
  reviews: SavedReview[]; onLoad: (r: SavedReview) => void; onDelete: (id: string) => void
}) {
  if (reviews.length === 0) {
    return <div className="text-center py-8 text-ink/30 text-sm">No saved reviews yet.</div>
  }
  return (
    <div className="space-y-2">
      {reviews.map(r => {
        const grade = VERDICT_CONFIG[r.review.summary.overallGrade]
        const date = new Date(r.timestamp)
        return (
          <button key={r.id} onClick={() => onLoad(r)} className="w-full text-left card-hover p-3 flex items-center gap-3 group">
            <div className="flex gap-1">
              <CardLabel card={r.hand.heroCards[0]} size="sm" />
              <CardLabel card={r.hand.heroCards[1]} size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">{r.hand.heroPosition}</span>
                <span className={cn('text-[10px] font-medium', grade.color)}>{grade.label}</span>
              </div>
              <p className="text-[10px] text-ink/30 truncate">
                {date.toLocaleDateString()} · {r.review.tags.join(', ')}
              </p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); onDelete(r.id) }}
              className="text-ink/20 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </button>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Random card helper
// ---------------------------------------------------------------------------

function pickRandomCards(count: number, deadCards: number[]): number[] {
  const dead = new Set(deadCards)
  const available = Array.from({ length: 52 }, (_, i) => i).filter(c => !dead.has(c))
  const picked: number[] = []
  for (let i = 0; i < count && available.length > 0; i++) {
    const idx = Math.floor(Math.random() * available.length)
    picked.push(available[idx])
    available.splice(idx, 1)
  }
  return picked
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export function HandReviewPage() {
  // Setup
  const [gameType, setGameType] = useState<'cash' | 'tournament'>('cash')
  const [stakes, setStakes] = useState('0.50/1.00')
  const [effectiveStack, setEffectiveStack] = useState(100)
  const [heroPosition, setHeroPosition] = useState<Position>('BU')
  const [heroCards, setHeroCards] = useState<[number | null, number | null]>([null, null])
  const [pickingHeroCard, setPickingHeroCard] = useState<0 | 1 | null>(null)

  // Preflop
  const [preflopSlots, setPreflopSlots] = useState<ActionSlot[]>(
    POSITIONS.map(p => ({ position: p, action: 'pending' as SlotAction }))
  )

  // Postflop board cards
  const [flopCards, setFlopCards] = useState<number[]>([])
  const [turnCard, setTurnCard] = useState<number | null>(null)
  const [riverCard, setRiverCard] = useState<number | null>(null)

  // Postflop action slots
  const [flopSlots, setFlopSlots] = useState<ActionSlot[]>([])
  const [turnSlots, setTurnSlots] = useState<ActionSlot[]>([])
  const [riverSlots, setRiverSlots] = useState<ActionSlot[]>([])

  // Analysis
  const [review, setReview] = useState<HandReview | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

  // Saved
  const [savedReviews, setSavedReviews] = useState<SavedReview[]>(() => loadSavedReviews())
  const [showSaved, setShowSaved] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')

  // Derived state
  const preflopComplete = preflopSlots.length > 0 && preflopSlots.every(s => s.action !== 'pending')
  const preflopPot = useMemo(() => computePreflopPot(preflopSlots), [preflopSlots])

  const activePositions = useMemo(() => deriveActivePositions(preflopSlots), [preflopSlots])
  const handOverPreflop = preflopComplete && activePositions.length <= 1

  const flopComplete = flopSlots.length > 0 && flopSlots.every(s => s.action !== 'pending')
  const flopPot = useMemo(() => computePostflopPot(flopSlots, preflopPot), [flopSlots, preflopPot])
  const flopActivePositions = useMemo(() => {
    const folded = new Set(flopSlots.filter(s => s.action === 'fold').map(s => s.position))
    return activePositions.filter(p => !folded.has(p))
  }, [flopSlots, activePositions])
  const handOverFlop = flopComplete && flopActivePositions.length <= 1

  const turnComplete = turnSlots.length > 0 && turnSlots.every(s => s.action !== 'pending')
  const turnPot = useMemo(() => computePostflopPot(turnSlots, flopPot), [turnSlots, flopPot])
  const turnActivePositions = useMemo(() => {
    const folded = new Set(turnSlots.filter(s => s.action === 'fold').map(s => s.position))
    return flopActivePositions.filter(p => !folded.has(p))
  }, [turnSlots, flopActivePositions])
  const handOverTurn = turnComplete && turnActivePositions.length <= 1

  const riverPot = useMemo(() => computePostflopPot(riverSlots, turnPot), [riverSlots, turnPot])

  // Dead cards
  const deadCards = useMemo(() => {
    const cards: number[] = []
    if (heroCards[0] !== null) cards.push(heroCards[0])
    if (heroCards[1] !== null) cards.push(heroCards[1])
    cards.push(...flopCards)
    if (turnCard !== null) cards.push(turnCard)
    if (riverCard !== null) cards.push(riverCard)
    return cards
  }, [heroCards, flopCards, turnCard, riverCard])

  const canAnalyze = heroCards[0] !== null && heroCards[1] !== null &&
    preflopSlots.some(s => s.position === heroPosition && s.action !== 'pending')

  // Compute cumulative invested per position for remaining-stack calculations
  const preflopInvested = useMemo(() => {
    const inv: Record<string, number> = { SB: 0.5, BB: 1.0 }
    for (const s of preflopSlots) {
      if (s.action === 'fold' || s.action === 'pending' || s.action === 'check') continue
      if (s.action === 'raise' || s.action === 'all-in') inv[s.position] = s.size ?? 0
      else if (s.action === 'call') inv[s.position] = Math.max(...Object.values(inv))
    }
    return inv
  }, [preflopSlots])

  // Effective remaining stack at start of each street for any position
  const preflopEffStack = effectiveStack // full stack at start
  const flopEffStack = useMemo(() => {
    // After preflop, each player's stack is reduced by what they invested preflop
    // We use the maximum investment (all players pay the same to see the flop)
    const maxPreInv = Math.max(...Object.values(preflopInvested), 0)
    return effectiveStack - maxPreInv
  }, [effectiveStack, preflopInvested])
  const turnEffStack = useMemo(() => {
    // After flop bets
    const flopInv: Record<string, number> = {}
    for (const s of flopSlots) {
      if (s.action === 'bet' || s.action === 'raise' || s.action === 'all-in') flopInv[s.position] = s.size ?? 0
      else if (s.action === 'call') {
        const maxBet = Math.max(...Object.values(flopInv), 0)
        flopInv[s.position] = maxBet
      }
    }
    const maxFlopInv = Object.keys(flopInv).length > 0 ? Math.max(...Object.values(flopInv)) : 0
    return flopEffStack - maxFlopInv
  }, [flopEffStack, flopSlots])
  const riverEffStack = useMemo(() => {
    const turnInv: Record<string, number> = {}
    for (const s of turnSlots) {
      if (s.action === 'bet' || s.action === 'raise' || s.action === 'all-in') turnInv[s.position] = s.size ?? 0
      else if (s.action === 'call') {
        const maxBet = Math.max(...Object.values(turnInv), 0)
        turnInv[s.position] = maxBet
      }
    }
    const maxTurnInv = Object.keys(turnInv).length > 0 ? Math.max(...Object.values(turnInv)) : 0
    return turnEffStack - maxTurnInv
  }, [turnEffStack, turnSlots])

  // Handlers
  const handlePreflopAction = useCallback((idx: number, action: SlotAction) => {
    const priorSlots = preflopSlots.slice(0, idx).filter(s => s.action !== 'pending')
    const investedSoFar = getInvested(priorSlots, preflopSlots[idx].position, 'preflop')
    const remaining = Math.max(0, effectiveStack - investedSoFar)
    const size = getDefaultSize(action, priorSlots, 'preflop', preflopPot, preflopSlots[idx].position, remaining)
    setPreflopSlots(prev => setSlotAction(prev, idx, action, size))
    // Clear postflop when preflop changes
    setFlopCards([]); setFlopSlots([])
    setTurnCard(null); setTurnSlots([])
    setRiverCard(null); setRiverSlots([])
  }, [preflopSlots, preflopPot, effectiveStack])

  const handlePreflopSizeChange = useCallback((idx: number, size: number) => {
    setPreflopSlots(prev => prev.map((s, i) => i === idx ? { ...s, size: Math.min(size, effectiveStack) } : s))
  }, [effectiveStack])

  const handleFlopAction = useCallback((idx: number, action: SlotAction) => {
    const priorSlots = flopSlots.slice(0, idx).filter(s => s.action !== 'pending')
    const investedSoFar = getInvested(priorSlots, flopSlots[idx].position, 'flop')
    const remaining = Math.max(0, flopEffStack - investedSoFar)
    const size = getDefaultSize(action, priorSlots, 'flop', preflopPot, flopSlots[idx].position, remaining)
    setFlopSlots(prev => setSlotAction(prev, idx, action, size))
    setTurnCard(null); setTurnSlots([])
    setRiverCard(null); setRiverSlots([])
  }, [flopSlots, preflopPot, flopEffStack])

  const handleFlopSizeChange = useCallback((idx: number, size: number) => {
    setFlopSlots(prev => prev.map((s, i) => i === idx ? { ...s, size: Math.min(size, flopEffStack) } : s))
  }, [flopEffStack])

  const handleTurnAction = useCallback((idx: number, action: SlotAction) => {
    const priorSlots = turnSlots.slice(0, idx).filter(s => s.action !== 'pending')
    const investedSoFar = getInvested(priorSlots, turnSlots[idx].position, 'turn')
    const remaining = Math.max(0, turnEffStack - investedSoFar)
    const size = getDefaultSize(action, priorSlots, 'turn', flopPot, turnSlots[idx].position, remaining)
    setTurnSlots(prev => setSlotAction(prev, idx, action, size))
    setRiverCard(null); setRiverSlots([])
  }, [turnSlots, flopPot, turnEffStack])

  const handleTurnSizeChange = useCallback((idx: number, size: number) => {
    setTurnSlots(prev => prev.map((s, i) => i === idx ? { ...s, size: Math.min(size, turnEffStack) } : s))
  }, [turnEffStack])

  const handleRiverAction = useCallback((idx: number, action: SlotAction) => {
    const priorSlots = riverSlots.slice(0, idx).filter(s => s.action !== 'pending')
    const investedSoFar = getInvested(priorSlots, riverSlots[idx].position, 'river')
    const remaining = Math.max(0, riverEffStack - investedSoFar)
    const size = getDefaultSize(action, priorSlots, 'river', turnPot, riverSlots[idx].position, remaining)
    setRiverSlots(prev => setSlotAction(prev, idx, action, size))
  }, [riverSlots, turnPot, riverEffStack])

  const handleRiverSizeChange = useCallback((idx: number, size: number) => {
    setRiverSlots(prev => prev.map((s, i) => i === idx ? { ...s, size: Math.min(size, riverEffStack) } : s))
  }, [riverEffStack])

  // Initialize postflop slots when board cards are complete
  const initFlopSlots = useCallback(() => {
    setFlopSlots(activePositions.map(p => ({ position: p, action: 'pending' as SlotAction })))
  }, [activePositions])

  const initTurnSlots = useCallback(() => {
    setTurnSlots(flopActivePositions.map(p => ({ position: p, action: 'pending' as SlotAction })))
  }, [flopActivePositions])

  const initRiverSlots = useCallback(() => {
    setRiverSlots(turnActivePositions.map(p => ({ position: p, action: 'pending' as SlotAction })))
  }, [turnActivePositions])

  const handlePickHeroCard = (card: number) => {
    if (pickingHeroCard === 0) setHeroCards([card, heroCards[1]])
    else if (pickingHeroCard === 1) setHeroCards([heroCards[0], card])
    setPickingHeroCard(null)
  }

  // Convert to HandData for analysis
  const buildHandData = useCallback((): HandData | null => {
    if (heroCards[0] === null || heroCards[1] === null) return null

    const toActions = (slots: ActionSlot[]): HandAction[] =>
      slots.filter(s => s.action !== 'pending').map(s => ({
        position: s.position,
        action: s.action as ActionType,
        size: s.size,
        isHero: s.position === heroPosition,
      }))

    const streets: StreetData[] = []

    const pfActions = toActions(preflopSlots)
    if (pfActions.length > 0) {
      streets.push({ street: 'preflop', board: [], actions: pfActions, potBefore: 1.5, potAfter: preflopPot })
    }

    if (flopSlots.length > 0 && flopCards.length === 3) {
      const fa = toActions(flopSlots)
      if (fa.length > 0) streets.push({ street: 'flop', board: flopCards, actions: fa, potBefore: preflopPot, potAfter: flopPot })
    }

    if (turnSlots.length > 0 && turnCard !== null) {
      const ta = toActions(turnSlots)
      if (ta.length > 0) streets.push({ street: 'turn', board: [turnCard], actions: ta, potBefore: flopPot, potAfter: turnPot })
    }

    if (riverSlots.length > 0 && riverCard !== null) {
      const ra = toActions(riverSlots)
      if (ra.length > 0) streets.push({ street: 'river', board: [riverCard], actions: ra, potBefore: turnPot, potAfter: riverPot })
    }

    return {
      gameType, stakes, effectiveStack, heroPosition,
      heroCards: [heroCards[0], heroCards[1]],
      streets,
    }
  }, [heroCards, heroPosition, preflopSlots, flopSlots, turnSlots, riverSlots,
      flopCards, turnCard, riverCard, preflopPot, flopPot, turnPot, riverPot,
      gameType, stakes, effectiveStack])

  const handleAnalyze = useCallback(() => {
    const handData = buildHandData()
    if (!handData) return
    const result = analyzeHand(handData)
    setReview(result)
    setShowAnalysis(true)
  }, [buildHandData])

  const handleReset = () => {
    setHeroCards([null, null])
    setPreflopSlots(POSITIONS.map(p => ({ position: p, action: 'pending' as SlotAction })))
    setFlopCards([]); setFlopSlots([])
    setTurnCard(null); setTurnSlots([])
    setRiverCard(null); setRiverSlots([])
    setReview(null); setShowAnalysis(false); setReviewNotes('')
  }

  const handleSave = () => {
    if (!review) return
    const saved: SavedReview = {
      id: crypto.randomUUID(), timestamp: Date.now(),
      hand: review.hand, review, notes: reviewNotes,
    }
    const updated = [saved, ...savedReviews]
    setSavedReviews(updated); persistReviews(updated)
  }

  const handleDeleteSaved = (id: string) => {
    const updated = savedReviews.filter(r => r.id !== id)
    setSavedReviews(updated); persistReviews(updated)
  }

  const handleLoadSaved = (saved: SavedReview) => {
    setHeroCards(saved.hand.heroCards)
    setHeroPosition(saved.hand.heroPosition)
    setEffectiveStack(saved.hand.effectiveStack)
    setGameType(saved.hand.gameType); setStakes(saved.hand.stakes)
    setReviewNotes(saved.notes)

    // Rebuild preflop slots from saved data
    const pfStreet = saved.hand.streets.find(s => s.street === 'preflop')
    if (pfStreet) {
      const slots: ActionSlot[] = pfStreet.actions.map(a => ({
        position: a.position, action: a.action as SlotAction, size: a.size,
      }))
      setPreflopSlots(slots)
    }

    // Rebuild postflop from saved
    const fStreet = saved.hand.streets.find(s => s.street === 'flop')
    if (fStreet) {
      setFlopCards(fStreet.board)
      setFlopSlots(fStreet.actions.map(a => ({ position: a.position, action: a.action as SlotAction, size: a.size })))
    } else { setFlopCards([]); setFlopSlots([]) }

    const tStreet = saved.hand.streets.find(s => s.street === 'turn')
    if (tStreet) {
      setTurnCard(tStreet.board[0] ?? null)
      setTurnSlots(tStreet.actions.map(a => ({ position: a.position, action: a.action as SlotAction, size: a.size })))
    } else { setTurnCard(null); setTurnSlots([]) }

    const rStreet = saved.hand.streets.find(s => s.street === 'river')
    if (rStreet) {
      setRiverCard(rStreet.board[0] ?? null)
      setRiverSlots(rStreet.actions.map(a => ({ position: a.position, action: a.action as SlotAction, size: a.size })))
    } else { setRiverCard(null); setRiverSlots([]) }

    setReview(saved.review); setShowAnalysis(true); setShowSaved(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-6 h-6 text-forest" />
          <div>
            <h1 className="text-h3 font-semibold">Hand Review</h1>
            <p className="text-caption text-ink/40">Enter your hand and get street-by-street GTO analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSaved(!showSaved)} className="btn-ghost text-sm flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Saved ({savedReviews.length})</span>
          </button>
          <button onClick={handleReset} className="btn-ghost text-sm flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {showSaved && (
        <div className="card">
          <p className="text-sm font-semibold mb-3">Saved Reviews</p>
          <SavedReviewsList reviews={savedReviews} onLoad={handleLoadSaved} onDelete={handleDeleteSaved} />
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Hand Builder */}
        <div className="space-y-4">
          {/* Setup */}
          <div className="card space-y-4">
            <p className="text-sm font-semibold">Setup</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-ink/40 mb-1 block">Game Type</label>
                <select value={gameType} onChange={e => setGameType(e.target.value as any)}
                  className="w-full bg-slate-card border border-slate-border rounded px-2 py-1.5 text-sm light:bg-ivory-card light:border-ivory-border light:text-graphite">
                  <option value="cash">Cash</option>
                  <option value="tournament">Tournament</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-ink/40 mb-1 block">Stakes</label>
                <input value={stakes} onChange={e => setStakes(e.target.value)}
                  className="w-full bg-slate-card border border-slate-border rounded px-2 py-1.5 text-sm light:bg-ivory-card light:border-ivory-border light:text-graphite" />
              </div>
              <div>
                <label className="text-xs text-ink/40 mb-1 block">Effective Stack (bb)</label>
                <input type="number" value={effectiveStack} onChange={e => setEffectiveStack(parseFloat(e.target.value) || 100)}
                  className="w-full bg-slate-card border border-slate-border rounded px-2 py-1.5 text-sm font-mono light:bg-ivory-card light:border-ivory-border light:text-graphite" />
              </div>
              <div>
                <label className="text-xs text-ink/40 mb-1 block">Hero Position</label>
                <div className="flex gap-1">
                  {POSITIONS.map(p => (
                    <button key={p} onClick={() => setHeroPosition(p)}
                      className={cn(
                        'flex-1 py-1.5 rounded text-xs font-medium transition-colors',
                        heroPosition === p
                          ? 'bg-forest text-white'
                          : 'bg-slate-card text-ink/50 hover:text-ink light:bg-ivory-card light:text-graphite/50',
                      )}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero cards */}
            <div>
              <label className="text-xs text-ink/40 mb-1.5 block">Hero Cards</label>
              <div className="flex items-center gap-2">
                <CardSlot card={heroCards[0]}
                  onClick={() => { if (heroCards[0] !== null) setHeroCards([null, heroCards[1]]); else setPickingHeroCard(0) }} />
                <CardSlot card={heroCards[1]}
                  onClick={() => { if (heroCards[1] !== null) setHeroCards([heroCards[0], null]); else setPickingHeroCard(1) }} />
                <button
                  onClick={() => {
                    const dead = new Set(deadCards.filter(c => c !== heroCards[0] && c !== heroCards[1]))
                    const cards = pickRandomCards(2, [...dead])
                    if (cards.length >= 2) setHeroCards([cards[0], cards[1]])
                  }}
                  className="text-ink/30 hover:text-forest transition-colors" title="Random hand">
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
              {pickingHeroCard !== null && (
                <div className="mt-2">
                  <CardPicker deadCards={deadCards} onPick={handlePickHeroCard} onClose={() => setPickingHeroCard(null)} />
                </div>
              )}
            </div>
          </div>

          {/* Preflop */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Preflop</p>
              <span className="text-[10px] font-mono text-ink/40">
                Pot: {preflopPot.toFixed(1)} bb
              </span>
            </div>
            <StreetTimeline
              slots={preflopSlots}
              street="preflop"
              pot={preflopPot}
              heroPosition={heroPosition}
              effectiveStack={preflopEffStack}
              onSetAction={handlePreflopAction}
              onSizeChange={handlePreflopSizeChange}
            />
          </div>

          {/* Flop */}
          {preflopComplete && !handOverPreflop && (
            <div className="card space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Flop</p>
                <span className="text-[10px] font-mono text-ink/40">
                  Pot: {(flopSlots.length > 0 ? flopPot : preflopPot).toFixed(1)} bb
                </span>
              </div>
              <BoardCardRow
                cards={flopCards}
                expected={3}
                deadCards={deadCards}
                onPick={card => {
                  const next = [...flopCards, card]
                  setFlopCards(next)
                  if (next.length === 3) initFlopSlots()
                }}
                onRemove={idx => {
                  setFlopCards(flopCards.filter((_, i) => i !== idx))
                  setFlopSlots([]); setTurnCard(null); setTurnSlots([]); setRiverCard(null); setRiverSlots([])
                }}
                onRandom={() => {
                  const needed = 3 - flopCards.length
                  const cards = pickRandomCards(needed, deadCards)
                  const next = [...flopCards, ...cards]
                  setFlopCards(next)
                  if (next.length === 3) initFlopSlots()
                }}
              />
              {flopSlots.length > 0 && (
                <StreetTimeline
                  slots={flopSlots}
                  street="flop"
                  pot={preflopPot}
                  heroPosition={heroPosition}
                  effectiveStack={flopEffStack}
                  onSetAction={handleFlopAction}
                  onSizeChange={handleFlopSizeChange}
                />
              )}
            </div>
          )}

          {/* Turn */}
          {flopComplete && !handOverFlop && (
            <div className="card space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Turn</p>
                <span className="text-[10px] font-mono text-ink/40">
                  Pot: {(turnSlots.length > 0 ? turnPot : flopPot).toFixed(1)} bb
                </span>
              </div>
              <BoardCardRow
                cards={turnCard !== null ? [turnCard] : []}
                expected={1}
                deadCards={deadCards}
                onPick={card => {
                  setTurnCard(card)
                  initTurnSlots()
                }}
                onRemove={() => {
                  setTurnCard(null); setTurnSlots([]); setRiverCard(null); setRiverSlots([])
                }}
                onRandom={() => {
                  const cards = pickRandomCards(1, deadCards)
                  if (cards.length > 0) { setTurnCard(cards[0]); initTurnSlots() }
                }}
              />
              {turnSlots.length > 0 && (
                <StreetTimeline
                  slots={turnSlots}
                  street="turn"
                  pot={flopPot}
                  heroPosition={heroPosition}
                  effectiveStack={turnEffStack}
                  onSetAction={handleTurnAction}
                  onSizeChange={handleTurnSizeChange}
                />
              )}
            </div>
          )}

          {/* River */}
          {turnComplete && !handOverTurn && (
            <div className="card space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">River</p>
                <span className="text-[10px] font-mono text-ink/40">
                  Pot: {(riverSlots.length > 0 ? riverPot : turnPot).toFixed(1)} bb
                </span>
              </div>
              <BoardCardRow
                cards={riverCard !== null ? [riverCard] : []}
                expected={1}
                deadCards={deadCards}
                onPick={card => {
                  setRiverCard(card)
                  initRiverSlots()
                }}
                onRemove={() => {
                  setRiverCard(null); setRiverSlots([])
                }}
                onRandom={() => {
                  const cards = pickRandomCards(1, deadCards)
                  if (cards.length > 0) { setRiverCard(cards[0]); initRiverSlots() }
                }}
              />
              {riverSlots.length > 0 && (
                <StreetTimeline
                  slots={riverSlots}
                  street="river"
                  pot={turnPot}
                  heroPosition={heroPosition}
                  effectiveStack={riverEffStack}
                  onSetAction={handleRiverAction}
                  onSizeChange={handleRiverSizeChange}
                />
              )}
            </div>
          )}

          {/* Analyze button */}
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className={cn(
              'w-full py-3 rounded-lg font-semibold text-sm transition-all',
              canAnalyze ? 'btn-primary' : 'bg-slate-card text-ink/30 cursor-not-allowed',
            )}
          >
            Analyze Hand
          </button>
        </div>

        {/* RIGHT: Analysis Display */}
        <div className="space-y-4">
          {!showAnalysis ? (
            <div className="card flex flex-col items-center justify-center py-16 text-center">
              <ClipboardCheck className="w-10 h-10 text-ink/10 mb-3" />
              <p className="text-sm text-ink/30 mb-1">Enter your hand on the left</p>
              <p className="text-xs text-ink/20">Select actions for each position, then click Analyze</p>
            </div>
          ) : review ? (
            <>
              <div className="card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {heroCards[0] !== null && <CardLabel card={heroCards[0]} />}
                  {heroCards[1] !== null && <CardLabel card={heroCards[1]} />}
                  <div className="ml-2">
                    <p className="text-sm font-semibold">{heroPosition}</p>
                    <p className="text-[10px] text-ink/40">{effectiveStack}bb · {stakes} · {gameType}</p>
                  </div>
                </div>
                <button onClick={handleSave} className="btn-ghost text-xs flex items-center gap-1">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </div>

              {review.verdicts.map((v, i) => (
                <VerdictCard key={i} verdict={v} />
              ))}

              <div className="card space-y-2">
                <p className="text-xs text-ink/40">Personal Notes</p>
                <textarea
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder="Add notes about this hand..."
                  rows={3}
                  className="w-full bg-slate-card border border-slate-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-forest/50 light:bg-ivory-card light:border-ivory-border"
                />
              </div>

              <CoachingPanel summary={review.summary} tags={review.tags} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
