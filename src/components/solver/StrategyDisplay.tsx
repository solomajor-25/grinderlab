/**
 * Strategy display component.
 * Shows a 13x13 range grid colored by solver strategy at a node.
 * Each cell shows the dominant action via color, with mixed strategies as gradients.
 */

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { getHandMatrix } from '@/engine/range'
import type { ActionFrequency, ComboStrategy } from '@/engine/solver/types'

interface StrategyDisplayProps {
  /** Map from hand notation to action frequencies */
  handStrategies: Record<string, ActionFrequency[]>
  /** Available actions at this node */
  actions: string[]
  /** Currently selected hand for detail view */
  selectedHand?: string | null
  /** Callback when a hand cell is clicked */
  onHandClick?: (hand: string) => void
  /** Compact mode */
  compact?: boolean
  /** Filter: highlight only hands playing this action */
  filterAction?: string | null
  /** Callback when hovering a hand */
  onHandHover?: (hand: string | null) => void
}

/** Color palette for solver actions */
const ACTION_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  'Fold':     { bg: 'rgba(169,74,74,0.6)',   text: '#f4a4a4', bar: 'bg-error' },
  'Check':    { bg: 'rgba(62,100,127,0.6)',   text: '#8cb8d4', bar: 'bg-info' },
  'Call':     { bg: 'rgba(62,100,127,0.6)',   text: '#8cb8d4', bar: 'bg-info' },
  'All-In':   { bg: 'rgba(201,162,39,0.7)',   text: '#f0d060', bar: 'bg-gold' },
}

function getActionColor(action: string): { bg: string; text: string; bar: string } {
  // Check exact matches first
  if (ACTION_COLORS[action]) return ACTION_COLORS[action]

  // Pattern matches
  if (action.startsWith('Bet')) {
    return { bg: 'rgba(31,77,58,0.7)', text: '#6bc4a0', bar: 'bg-forest' }
  }
  if (action.startsWith('Raise')) {
    return { bg: 'rgba(147,51,234,0.6)', text: '#c084fc', bar: 'bg-purple-500' }
  }

  return { bg: 'rgba(100,100,100,0.4)', text: '#aaa', bar: 'bg-slate-500' }
}

export function StrategyDisplay({
  handStrategies,
  actions,
  selectedHand,
  onHandClick,
  compact = false,
  filterAction,
  onHandHover,
}: StrategyDisplayProps) {
  const matrix = useMemo(() => getHandMatrix(), [])
  const cellSize = compact ? 'w-6 h-6' : 'w-8 h-8'

  return (
    <div className="inline-block">
      {/* Grid */}
      <div
        className="inline-grid gap-px rounded-lg overflow-hidden border border-slate-border/30 select-none"
        style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}
      >
        {matrix.map((row, i) =>
          row.map((hand, j) => {
            const strategy = handStrategies[hand]
            const isSelected = selectedHand === hand
            const hasStrategy = strategy && strategy.length > 0

            // Compute cell background
            let bgStyle: React.CSSProperties = { background: 'rgba(30,42,56,0.3)' }

            if (hasStrategy) {
              // Find actions with >5% frequency
              const significant = strategy.filter(s => s.frequency > 0.05)

              if (significant.length === 1 || (significant.length > 0 && significant[0].frequency > 0.85)) {
                // Single dominant action
                bgStyle = { background: getActionColor(significant[0].action).bg }
              } else if (significant.length > 1) {
                // Mixed strategy — show as gradient
                const stops: string[] = []
                let cumPct = 0
                for (const s of significant.sort((a, b) => b.frequency - a.frequency)) {
                  const color = getActionColor(s.action).bg
                  const startPct = cumPct
                  cumPct += s.frequency * 100
                  stops.push(`${color} ${startPct}%`, `${color} ${cumPct}%`)
                }
                bgStyle = {
                  background: `linear-gradient(135deg, ${stops.join(', ')})`,
                }
              }
            }

            // Check if this hand plays the filtered action
            const filteredFreq = filterAction && hasStrategy
              ? strategy.find(s => s.action === filterAction)?.frequency ?? 0
              : null
            const isDimmed = filterAction !== null && filterAction !== undefined && (filteredFreq === null || filteredFreq < 0.01)

            return (
              <button
                key={`${i}-${j}`}
                onClick={() => onHandClick?.(hand)}
                onMouseEnter={() => onHandHover?.(hand)}
                onMouseLeave={() => onHandHover?.(null)}
                className={cn(
                  cellSize,
                  'flex items-center justify-center font-mono text-[9px] font-medium transition-all',
                  hasStrategy ? 'text-white/90' : 'text-ink/20',
                  isSelected && 'ring-2 ring-gold ring-inset z-10 scale-110',
                  onHandClick && 'cursor-pointer hover:brightness-125',
                  isDimmed && 'opacity-15',
                )}
                style={bgStyle}
                title={hand}
              >
                {hand.replace('o', '').replace('s', '')}
                {hand.length === 3 && (
                  <span className="text-[6px] opacity-50">{hand[2]}</span>
                )}
              </button>
            )
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-2 text-[10px]">
        {actions.map(action => (
          <div key={action} className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ background: getActionColor(action).bg }}
            />
            <span className="text-ink/50">{action}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Suit color classes for combo display */
const COMBO_SUIT_COLOR: Record<string, string> = {
  '♠': 'text-slate-300',
  '♥': 'text-red-500',
  '♦': 'text-blue-400',
  '♣': 'text-emerald-400',
}

function ComboLabel({ combo }: { combo: string }) {
  // Parse combo like "Q♠J♠" into colored spans
  const parts: { char: string; color?: string }[] = []
  for (let i = 0; i < combo.length; i++) {
    const ch = combo[i]
    if (COMBO_SUIT_COLOR[ch]) {
      parts.push({ char: ch, color: COMBO_SUIT_COLOR[ch] })
    } else {
      parts.push({ char: ch })
    }
  }
  return (
    <span className="font-mono font-bold">
      {parts.map((p, i) => (
        <span key={i} className={p.color || 'text-ink/80'}>{p.char}</span>
      ))}
    </span>
  )
}

/**
 * Hand strategy detail panel — shows frequencies for a single hand,
 * plus per-combo breakdown showing which suits take which action.
 */
export function HandStrategyDetail({
  hand,
  strategy,
  combos,
  handEVs,
  actions,
}: {
  hand: string
  strategy: ActionFrequency[]
  combos?: ComboStrategy[]
  handEVs?: number[] | null
  actions?: string[]
}) {
  if (!strategy || strategy.length === 0) {
    return (
      <div className="text-caption text-ink/40">
        No strategy data for {hand}
      </div>
    )
  }

  const significantActions = strategy
    .filter(s => s.frequency > 0.005)
    .sort((a, b) => b.frequency - a.frequency)

  return (
    <div className="space-y-2">
      <p className="text-h4 font-semibold font-mono">{hand}</p>

      {/* Aggregate strategy bars */}
      {significantActions.map(s => {
        const color = getActionColor(s.action)
        // Look up EV for this action from handEVs array
        const actionIdx = actions?.indexOf(s.action) ?? -1
        const ev = handEVs && actionIdx >= 0 ? handEVs[actionIdx] : null
        return (
          <div key={s.action} className="space-y-1">
            <div className="flex items-center justify-between text-caption">
              <span className="font-medium" style={{ color: color.text }}>
                {s.action}
              </span>
              <div className="flex items-center gap-2">
                {ev !== null && (
                  <span className={cn('font-mono text-[10px] font-semibold', ev >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {ev >= 0 ? '+' : ''}{ev.toFixed(2)} bb
                  </span>
                )}
                <span className="font-mono text-ink/70">
                  {(s.frequency * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-slate-card overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-300', color.bar)}
                style={{ width: `${s.frequency * 100}%`, opacity: 0.8 }}
              />
            </div>
          </div>
        )
      })}

      {/* Per-combo breakdown */}
      {combos && combos.length > 0 && (
        <div className="pt-1 border-t border-slate-border/15">
          <p className="text-[8px] text-ink/25 uppercase tracking-wider mb-1">Combos</p>
          <div className="space-y-0.5">
            {combos.map(c => {
              const dominant = c.frequencies
                .filter(f => f.frequency > 0.005)
                .sort((a, b) => b.frequency - a.frequency)
              const topAction = dominant[0]
              const isMixed = dominant.length > 1 && dominant[1].frequency > 0.1
              const topColor = topAction ? getActionColor(topAction.action) : null

              return (
                <div key={c.combo} className="flex items-center gap-1.5 text-[10px]">
                  <ComboLabel combo={c.combo} />
                  {isMixed ? (
                    // Mixed — show stacked bar
                    <div className="flex-1 flex h-3 rounded-sm overflow-hidden bg-slate-card/30">
                      {dominant.map(f => (
                        <div
                          key={f.action}
                          className="h-full"
                          style={{
                            width: `${f.frequency * 100}%`,
                            background: getActionColor(f.action).bg,
                          }}
                          title={`${f.action} ${(f.frequency * 100).toFixed(0)}%`}
                        />
                      ))}
                    </div>
                  ) : topAction ? (
                    <span className="font-medium text-[9px]" style={{ color: topColor?.text }}>
                      {topAction.action} {(topAction.frequency * 100).toFixed(0)}%
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
