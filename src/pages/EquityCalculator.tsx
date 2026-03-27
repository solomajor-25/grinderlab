import { useState, useMemo, useCallback } from 'react'
import { Calculator, RotateCcw, Loader2, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { RangeChart, type RangeAction } from '@/components/preflop/RangeChart'
import { EquityDisplay } from '@/components/preflop/EquityDisplay'
import { handVsRange, rangeVsRange, multiwayEquity, type EquityResult, type MultiwayPlayer } from '@/engine/equity'
import { buildRangeFromSelection, filterDeadCards, countCombos, TOTAL_COMBOS } from '@/engine/range'
import { cardToInt, intToCard } from '@/engine/card'
import { openingRanges, allHands, handStrength } from '@/data/preflop-ranges'
import type { Rank, Suit, Position } from '@/types'

const RANKS: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const SUITS: Suit[] = ['s', 'h', 'd', 'c']
const SUIT_SYMBOLS: Record<Suit, string> = { s: '\u2660', h: '\u2665', d: '\u2666', c: '\u2663' }
const SUIT_COLORS: Record<Suit, string> = { s: 'text-slate-800', h: 'text-red-600', d: 'text-blue-600', c: 'text-emerald-600' }


const PLAYER_COLORS = [
  'text-forest', 'text-info', 'text-purple-400', 'text-orange-400', 'text-pink-400', 'text-yellow-400'
]
const PLAYER_BAR_COLORS = [
  'bg-forest', 'bg-info', 'bg-purple-500', 'bg-orange-400', 'bg-pink-400', 'bg-yellow-400'
]

type InputMode = 'hand' | 'range'

interface PlayerState {
  mode: InputMode
  cards: [number | null, number | null]
  rangeSelection: Record<string, boolean>
  sliderPct: number
}

const POSITION_PRESETS: { label: string; pos: Position }[] = [
  { label: 'UTG', pos: 'UTG' },
  { label: 'HJ', pos: 'HJ' },
  { label: 'CO', pos: 'CO' },
  { label: 'BU', pos: 'BU' },
  { label: 'SB', pos: 'SB' },
]

// Sorted hands by strength for the % slider
const HANDS_BY_STRENGTH = [...allHands].sort((a, b) => (handStrength[b] ?? 0) - (handStrength[a] ?? 0))

function emptyPlayer(): PlayerState {
  return { mode: 'hand', cards: [null, null], rangeSelection: {}, sliderPct: 0 }
}

function selectionFromPct(pct: number): Record<string, boolean> {
  const targetCombos = Math.round(TOTAL_COMBOS * pct / 100)
  const selection: Record<string, boolean> = {}
  let total = 0
  for (const hand of HANDS_BY_STRENGTH) {
    if (total >= targetCombos) break
    selection[hand] = true
    // Pair = 6 combos, suited = 4, offsuit = 12
    total += hand.length === 2 ? 6 : hand.endsWith('s') ? 4 : 12
  }
  return selection
}

function pctFromSelection(selection: Record<string, boolean>): number {
  const combos = countCombos(selection)
  return Math.round((combos / TOTAL_COMBOS) * 100 * 10) / 10
}

export function EquityCalculator() {
  const [players, setPlayers] = useState<PlayerState[]>([emptyPlayer(), emptyPlayer()])
  const [board, setBoard] = useState<(number | null)[]>([null, null, null, null, null])
  const [results, setResults] = useState<EquityResult[] | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [pickingFor, setPickingFor] = useState<{ target: number | 'board'; slot: number } | null>(null)

  const playerCount = players.length

  // All dead cards (used cards that can't be picked again)
  const deadCards = useMemo(() => {
    const dead: number[] = []
    for (const p of players) {
      if (p.mode === 'hand') {
        if (p.cards[0] !== null) dead.push(p.cards[0])
        if (p.cards[1] !== null) dead.push(p.cards[1])
      }
    }
    board.forEach(c => { if (c !== null) dead.push(c) })
    return dead
  }, [players, board])

  const updatePlayer = useCallback((idx: number, fn: (prev: PlayerState) => PlayerState) => {
    setPlayers(prev => prev.map((p, i) => i === idx ? fn(p) : p))
  }, [])

  const handlePickCard = useCallback((cardInt: number) => {
    if (!pickingFor) return
    const { target, slot } = pickingFor

    if (typeof target === 'number') {
      updatePlayer(target, prev => {
        const newCards: [number | null, number | null] = [...prev.cards]
        newCards[slot] = cardInt
        return { ...prev, cards: newCards }
      })
    } else {
      setBoard(prev => {
        const newBoard = [...prev]
        newBoard[slot] = cardInt
        return newBoard
      })
    }
    setPickingFor(null)
  }, [pickingFor, updatePlayer])

  const handleRangeToggle = useCallback((playerIdx: number, hand: string) => {
    updatePlayer(playerIdx, prev => ({
      ...prev,
      rangeSelection: { ...prev.rangeSelection, [hand]: !prev.rangeSelection[hand] },
      sliderPct: 0, // Reset slider when manually toggling
    }))
  }, [updatePlayer])

  const handleBatchSet = useCallback((playerIdx: number, hands: string[], value: boolean) => {
    updatePlayer(playerIdx, prev => {
      const newSelection = { ...prev.rangeSelection }
      for (const h of hands) {
        newSelection[h] = value
      }
      return { ...prev, rangeSelection: newSelection, sliderPct: 0 }
    })
  }, [updatePlayer])

  const applyPreset = useCallback((playerIdx: number, position: Position) => {
    const posRange = openingRanges[position]
    const selection: Record<string, boolean> = {}
    for (const hand of allHands) {
      const action = posRange[hand]
      selection[hand] = action === 'open' || action === 'marginal-open'
    }
    updatePlayer(playerIdx, prev => ({ ...prev, rangeSelection: selection, sliderPct: pctFromSelection(selection) }))
  }, [updatePlayer])

  const applySlider = useCallback((playerIdx: number, pct: number) => {
    const selection = selectionFromPct(pct)
    updatePlayer(playerIdx, prev => ({ ...prev, rangeSelection: selection, sliderPct: pct }))
  }, [updatePlayer])

  const clearCard = useCallback((target: number | 'board', slot: number) => {
    if (typeof target === 'number') {
      updatePlayer(target, prev => {
        const newCards: [number | null, number | null] = [...prev.cards]
        newCards[slot] = null
        return { ...prev, cards: newCards }
      })
    } else {
      setBoard(prev => {
        const newBoard = [...prev]
        newBoard[slot] = null
        return newBoard
      })
    }
  }, [updatePlayer])

  const addPlayer = useCallback(() => {
    if (players.length >= 6) return
    setPlayers(prev => [...prev, emptyPlayer()])
    setResults(null)
  }, [players.length])

  const removePlayer = useCallback((idx: number) => {
    if (players.length <= 2) return
    setPlayers(prev => prev.filter((_, i) => i !== idx))
    setResults(null)
  }, [players.length])

  const canCalculate = useMemo(() => {
    return players.every(p => {
      if (p.mode === 'hand') return p.cards[0] !== null && p.cards[1] !== null
      return Object.values(p.rangeSelection).some(v => v)
    })
  }, [players])

  const handleCalculate = useCallback(async () => {
    if (!canCalculate) return
    setCalculating(true)
    setResults(null)

    setTimeout(() => {
      try {
        const boardCards = board.filter((c): c is number => c !== null)

        // Use multiway engine for 3+ players, or specialized 2-player for performance
        if (playerCount === 2) {
          const p1 = players[0]
          const p2 = players[1]

          if (p1.mode === 'hand' && p2.mode === 'hand') {
            const h1: [number, number] = [p1.cards[0]!, p1.cards[1]!]
            const h2: [number, number] = [p2.cards[0]!, p2.cards[1]!]
            const r1 = handVsRange(h1, [h2], boardCards, 20000)
            setResults([
              r1,
              { equity: 1 - r1.equity, wins: r1.total - r1.wins - r1.ties, ties: r1.ties, total: r1.total },
            ])
          } else if (p1.mode === 'hand' && p2.mode === 'range') {
            const h1: [number, number] = [p1.cards[0]!, p1.cards[1]!]
            const r2Combos = filterDeadCards(buildRangeFromSelection(p2.rangeSelection), [h1[0], h1[1], ...boardCards])
            const r1 = handVsRange(h1, r2Combos, boardCards, 20000)
            setResults([
              r1,
              { equity: 1 - r1.equity, wins: r1.total - r1.wins - r1.ties, ties: r1.ties, total: r1.total },
            ])
          } else if (p1.mode === 'range' && p2.mode === 'hand') {
            const h2: [number, number] = [p2.cards[0]!, p2.cards[1]!]
            const r1Combos = filterDeadCards(buildRangeFromSelection(p1.rangeSelection), [h2[0], h2[1], ...boardCards])
            const r2 = handVsRange(h2, r1Combos, boardCards, 20000)
            setResults([
              { equity: 1 - r2.equity, wins: r2.total - r2.wins - r2.ties, ties: r2.ties, total: r2.total },
              r2,
            ])
          } else {
            const r1Combos = filterDeadCards(buildRangeFromSelection(p1.rangeSelection), boardCards)
            const r2Combos = filterDeadCards(buildRangeFromSelection(p2.rangeSelection), boardCards)
            const result = rangeVsRange(r1Combos, r2Combos, boardCards, 20000)
            setResults([result.player1, result.player2])
          }
        } else {
          // Multiway: use Monte Carlo multiway engine
          const mwPlayers: MultiwayPlayer[] = players.map(p => {
            if (p.mode === 'hand') {
              return { type: 'hand' as const, hand: [p.cards[0]!, p.cards[1]!] as [number, number] }
            } else {
              const combos = filterDeadCards(buildRangeFromSelection(p.rangeSelection), boardCards)
              return { type: 'range' as const, range: combos }
            }
          })
          const mwResults = multiwayEquity(mwPlayers, boardCards, 30000)
          setResults(mwResults)
        }
      } catch (err) {
        console.error('Equity calculation error:', err)
      }
      setCalculating(false)
    }, 50)
  }, [canCalculate, players, board, playerCount])

  const handleReset = () => {
    setPlayers([emptyPlayer(), emptyPlayer()])
    setBoard([null, null, null, null, null])
    setResults(null)
    setPickingFor(null)
  }

  const handleRandomFlop = useCallback(() => {
    const available: number[] = []
    for (let i = 0; i < 52; i++) {
      if (!deadCards.includes(i)) available.push(i)
    }
    // Shuffle and pick 3
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]]
    }
    setBoard(prev => {
      const next = [...prev]
      next[0] = available[0]
      next[1] = available[1]
      next[2] = available[2]
      return next
    })
    setPickingFor(null)
    setResults(null)
  }, [deadCards])

  return (
    <div className="max-w-5xl mx-auto space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold tracking-tight">Equity Calculator</h1>
          <p className="text-body-lg text-ink/60 mt-1">
            Calculate hand or range equity — up to 6 players.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="btn-ghost inline-flex items-center gap-1 text-sm">
            <RotateCcw className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      </div>

      {/* Players Grid */}
      <div className={cn(
        'grid gap-4',
        playerCount <= 2 ? 'md:grid-cols-2' : playerCount <= 4 ? 'md:grid-cols-2 lg:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'
      )}>
        {players.map((player, idx) => (
          <PlayerInput
            key={idx}
            label={`Player ${idx + 1}`}
            player={player}
            setPlayer={(fn) => updatePlayer(idx, fn)}
            deadCards={deadCards}
            pickingFor={pickingFor}
            onStartPick={(slot) => setPickingFor({ target: idx, slot })}
            onPickCard={handlePickCard}
            onClearCard={(slot) => clearCard(idx, slot)}
            onRangeToggle={(hand) => handleRangeToggle(idx, hand)}
            onBatchSet={(hands, value) => handleBatchSet(idx, hands, value)}
            onApplyPreset={(pos) => applyPreset(idx, pos)}
            onApplySlider={(pct) => applySlider(idx, pct)}
            isPicking={typeof pickingFor?.target === 'number' && pickingFor.target === idx}
            colorClass={PLAYER_COLORS[idx]}
            removable={playerCount > 2}
            onRemove={() => removePlayer(idx)}
          />
        ))}
      </div>

      {/* Add Player button */}
      {playerCount < 6 && (
        <button
          onClick={addPlayer}
          className="w-full border-2 border-dashed border-slate-border rounded-lg py-3 text-caption text-ink/40 hover:text-ink/60 hover:border-ink/30 transition-colors inline-flex items-center justify-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Player ({playerCount}/6)
        </button>
      )}

      {/* Board */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-h4 font-semibold">Board</h3>
          <button
            onClick={handleRandomFlop}
            className="btn-ghost !py-1 !px-2 text-micro inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Random Flop
          </button>
        </div>
        <div className="flex gap-2">
          {board.map((card, i) => (
            <CardSlot
              key={i}
              card={card}
              label={i < 3 ? 'Flop' : i === 3 ? 'Turn' : 'River'}
              isActive={pickingFor?.target === 'board' && pickingFor.slot === i}
              onClick={() => card !== null ? clearCard('board', i) : setPickingFor({ target: 'board', slot: i })}
            />
          ))}
        </div>

        {pickingFor?.target === 'board' && (
          <CardPicker deadCards={deadCards} onPick={handlePickCard} />
        )}
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={!canCalculate || calculating}
        className="w-full btn-primary py-4 text-lg inline-flex items-center justify-center gap-2"
      >
        {calculating ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Calculating...</>
        ) : (
          <><Calculator className="w-5 h-5" /> Evaluate</>
        )}
      </button>

      {/* Results */}
      {results && (
        <div className="card space-y-4">
          <h3 className="text-h3 font-semibold">Results</h3>
          <div className={cn(
            'grid gap-4',
            playerCount <= 2 ? 'md:grid-cols-2' : playerCount <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'
          )}>
            {results.map((r, i) => (
              <EquityDisplay
                key={i}
                equity={r.equity}
                label={`Player ${i + 1}`}
                wins={r.wins}
                ties={r.ties}
                total={r.total}
              />
            ))}
          </div>

          {/* Equity bar comparison */}
          <div className="flex h-6 rounded-full overflow-hidden border border-slate-border">
            {results.map((r, i) => (
              <div
                key={i}
                className={cn(PLAYER_BAR_COLORS[i], 'transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold')}
                style={{ width: `${r.equity * 100}%` }}
              >
                {r.equity >= 0.05 ? `${Math.round(r.equity * 100)}%` : ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// --- Sub-components ---

function PlayerInput({
  label,
  player,
  setPlayer,
  deadCards,
  pickingFor,
  onStartPick,
  onPickCard,
  onClearCard,
  onRangeToggle,
  onBatchSet,
  onApplyPreset,
  onApplySlider,
  isPicking,
  colorClass,
  removable,
  onRemove,
}: {
  label: string
  player: PlayerState
  setPlayer: (fn: (prev: PlayerState) => PlayerState) => void
  deadCards: number[]
  pickingFor: { target: number | 'board'; slot: number } | null
  onStartPick: (slot: number) => void
  onPickCard: (card: number) => void
  onClearCard: (slot: number) => void
  onRangeToggle: (hand: string) => void
  onBatchSet: (hands: string[], value: boolean) => void
  onApplyPreset: (pos: Position) => void
  onApplySlider: (pct: number) => void
  isPicking: boolean
  colorClass: string
  removable: boolean
  onRemove: () => void
}) {
  const combos = player.mode === 'range' ? countCombos(player.rangeSelection) : 0
  const pct = Math.round((combos / TOTAL_COMBOS) * 100 * 10) / 10

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className={cn('text-h4 font-semibold', colorClass)}>{label}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPlayer(p => ({ ...p, mode: 'hand' }))}
            className={cn(
              'px-3 py-1 rounded text-caption font-medium transition-colors',
              player.mode === 'hand' ? 'bg-forest/15 text-forest' : 'text-ink/40 hover:text-ink'
            )}
          >
            Hand
          </button>
          <button
            onClick={() => setPlayer(p => ({ ...p, mode: 'range' }))}
            className={cn(
              'px-3 py-1 rounded text-caption font-medium transition-colors',
              player.mode === 'range' ? 'bg-forest/15 text-forest' : 'text-ink/40 hover:text-ink'
            )}
          >
            Range
          </button>
          {removable && (
            <button
              onClick={onRemove}
              className="ml-1 p-1 rounded text-ink/30 hover:text-error hover:bg-error/10 transition-colors"
              title="Remove player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {player.mode === 'hand' ? (
        <div>
          <div className="flex gap-2 mb-2">
            {[0, 1].map(slot => (
              <CardSlot
                key={slot}
                card={player.cards[slot]}
                label={`Card ${slot + 1}`}
                isActive={isPicking && pickingFor?.slot === slot}
                onClick={() => player.cards[slot] !== null ? onClearCard(slot) : onStartPick(slot)}
              />
            ))}
          </div>
          {isPicking && <CardPicker deadCards={deadCards} onPick={onPickCard} />}
        </div>
      ) : (
        <div>
          {/* Presets */}
          <div className="flex gap-1 mb-2 flex-wrap">
            {POSITION_PRESETS.map(p => (
              <button
                key={p.pos}
                onClick={() => onApplyPreset(p.pos)}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-forest/10 text-forest hover:bg-forest/20 transition-colors"
              >
                {p.label} Open
              </button>
            ))}
            <button
              onClick={() => setPlayer(p => ({ ...p, rangeSelection: {}, sliderPct: 0 }))}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-error/10 text-error hover:bg-error/20 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Top % Slider */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-ink/40 whitespace-nowrap">Top %</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={player.sliderPct}
              onChange={(e) => onApplySlider(Number(e.target.value))}
              className="flex-1 h-1.5 accent-forest cursor-pointer"
            />
            <span className="text-[10px] text-ink/60 w-10 text-right font-mono">{player.sliderPct}%</span>
          </div>

          <div className="flex justify-center overflow-x-auto">
            <RangeChart
              range={Object.fromEntries(
                Object.entries(player.rangeSelection).map(([k, v]) => [k, v as unknown as RangeAction | boolean])
              )}
              selectable
              onToggle={onRangeToggle}
              onBatchSet={onBatchSet}
              compact
            />
          </div>
          <p className="text-micro text-ink/40 mt-1 text-center">
            {combos} combos ({pct}%)
          </p>
        </div>
      )}
    </div>
  )
}

function CardSlot({
  card,
  label,
  isActive,
  onClick,
}: {
  card: number | null
  label: string
  isActive: boolean
  onClick: () => void
}) {
  if (card !== null) {
    const c = intToCard(card)
    return (
      <button
        onClick={onClick}
        className="w-14 h-20 rounded-lg border-2 border-slate-border bg-white flex flex-col items-center justify-center font-mono text-lg font-bold hover:border-error/50 transition-colors"
        title="Click to remove"
      >
        <span className={SUIT_COLORS[c.suit]}>{c.rank}</span>
        <span className={cn('text-xl', SUIT_COLORS[c.suit])}>{SUIT_SYMBOLS[c.suit]}</span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-14 h-20 rounded-lg border-2 border-dashed flex items-center justify-center text-[10px] text-ink/30 transition-colors',
        isActive ? 'border-gold bg-gold/5 text-gold' : 'border-slate-border hover:border-ink/30'
      )}
    >
      {label}
    </button>
  )
}

function CardPicker({
  deadCards,
  onPick,
}: {
  deadCards: number[]
  onPick: (card: number) => void
}) {
  const deadSet = new Set(deadCards)

  return (
    <div className="mt-3 p-3 rounded-lg bg-slate-card border border-slate-border">
      <div className="grid gap-px" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
        {SUITS.map(suit => (
          RANKS.map(rank => {
            const cardInt = cardToInt({ rank, suit })
            const isDead = deadSet.has(cardInt)
            return (
              <button
                key={`${rank}${suit}`}
                onClick={() => !isDead && onPick(cardInt)}
                disabled={isDead}
                className={cn(
                  'w-7 h-9 rounded text-[10px] font-mono font-bold flex flex-col items-center justify-center transition-colors',
                  isDead
                    ? 'opacity-20 cursor-not-allowed bg-ink/5'
                    : cn('hover:bg-forest/20 cursor-pointer bg-white/90', SUIT_COLORS[suit])
                )}
              >
                <span>{rank}</span>
                <span className="text-[8px]">{SUIT_SYMBOLS[suit]}</span>
              </button>
            )
          })
        ))}
      </div>
    </div>
  )
}
