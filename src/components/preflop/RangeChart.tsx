/**
 * 13x13 poker hand range chart component.
 * Displays hands colored by action class with optional highlighting, selection, and drag-select.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { cn } from '@/lib/utils'
import { getHandMatrix } from '@/engine/range'

export type RangeAction = 'open' | 'marginal-open' | 'exploit-open' | 'fold' | 'call' | '3bet-value' | '3bet-bluff'

interface RangeChartProps {
  /** Map of hand notation → action class or boolean (true = selected) */
  range: Record<string, RangeAction | boolean>
  /** Hand to highlight with a gold ring */
  highlightHand?: string
  /** Enable click-to-toggle selection mode */
  selectable?: boolean
  /** Callback when a hand is toggled (selectable mode) */
  onToggle?: (hand: string) => void
  /** Batch toggle: set multiple hands at once (for drag) */
  onBatchSet?: (hands: string[], value: boolean) => void
  /** Callback when a hand is clicked for inspection (non-selectable mode) */
  onHandClick?: (hand: string) => void
  /** Optional label above the chart */
  label?: string
  /** Additional class names */
  className?: string
  /** Compact mode for smaller displays */
  compact?: boolean
}

const actionColorMap: Record<string, string> = {
  'open': 'bg-forest/50 text-white',
  'marginal-open': 'bg-gold/40 text-graphite dark:text-white',
  'exploit-open': 'bg-gold/25 text-graphite dark:text-white',
  'fold': 'bg-transparent text-ink/30',
  'call': 'bg-info/40 text-white',
  '3bet-value': 'bg-purple-500/60 text-white',
  '3bet-bluff': 'bg-orange-400/50 text-white',
  // Boolean selection mode
  'true': 'bg-forest/50 text-white',
  'false': 'bg-transparent text-ink/30',
}

export function RangeChart({
  range,
  highlightHand,
  selectable = false,
  onToggle,
  onBatchSet,
  onHandClick,
  label,
  className,
  compact = false,
}: RangeChartProps) {
  const matrix = useMemo(() => getHandMatrix(), [])
  const [isDragging, setIsDragging] = useState(false)
  const [dragMode, setDragMode] = useState<boolean>(true)
  const draggedHands = useRef(new Set<string>())

  const cellSize = compact ? 'w-6 h-6 text-[9px]' : 'w-8 h-8 text-[10px]'

  // Global mouseup listener to end drag even if released outside the grid
  useEffect(() => {
    if (!selectable) return
    const handleUp = () => {
      if (isDragging) {
        setIsDragging(false)
        draggedHands.current.clear()
      }
    }
    document.addEventListener('mouseup', handleUp)
    return () => document.removeEventListener('mouseup', handleUp)
  }, [selectable, isDragging])

  const handleMouseDown = useCallback((hand: string) => {
    if (!selectable) return
    const currentVal = range[hand]
    const isOn = currentVal === true || (typeof currentVal === 'string' && currentVal !== 'fold')
    const newMode = !isOn
    setDragMode(newMode)
    setIsDragging(true)
    draggedHands.current.clear()
    draggedHands.current.add(hand)
    if (onBatchSet) {
      onBatchSet([hand], newMode)
    } else {
      onToggle?.(hand)
    }
  }, [selectable, range, onToggle, onBatchSet])

  const handleMouseEnter = useCallback((hand: string) => {
    if (!isDragging || !selectable) return
    if (draggedHands.current.has(hand)) return
    draggedHands.current.add(hand)
    if (onBatchSet) {
      onBatchSet([hand], dragMode)
    } else {
      // Fall back to toggle — check if we need to toggle
      const currentVal = range[hand]
      const isOn = currentVal === true || (typeof currentVal === 'string' && currentVal !== 'fold')
      if (isOn !== dragMode) {
        onToggle?.(hand)
      }
    }
  }, [isDragging, selectable, dragMode, range, onToggle, onBatchSet])

  return (
    <div className={cn('inline-block', className)}>
      {label && (
        <p className="text-caption text-ink/60 mb-2 font-medium">{label}</p>
      )}
      <div
        className="inline-grid gap-px bg-slate-border/30 rounded-lg overflow-hidden border border-slate-border/30 select-none"
        style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}
        onMouseLeave={() => {
          // Keep dragging active — global mouseup will end it
        }}
      >
        {matrix.map((row, i) =>
          row.map((hand, j) => {
            const action = range[hand]
            const colorKey = action === undefined ? 'false' : String(action)
            const colorClass = actionColorMap[colorKey] || actionColorMap['false']
            const isHighlighted = highlightHand === hand
            const isPair = i === j
            const isSuited = i < j

            return (
              <button
                key={`${i}-${j}`}
                onMouseDown={(e) => {
                  e.preventDefault() // Prevent text selection
                  handleMouseDown(hand)
                }}
                onMouseEnter={() => handleMouseEnter(hand)}
                onClick={(e) => {
                  e.preventDefault()
                  if (!selectable && onHandClick) {
                    onHandClick(hand)
                  }
                }}
                disabled={!selectable && !onHandClick}
                className={cn(
                  cellSize,
                  'flex items-center justify-center font-mono font-medium transition-all',
                  colorClass,
                  isPair && 'font-bold',
                  isHighlighted && 'ring-2 ring-gold ring-inset scale-110 z-10 bg-gold/60 text-graphite font-bold',
                  (selectable || onHandClick) && 'cursor-pointer hover:brightness-125',
                  !selectable && !onHandClick && 'cursor-default',
                )}
                title={`${hand}${isSuited ? ' (suited)' : isPair ? ' (pair)' : ' (offsuit)'}`}
              >
                {hand.replace('o', '').replace('s', '')}
                {hand.length === 3 && (
                  <span className="text-[7px] opacity-60">{hand[2]}</span>
                )}
              </button>
            )
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-2 text-[10px]">
        {hasAction(range, 'open') && <LegendItem color="bg-forest/50" label="Open" />}
        {hasAction(range, 'marginal-open') && <LegendItem color="bg-gold/40" label="Marginal" />}
        {hasAction(range, 'call') && <LegendItem color="bg-info/40" label="Call" />}
        {hasAction(range, '3bet-value') && <LegendItem color="bg-purple-500/60" label="3-Bet Value" />}
        {hasAction(range, '3bet-bluff') && <LegendItem color="bg-orange-400/50" label="3-Bet Bluff" />}
        {hasAction(range, 'fold') && <LegendItem color="bg-slate-card" label="Fold" />}
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={cn('w-3 h-3 rounded-sm', color)} />
      <span className="text-ink/50">{label}</span>
    </div>
  )
}

function hasAction(range: Record<string, RangeAction | boolean>, action: string): boolean {
  return Object.values(range).some(v => v === action)
}
