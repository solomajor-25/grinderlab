import { useState, useCallback, useMemo } from 'react'
import { RotateCcw, ArrowRight, BookOpen } from 'lucide-react'
import { saveAttempt } from '@/lib/storage'
import { RangeChart } from '@/components/preflop/RangeChart'
import { EquityDisplay } from '@/components/preflop/EquityDisplay'
import { expandHand, filterDeadCards } from '@/engine/range'
import { handVsRange } from '@/engine/equity'
import { parseCardStr } from '@/engine/card'
import { getHandActionClass, getHandExplanation, allHands } from '@/data/preflop-ranges'
import type { Position, ActionClass } from '@/types'

const POSITIONS: Position[] = ['UTG', 'HJ', 'CO', 'BU', 'SB', 'BB']
const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const SUITS = ['h', 'd', 'c', 's']

type TrainerMode = 'open-fold' | 'facing-open'

function randomHand(): string {
  const r1 = RANKS[Math.floor(Math.random() * RANKS.length)]
  const r2 = RANKS[Math.floor(Math.random() * RANKS.length)]
  if (r1 === r2) return r1 + r2
  const suited = Math.random() < 0.3
  const [hi, lo] = RANKS.indexOf(r1) < RANKS.indexOf(r2) ? [r1, r2] : [r2, r1]
  return hi + lo + (suited ? 's' : 'o')
}

/** Generate specific hole cards for equity calculation */
function randomSpecificCards(hand: string): [string, string] {
  const isPair = hand.length === 2
  const isSuited = hand.endsWith('s')
  const r1 = hand[0]
  const r2 = isPair ? hand[0] : hand[1]

  if (isPair) {
    const s1 = Math.floor(Math.random() * 4)
    let s2 = Math.floor(Math.random() * 3)
    if (s2 >= s1) s2++
    return [`${r1}${SUITS[s1]}`, `${r2}${SUITS[s2]}`]
  }
  if (isSuited) {
    const s = Math.floor(Math.random() * 4)
    return [`${r1}${SUITS[s]}`, `${r2}${SUITS[s]}`]
  }
  // Offsuit
  const s1 = Math.floor(Math.random() * 4)
  let s2 = Math.floor(Math.random() * 3)
  if (s2 >= s1) s2++
  return [`${r1}${SUITS[s1]}`, `${r2}${SUITS[s2]}`]
}

function randomPosition(exclude?: Position[]): Position {
  const options = POSITIONS.filter(p => !exclude?.includes(p))
  return options[Math.floor(Math.random() * options.length)]
}

// Build range data for the chart using the shared range definitions
function buildPositionRange(position: Position, mode: TrainerMode): Record<string, ActionClass> {
  const range: Record<string, ActionClass> = {}
  for (const h of allHands) {
    if (mode === 'open-fold') {
      range[h] = getHandActionClass(h, position)
    } else {
      range[h] = getHandActionClass(h, position, 'CO') // default villain
    }
  }
  return range
}

function buildFacingOpenRange(heroPos: Position, villainPos: Position): Record<string, ActionClass> {
  const range: Record<string, ActionClass> = {}
  for (const h of allHands) {
    range[h] = getHandActionClass(h, heroPos, villainPos)
  }
  return range
}

const actionLabels: Record<ActionClass, string> = {
  'open': 'Open',
  'marginal-open': 'Marginal Open',
  'exploit-open': 'Exploit Open',
  'fold': 'Fold',
  'call': 'Call',
  '3bet-value': '3-Bet Value',
  '3bet-bluff': '3-Bet Bluff',
}

const actionStyles: Record<ActionClass, string> = {
  'open': 'bg-forest/15 text-forest border-forest/30 hover:bg-forest/25',
  'marginal-open': 'bg-warning/15 text-warning border-warning/30 hover:bg-warning/25',
  'exploit-open': 'bg-gold/15 text-gold border-gold/30 hover:bg-gold/25',
  'fold': 'bg-error/15 text-error border-error/30 hover:bg-error/25',
  'call': 'bg-success/15 text-success border-success/30 hover:bg-success/25',
  '3bet-value': 'bg-purple-500/15 text-purple-400 border-purple-400/30 hover:bg-purple-500/25',
  '3bet-bluff': 'bg-orange-400/15 text-orange-400 border-orange-400/30 hover:bg-orange-400/25',
}

export function PreflopTrainer() {
  const [mode, setMode] = useState<TrainerMode>('open-fold')
  const [hand, setHand] = useState(randomHand)
  const [specificCards, setSpecificCards] = useState<[string, string]>(() => randomSpecificCards(hand))
  const [position, setPosition] = useState<Position>(() => randomPosition(['BB']))
  const [villainPos, setVillainPos] = useState<Position>('CO')
  const [selected, setSelected] = useState<ActionClass | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)

  const rawAction = mode === 'open-fold'
    ? getHandActionClass(hand, position)
    : getHandActionClass(hand, position, villainPos)
  // Treat marginal-open as open — either it's an open or it's not
  const correctAction = rawAction === 'marginal-open' ? 'open' : rawAction

  const availableActions: ActionClass[] = mode === 'open-fold'
    ? ['open', 'fold']
    : ['3bet-value', '3bet-bluff', 'call', 'fold']

  // Build range data for chart display
  const heroRange = useMemo(() =>
    mode === 'open-fold'
      ? buildPositionRange(position, mode)
      : buildFacingOpenRange(position, villainPos),
    [position, mode, villainPos]
  )
  const villainRange = useMemo(() => {
    if (mode === 'facing-open') return buildPositionRange(villainPos, 'open-fold')
    return null
  }, [mode, villainPos])

  // Calculate equity on reveal
  const equityResult = useMemo(() => {
    if (!isRevealed) return null
    try {
      const heroCards: [number, number] = [
        parseCardStr(specificCards[0]),
        parseCardStr(specificCards[1]),
      ]

      // Build opponent range combos
      let opponentRange: Record<string, ActionClass>
      if (mode === 'open-fold') {
        opponentRange = {}
        for (let i = 0; i < RANKS.length; i++) {
          for (let j = i; j < RANKS.length; j++) {
            if (i === j) opponentRange[`${RANKS[i]}${RANKS[j]}`] = 'open'
            else {
              opponentRange[`${RANKS[i]}${RANKS[j]}s`] = 'open'
              opponentRange[`${RANKS[i]}${RANKS[j]}o`] = 'open'
            }
          }
        }
      } else {
        opponentRange = villainRange || {}
      }

      const rangeCombos: [number, number][] = []
      for (const [h, action] of Object.entries(opponentRange)) {
        if (mode === 'facing-open' && action !== 'open' && action !== 'marginal-open') continue
        rangeCombos.push(...expandHand(h))
      }

      const filteredCombos = filterDeadCards(rangeCombos, [heroCards[0], heroCards[1]])
      if (filteredCombos.length === 0) return null

      return handVsRange(heroCards, filteredCombos, [], 5000)
    } catch {
      return null
    }
  }, [isRevealed, specificCards, mode, villainRange])

  const handleSelect = (action: ActionClass) => {
    if (isRevealed) return
    setSelected(action)
    setIsRevealed(true)
    const isCorrect = action === correctAction
    if (isCorrect) setScore(s => s + 1)
    setTotal(t => t + 1)
    saveAttempt({
      type: 'preflop',
      chapterId: mode === 'open-fold' ? 2 : 10,
      conceptIds: mode === 'open-fold' ? ['opening-ranges', 'position'] : ['3betting', 'facing-3bets'],
      correct: isCorrect,
      details: `${hand} from ${position} (${mode})`,
    })
  }

  const nextSpot = useCallback(() => {
    const newHand = randomHand()
    setHand(newHand)
    setSpecificCards(randomSpecificCards(newHand))
    setPosition(randomPosition(mode === 'open-fold' ? ['BB'] : undefined))
    setVillainPos(randomPosition(['BB', 'SB']))
    setSelected(null)
    setIsRevealed(false)
  }, [mode])

  const switchMode = (newMode: TrainerMode) => {
    setMode(newMode)
    setScore(0)
    setTotal(0)
    setSelected(null)
    setIsRevealed(false)
    const newHand = randomHand()
    setHand(newHand)
    setSpecificCards(randomSpecificCards(newHand))
    setPosition(randomPosition(newMode === 'open-fold' ? ['BB'] : undefined))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-3 animate-fade-in">
      {/* Header + Mode Tabs inline */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold tracking-tight">Preflop Trainer</h1>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => switchMode('open-fold')}
            className={`px-3 py-1.5 text-caption font-medium rounded-lg transition-colors ${
              mode === 'open-fold' ? 'bg-forest/15 text-forest' : 'text-ink/50 hover:text-ink'
            }`}
          >
            Open / Fold
          </button>
          <button
            onClick={() => switchMode('facing-open')}
            className={`px-3 py-1.5 text-caption font-medium rounded-lg transition-colors ${
              mode === 'facing-open' ? 'bg-forest/15 text-forest' : 'text-ink/50 hover:text-ink'
            }`}
          >
            Facing Open
          </button>
        </div>
      </div>

      {/* Score + Reset */}
      <div className="flex items-center justify-between">
        <span className="badge-forest text-xs">{score}/{total} correct</span>
        <button onClick={() => { setScore(0); setTotal(0) }} className="btn-ghost text-xs inline-flex items-center gap-1 px-2 py-1">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Spot Display — compact card */}
      <div className="card space-y-3 !p-4">
        {/* Table Positions — smaller */}
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-36">
            <div className="absolute inset-3 rounded-full border-2 border-forest/20 bg-forest/5" />
            {POSITIONS.map((pos, i) => {
              const angle = (i / POSITIONS.length) * 2 * Math.PI - Math.PI / 2
              const x = 50 + 42 * Math.cos(angle)
              const y = 50 + 42 * Math.sin(angle)
              const isHero = pos === position
              const isVillain = mode === 'facing-open' && pos === villainPos

              return (
                <div
                  key={pos}
                  className={`absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isHero ? 'bg-forest text-white ring-2 ring-gold scale-110' :
                    isVillain ? 'bg-error/20 text-error ring-2 ring-error/50' :
                    'bg-slate-card dark:bg-slate-card text-ink/50'
                  }`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {pos}
                </div>
              )
            })}
          </div>
        </div>

        {/* Hand Display — compact */}
        <div className="text-center">
          <div className="inline-flex gap-2 text-2xl font-mono font-bold bg-white text-graphite rounded-lg px-3 py-2 shadow border border-gray-200">
            <span>{hand}</span>
          </div>
        </div>

        {/* Context */}
        <div className="text-center space-y-0.5">
          <p className="text-body font-medium">
            You are in <span className="text-forest font-bold">{position}</span>
          </p>
          {mode === 'facing-open' && (
            <p className="text-caption text-ink/60">
              <span className="text-error font-medium">{villainPos}</span> opens to 3bb
            </p>
          )}
          <p className="text-[11px] text-ink/40">
            {mode === 'open-fold' ? 'Everyone folds to you. What do you do?' : 'What\'s your action?'}
          </p>
        </div>

        {/* Action Buttons — inline in card */}
        <div className="flex flex-wrap gap-2 justify-center pt-1">
          {availableActions.map(action => {
            const isSelected = selected === action
            const isCorrect = isRevealed && action === correctAction
            let styles = actionStyles[action]
            if (isRevealed && isCorrect) styles = 'bg-success/20 text-success border-success ring-2 ring-success/30'
            else if (isRevealed && isSelected && action !== correctAction) styles = 'bg-error/20 text-error border-error ring-2 ring-error/30'
            else if (isSelected) styles += ' ring-2 ring-forest/50'

            return (
              <button
                key={action}
                onClick={() => handleSelect(action)}
                disabled={isRevealed}
                className={`px-4 py-2 rounded-lg border-2 font-semibold text-sm transition-all ${styles}`}
              >
                {actionLabels[action]}
              </button>
            )
          })}
        </div>

        {/* Next — shown after answer */}
        {isRevealed && (
          <div className="flex justify-center pt-1">
            <button onClick={nextSpot} className="btn-primary text-sm inline-flex items-center gap-1 px-6 py-2">
              Next Spot <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Feedback — compact */}
      {isRevealed && (
        <div className={selected === correctAction ? 'bg-success/5 border border-success/20 rounded-lg p-3' : 'bg-error/5 border border-error/20 rounded-lg p-3'}>
          <p className={`text-sm font-semibold mb-1 ${selected === correctAction ? 'text-success' : 'text-error'}`}>
            {selected === correctAction
              ? 'Good discipline.'
              : `Recommended: ${actionLabels[correctAction]}.`}
          </p>
          <p className="text-caption text-ink/80">
            {getHandExplanation(hand, position, correctAction)}
          </p>
          <p className="text-[10px] text-ink/40 mt-2 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {mode === 'open-fold' ? 'Chapter 2: Opening the Pot' : 'Chapter 10: 3-Betting'}
          </p>
        </div>
      )}

      {/* Range Charts on Reveal — side by side on desktop */}
      {isRevealed && (
        <div className="grid md:grid-cols-2 gap-3">
          <div className="card !p-3">
            <h3 className="text-caption font-semibold mb-2">
              {mode === 'open-fold' ? `${position} Opening Range` : `Response to ${villainPos} Open`}
            </h3>
            <div className="flex justify-center">
              <RangeChart range={heroRange} highlightHand={hand} compact />
            </div>
          </div>

          {mode === 'facing-open' && villainRange ? (
            <div className="card !p-3">
              <h3 className="text-caption font-semibold mb-2">{villainPos} Opening Range</h3>
              <div className="flex justify-center">
                <RangeChart range={villainRange} compact />
              </div>
            </div>
          ) : equityResult ? (
            <div className="card !p-3">
              <h3 className="text-caption font-semibold mb-2">Hand Equity</h3>
              <EquityDisplay
                equity={equityResult.equity}
                label={mode === 'open-fold' ? `${hand} vs random` : `${hand} vs ${villainPos} range`}
                wins={equityResult.wins}
                ties={equityResult.ties}
                total={equityResult.total}
              />
            </div>
          ) : null}
        </div>
      )}

      {/* Equity below range charts for facing-open mode */}
      {isRevealed && mode === 'facing-open' && equityResult && (
        <div className="card !p-3">
          <h3 className="text-caption font-semibold mb-2">Hand Equity</h3>
          <EquityDisplay
            equity={equityResult.equity}
            label={`${hand} vs ${villainPos} opening range`}
            wins={equityResult.wins}
            ties={equityResult.ties}
            total={equityResult.total}
          />
        </div>
      )}
    </div>
  )
}
