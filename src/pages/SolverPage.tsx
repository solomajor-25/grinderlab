/**
 * Solver Workspace — GTO Wizard / PioSolver-style interface.
 *
 * Top bar: unified left-to-right timeline of preflop positions + board + postflop nodes
 * Each position shows a stacked list of available actions; the selected action is highlighted.
 * Clicking any position/node shows its range/strategy in the matrix below.
 * After solving, postflop nodes extend the timeline rightward.
 */

import { useState, useCallback, useRef, useMemo, useEffect, Fragment } from 'react'
import {
  Cpu, RotateCcw, Play, Square, Shuffle,
  Save, FolderOpen, Trash2, X, Settings2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RangeChart, type RangeAction } from '@/components/preflop/RangeChart'
import { StrategyDisplay, HandStrategyDetail } from '@/components/solver/StrategyDisplay'
import { SolverWorker } from '@/engine/solver/worker-client'
import { expandHand, filterDeadCards, countCombos, TOTAL_COMBOS } from '@/engine/range'
import { cardToInt, intToCard } from '@/engine/card'
import { openingRanges, allHands, handStrength } from '@/data/preflop-ranges'
import { generateId } from '@/lib/utils'
import type {
  GameTreeConfig, WeightedCombo, BetTreeConfig, StreetBetConfig,
  SolverProgress, SolverResult, NodeQueryResult,
  SavedSolverSpot, SolverAlgorithm,
} from '@/engine/solver/types'
import type { Rank, Suit, Position } from '@/types'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const RANKS: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const SUITS: Suit[] = ['s', 'h', 'd', 'c']
const SUIT_SYMBOLS: Record<Suit, string> = { s: '\u2660', h: '\u2665', d: '\u2666', c: '\u2663' }

const ALL_POSITIONS: Position[] = ['UTG', 'HJ', 'CO', 'BU', 'SB', 'BB']
const POSTFLOP_ORDER: Position[] = ['SB', 'BB', 'UTG', 'HJ', 'CO', 'BU']

const HANDS_BY_STRENGTH = [...allHands].sort((a, b) => (handStrength[b] ?? 0) - (handStrength[a] ?? 0))

const DEFAULT_BET_CONFIG: StreetBetConfig = {
  betSizes: [0.33, 0.75],
  raiseSizes: [1.0],
  allinThreshold: 0.67,
}

const STORAGE_KEY = 'grinderlab_solver_spots'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type PreflopAction = 'fold' | 'open' | 'call' | '3bet' | 'squeeze' | 'pending'

interface PositionAction {
  position: Position
  action: PreflopAction
  raiseSize: number
}

/** A postflop node in the timeline */
interface PostflopNode {
  nodeIdx: number
  player: number // 0=OOP, 1=IP
  position: Position
  actions: string[]          // available actions from solver
  selectedAction: number | null  // index of selected action, or null
  pot: number
  stack: number
}

/** A completed street's solve data, displayed as read-only in the timeline */
interface CompletedStreet {
  street: 'flop' | 'turn' | 'river'
  postflopPath: PostflopNode[]
  boardCard?: number   // turn or river card that started this street
}


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const POSITION_INDEX: Record<Position, number> = { UTG: 0, HJ: 1, CO: 2, BU: 3, SB: 4, BB: 5 }

function selectionFromPct(pct: number): Record<string, boolean> {
  const targetCombos = Math.round(TOTAL_COMBOS * pct / 100)
  const selection: Record<string, boolean> = {}
  let total = 0
  for (const hand of HANDS_BY_STRENGTH) {
    if (total >= targetCombos) break
    selection[hand] = true
    total += hand.length === 2 ? 6 : hand.endsWith('s') ? 4 : 12
  }
  return selection
}

function pctFromSelection(sel: Record<string, boolean>): number {
  const combos = countCombos(sel)
  return Math.round((combos / TOTAL_COMBOS) * 1000) / 10
}

function pickRandomCard(deadCards: number[]): number {
  const dead = new Set(deadCards)
  const available = []
  for (let i = 0; i < 52; i++) {
    if (!dead.has(i)) available.push(i)
  }
  return available[Math.floor(Math.random() * available.length)]
}

function rangeFromSelection(sel: Record<string, boolean>, deadCards: number[]): WeightedCombo[] {
  const combos: WeightedCombo[] = []
  for (const [hand, isSelected] of Object.entries(sel)) {
    if (!isSelected) continue
    const expanded = expandHand(hand)
    const filtered = filterDeadCards(expanded, deadCards)
    for (const cards of filtered) {
      combos.push({ cards, weight: 1.0 })
    }
  }
  return combos
}

function getAvailableActions(actionHistory: PositionAction[]): PreflopAction[] {
  const hasOpen = actionHistory.some(a => a.action === 'open')
  const raiseActions: PreflopAction[] = ['open', '3bet', 'squeeze']
  const lastRaise = [...actionHistory].reverse().find(a => raiseActions.includes(a.action))
  const hasCaller = actionHistory.some(a => a.action === 'call')

  if (!hasOpen) return ['fold', 'open']
  if (!lastRaise) return ['fold', 'call', '3bet']
  // Facing a raise — can fold, call, or re-raise
  if (lastRaise.action === 'open') {
    return hasCaller ? ['fold', 'call', 'squeeze'] : ['fold', 'call', '3bet']
  }
  // Facing 3bet/squeeze/4bet+ — can fold, call, or re-raise (all modeled as '3bet')
  return ['fold', 'call', '3bet']
}

function getCallingPct(caller: Position, opener: Position): number {
  const openerIdx = POSITION_INDEX[opener]
  const table: Record<Position, Record<number, number>> = {
    BB:  { 0: 14, 1: 18, 2: 24, 3: 32, 4: 38 },
    SB:  { 0: 5,  1: 7,  2: 10, 3: 14, 4: 0  },
    BU:  { 0: 8,  1: 10, 2: 14, 3: 0,  4: 0  },
    CO:  { 0: 6,  1: 8,  2: 0,  3: 0,  4: 0  },
    HJ:  { 0: 5,  1: 0,  2: 0,  3: 0,  4: 0  },
    UTG: { 0: 0,  1: 0,  2: 0,  3: 0,  4: 0  },
  }
  return table[caller]?.[openerIdx] ?? 10
}

function get3betPct(bettor: Position, opener: Position): number {
  const openerIdx = POSITION_INDEX[opener]
  const table: Record<Position, Record<number, number>> = {
    BB:  { 0: 4,  1: 5,  2: 7,  3: 9,  4: 11 },
    SB:  { 0: 3,  1: 4,  2: 5,  3: 7,  4: 0  },
    BU:  { 0: 4,  1: 5,  2: 7,  3: 0,  4: 0  },
    CO:  { 0: 3,  1: 4,  2: 0,  3: 0,  4: 0  },
    HJ:  { 0: 3,  1: 0,  2: 0,  3: 0,  4: 0  },
    UTG: { 0: 0,  1: 0,  2: 0,  3: 0,  4: 0  },
  }
  return table[bettor]?.[openerIdx] ?? 5
}

function deriveRangeForAction(pos: Position, action: PreflopAction, openerPos?: Position, raiseCount = 0): Record<string, boolean> {
  const selection: Record<string, boolean> = {}
  if (action === 'fold' || action === 'pending') return selection

  if (action === 'open') {
    const posRange = openingRanges[pos]
    for (const hand of allHands) {
      const a = posRange[hand]
      if (a === 'open' || a === 'marginal-open') selection[hand] = true
    }
    return selection
  }

  let callPct = openerPos ? getCallingPct(pos, openerPos) : 15
  let betPct = openerPos ? get3betPct(pos, openerPos) : 5

  // Scale ranges tighter with each raise level
  if (raiseCount >= 2) { callPct *= 0.3; betPct *= 0.3 }
  if (raiseCount >= 3) { callPct = 2; betPct = 1 }
  if (raiseCount >= 4) { callPct = 0.5; betPct = 0.5 }

  if (action === 'call') return selectionFromPct(Math.max(0.5, callPct))
  if (action === '3bet') return selectionFromPct(Math.max(0.5, betPct))
  if (action === 'squeeze') return selectionFromPct(Math.max(0.5, betPct * 0.8))
  return selection
}

function buildPositionStrategyDisplay(
  pos: Position,
  action: PreflopAction,
  openerPos?: Position,
  raiseCount = 0,
  lastRaiserPos?: Position,
): { strategy: Record<string, RangeAction>; actionCounts: Record<string, number>; label: string } {
  const strategy: Record<string, RangeAction> = {}
  const actionCounts: Record<string, number> = {}

  if (action === 'fold') {
    for (const hand of allHands) strategy[hand] = 'fold'
    actionCounts['Fold'] = TOTAL_COMBOS
    return { strategy, actionCounts, label: 'Fold' }
  }

  if (action === 'pending') {
    // If there's already a raise, show defending range scaled by raise count
    if (openerPos && raiseCount > 0) {
      const vsPos = lastRaiserPos ?? openerPos
      let callPct: number
      let threeBetPct: number

      if (raiseCount === 1) {
        // Facing open
        callPct = getCallingPct(pos, openerPos)
        threeBetPct = get3betPct(pos, openerPos)
      } else if (raiseCount === 2) {
        // Facing 3-bet — much tighter
        callPct = Math.max(1, getCallingPct(pos, openerPos) * 0.3)
        threeBetPct = Math.max(0.5, get3betPct(pos, openerPos) * 0.3)
      } else if (raiseCount === 3) {
        // Facing 4-bet — very tight (QQ+, AKs)
        callPct = 2
        threeBetPct = 1
      } else {
        // Facing 5-bet+ — essentially AA, KK only
        callPct = 0.5
        threeBetPct = 0.5
      }

      const threeBetSel = selectionFromPct(threeBetPct)
      const callSel = selectionFromPct(callPct + threeBetPct)

      let callCount = 0
      let threeBetCount = 0
      let foldCount = 0

      for (const hand of allHands) {
        const combos = hand.length === 2 ? 6 : hand.endsWith('s') ? 4 : 12
        if (threeBetSel[hand]) {
          strategy[hand] = '3bet-value'
          threeBetCount += combos
        } else if (callSel[hand]) {
          strategy[hand] = 'call'
          callCount += combos
        } else {
          strategy[hand] = 'fold'
          foldCount += combos
        }
      }
      const raiseLabel = raiseCount === 1 ? 'open' : raiseCount === 2 ? '3-bet' : raiseCount === 3 ? '4-bet' : `${raiseCount + 1}-bet`
      if (threeBetCount > 0) actionCounts['Raise'] = threeBetCount
      if (callCount > 0) actionCounts['Call'] = callCount
      actionCounts['Fold'] = foldCount
      return { strategy, actionCounts, label: `Defending vs ${vsPos} ${raiseLabel}` }
    }

    // No opener yet — show opening range preview
    const posRange = openingRanges[pos]
    let openCount = 0
    let foldCount = 0
    for (const hand of allHands) {
      const combos = hand.length === 2 ? 6 : hand.endsWith('s') ? 4 : 12
      const a = posRange[hand]
      if (a === 'open' || a === 'marginal-open') {
        strategy[hand] = 'open'
        openCount += combos
      } else {
        strategy[hand] = 'fold'
        foldCount += combos
      }
    }
    actionCounts['Open'] = openCount
    actionCounts['Fold'] = foldCount
    return { strategy, actionCounts, label: 'Opening range' }
  }

  if (action === 'open') {
    const posRange = openingRanges[pos]
    let openCount = 0
    let foldCount = 0
    for (const hand of allHands) {
      const combos = hand.length === 2 ? 6 : hand.endsWith('s') ? 4 : 12
      const a = posRange[hand]
      if (a === 'open' || a === 'marginal-open') {
        strategy[hand] = 'open'
        openCount += combos
      } else {
        strategy[hand] = 'fold'
        foldCount += combos
      }
    }
    actionCounts['Open'] = openCount
    actionCounts['Fold'] = foldCount
    return { strategy, actionCounts, label: 'Raise' }
  }

  // call/3bet/squeeze — show full defending range breakdown, scaled by raise count
  let callPct = openerPos ? getCallingPct(pos, openerPos) : 15
  let threeBetPct = openerPos ? get3betPct(pos, openerPos) : 5

  if (raiseCount >= 2) {
    // Facing 3-bet — much tighter
    callPct = Math.max(1, callPct * 0.3)
    threeBetPct = Math.max(0.5, threeBetPct * 0.3)
  }
  if (raiseCount >= 3) {
    // Facing 4-bet — very tight
    callPct = 2
    threeBetPct = 1
  }
  if (raiseCount >= 4) {
    // Facing 5-bet+ — AA/KK only
    callPct = 0.5
    threeBetPct = 0.5
  }
  const threeBetSel = selectionFromPct(threeBetPct)
  const callSel = selectionFromPct(callPct + threeBetPct)

  let callCount = 0
  let threeBetCount = 0
  let foldCount = 0

  for (const hand of allHands) {
    const combos = hand.length === 2 ? 6 : hand.endsWith('s') ? 4 : 12
    if (threeBetSel[hand]) {
      strategy[hand] = '3bet-value'
      threeBetCount += combos
    } else if (callSel[hand]) {
      strategy[hand] = 'call'
      callCount += combos
    } else {
      strategy[hand] = 'fold'
      foldCount += combos
    }
  }

  if (threeBetCount > 0) actionCounts[action === 'squeeze' ? 'Squeeze' : '3-Bet'] = threeBetCount
  if (callCount > 0) actionCounts['Call'] = callCount
  actionCounts['Fold'] = foldCount
  const actionLabel = action === 'call' ? 'Call' : action === '3bet' ? '3-Bet' : action === 'squeeze' ? 'Squeeze' : action
  return { strategy, actionCounts, label: actionLabel }
}

function computePotAndStacks(
  actions: PositionAction[],
  startingStack: number,
): { pot: number; oopStack: number; ipStack: number; oopPos: Position | null; ipPos: Position | null } {
  const active = actions.filter(a => a.action !== 'fold' && a.action !== 'pending')
  if (active.length < 2) {
    return { pot: 1.5, oopStack: startingStack, ipStack: startingStack, oopPos: null, ipPos: null }
  }

  let pot = 1.5
  const invested: Record<string, number> = { SB: 0.5, BB: 1.0 }
  let lastRaise = 1.0

  for (const pa of actions) {
    if (pa.action === 'fold' || pa.action === 'pending') continue
    if (pa.action === 'open' || pa.action === '3bet' || pa.action === 'squeeze') {
      const alreadyIn = invested[pa.position] || 0
      pot += Math.max(0, pa.raiseSize - alreadyIn)
      invested[pa.position] = pa.raiseSize
      lastRaise = pa.raiseSize
    } else if (pa.action === 'call') {
      const alreadyIn = invested[pa.position] || 0
      pot += Math.max(0, lastRaise - alreadyIn)
      invested[pa.position] = lastRaise
    }
  }

  const activePositions = active.map(a => a.position)
  const activeSorted = POSTFLOP_ORDER.filter(p => activePositions.includes(p))
  const oopPos = activeSorted[0] || null
  const ipPos = activeSorted[activeSorted.length - 1] || null

  return {
    pot: Math.round(pot * 10) / 10,
    oopStack: Math.round((startingStack - (oopPos ? (invested[oopPos] || 0) : 0)) * 10) / 10,
    ipStack: Math.round((startingStack - (ipPos ? (invested[ipPos] || 0) : 0)) * 10) / 10,
    oopPos,
    ipPos,
  }
}

function defaultRaiseSize(action: PreflopAction, lastRaiseSize = 0): number {
  if (action === 'open') return 2.5
  if (action === 'squeeze') return 10
  if (action === '3bet') {
    // Scale re-raise based on last raise: 3x for 3bet, ~2.5x for 4bet+
    if (lastRaiseSize > 0) return Math.round(lastRaiseSize * 2.5 * 2) / 2  // round to 0.5
    return 7.5
  }
  return 0
}

function actionLabel(action: PreflopAction): string {
  switch (action) {
    case 'fold': return 'Fold'
    case 'open': return 'Raise'
    case 'call': return 'Call'
    case '3bet': return 'Raise'
    case 'squeeze': return 'Raise'
    case 'pending': return '...'
  }
}

function actionLabelWithSize(action: PreflopAction, size: number): string {
  if (action === 'open' || action === '3bet' || action === 'squeeze') return `Raise ${size}`
  return actionLabel(action)
}

/**
 * After an action is set at `idx`, rebuild the pending tail.
 * If the action is a raise, positions that already acted (non-fold) before the raiser
 * get re-entry pending slots at the end.
 */
function buildSequenceTail(
  committed: PositionAction[],  // entries 0..idx (inclusive) that are finalized
): PositionAction[] {
  // Find which positions have already had a first-pass slot in committed
  const committedPositions = new Set(committed.map(a => a.position))

  // Remaining first-pass positions that haven't had any slot yet
  const remainingFirstPass = ALL_POSITIONS
    .filter(p => !committedPositions.has(p))
    .map(p => ({ position: p, action: 'pending' as PreflopAction, raiseSize: 2.5 }))

  // Find the last raise in the committed sequence (not just the very last action)
  let lastRaiseIdx = -1
  for (let i = committed.length - 1; i >= 0; i--) {
    const a = committed[i].action
    if (a === 'open' || a === '3bet' || a === 'squeeze') {
      lastRaiseIdx = i
      break
    }
  }

  if (lastRaiseIdx < 0) {
    // No raises at all — just first-pass positions
    return [...committed, ...remainingFirstPass]
  }

  // There was a raise — find positions that need re-entry
  // Positions that acted non-fold BEFORE the raiser and haven't already re-entered after it
  const raiserPos = committed[lastRaiseIdx].position
  const reentryPositions: Position[] = []
  for (let i = 0; i < lastRaiseIdx; i++) {
    const entry = committed[i]
    if (entry.action !== 'fold' && entry.action !== 'pending' && entry.position !== raiserPos) {
      if (!reentryPositions.includes(entry.position)) {
        reentryPositions.push(entry.position)
      }
    }
  }

  // Remove positions that have already re-entered (appeared after the raise in committed)
  const alreadyReentered = new Set<Position>()
  for (let i = lastRaiseIdx + 1; i < committed.length; i++) {
    if (reentryPositions.includes(committed[i].position)) {
      alreadyReentered.add(committed[i].position)
    }
  }
  const pendingReentry = reentryPositions.filter(p => !alreadyReentered.has(p))

  // Order re-entry by ALL_POSITIONS order
  const orderedReentry = ALL_POSITIONS
    .filter(p => pendingReentry.includes(p))
    .map(p => ({ position: p, action: 'pending' as PreflopAction, raiseSize: 2.5 }))

  return [...committed, ...remainingFirstPass, ...orderedReentry]
}

// ============================================================================
// Main Component
// ============================================================================

export function SolverPage() {
  // --- Preflop action sequence ---
  const [actionSequence, setActionSequence] = useState<PositionAction[]>(() =>
    ALL_POSITIONS.map(pos => ({
      position: pos,
      action: 'pending' as PreflopAction,
      raiseSize: 2.5,
    }))
  )

  const [startingStack, setStartingStack] = useState(100)

  // Board
  const [board, setBoard] = useState<(number | null)[]>([null, null, null, null, null])
  const [pickingBoard, setPickingBoard] = useState<number | null>(null)

  // Range overrides
  const [oopRangeOverride, setOopRangeOverride] = useState<Record<string, boolean> | null>(null)
  const [ipRangeOverride, setIpRangeOverride] = useState<Record<string, boolean> | null>(null)
  const [editingRange, setEditingRange] = useState<'oop' | 'ip' | null>(null)
  const [oopSlider, setOopSlider] = useState(0)
  const [ipSlider, setIpSlider] = useState(0)

  // Bet config
  const [betConfig, setBetConfig] = useState<BetTreeConfig>({
    flop: { ...DEFAULT_BET_CONFIG },
    turn: { ...DEFAULT_BET_CONFIG },
    river: { ...DEFAULT_BET_CONFIG },
  })
  const [maxIterations, setMaxIterations] = useState(500)
  const [targetExpl, setTargetExpl] = useState(0.5)
  const [solverAlgorithm, setSolverAlgorithm] = useState<SolverAlgorithm>('cfr+')
  const [showSettings, setShowSettings] = useState(false)

  // Solve state
  const [solving, setSolving] = useState(false)
  const [progress, setProgress] = useState<SolverProgress | null>(null)
  const [result, setResult] = useState<SolverResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Results state
  const [nodeData, setNodeData] = useState<NodeQueryResult | null>(null)
  const [selectedHand, setSelectedHand] = useState<string | null>(null)
  const [filterAction, setFilterAction] = useState<string | null>(null) // highlight hands with this action
  const [hoveredHand, setHoveredHand] = useState<string | null>(null)  // hand being hovered in matrix
  const [selectedPreflopHand, setSelectedPreflopHand] = useState<string | null>(null)
  const [handEVs, setHandEVs] = useState<number[] | null>(null)  // per-action EVs for selected/hovered hand

  // Postflop timeline — extends the top bar after solving
  const [postflopPath, setPostflopPath] = useState<PostflopNode[]>([])
  const [selectedPostflopIdx, setSelectedPostflopIdx] = useState<number | null>(null)

  // Street progression — completed streets stay as read-only in the timeline
  const [completedStreets, setCompletedStreets] = useState<CompletedStreet[]>([])
  const [awaitingStreetCard, setAwaitingStreetCard] = useState<'turn' | 'river' | null>(null)
  const [pickingStreetCard, setPickingStreetCard] = useState(false)

  // Which item in the timeline is being viewed (preflop action index or postflop node)
  const [viewingIndex, setViewingIndex] = useState<number | null>(null)

  // Spot save/load
  const [showSpotManager, setShowSpotManager] = useState(false)
  const [spotName, setSpotName] = useState('')
  const [savedSpots, setSavedSpots] = useState<SavedSolverSpot[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
    catch { return [] }
  })

  const workerRef = useRef<SolverWorker | null>(null)

  // --- Derived state ---
  const viewingPosition = viewingIndex !== null ? actionSequence[viewingIndex]?.position ?? null : null

  const deadCards = useMemo(() => board.filter((c): c is number => c !== null), [board])

  const street = useMemo((): 'flop' | 'turn' | 'river' => {
    const filled = board.filter(c => c !== null).length
    if (filled <= 3) return 'flop'
    if (filled === 4) return 'turn'
    return 'river'
  }, [board])

  const finalizedActions = useMemo(() =>
    actionSequence.filter(a => a.action !== 'pending'),
    [actionSequence]
  )

  const openerAction = useMemo(() =>
    finalizedActions.find(a => a.action === 'open'),
    [finalizedActions]
  )
  const openerPos = openerAction?.position ?? null

  const { pot, oopStack, ipStack, oopPos, ipPos } = useMemo(
    () => computePotAndStacks(finalizedActions, startingStack),
    [finalizedActions, startingStack],
  )

  const effectiveStack = Math.min(oopStack, ipStack)
  const spr = pot > 0 ? effectiveStack / pot : 0

  const oopRange = useMemo(() => {
    if (oopRangeOverride) return oopRangeOverride
    if (!oopPos) return {}
    // Use the LAST action for this position (re-entry action takes precedence over initial action)
    const posActions = finalizedActions.filter(a => a.position === oopPos)
    const posAction = posActions[posActions.length - 1]
    if (!posAction) return {}
    // Find the last occurrence index for counting raises before it
    let posIdx = -1
    for (let i = actionSequence.length - 1; i >= 0; i--) {
      if (actionSequence[i].position === oopPos) { posIdx = i; break }
    }
    const raisesBeforePos = actionSequence.slice(0, posIdx).filter(a => a.action === 'open' || a.action === '3bet' || a.action === 'squeeze').length
    return deriveRangeForAction(oopPos, posAction.action, openerPos ?? undefined, raisesBeforePos)
  }, [oopPos, finalizedActions, oopRangeOverride, openerPos, actionSequence])

  const ipRange = useMemo(() => {
    if (ipRangeOverride) return ipRangeOverride
    if (!ipPos) return {}
    // Use the LAST action for this position (re-entry action takes precedence over initial action)
    const posActions = finalizedActions.filter(a => a.position === ipPos)
    const posAction = posActions[posActions.length - 1]
    if (!posAction) return {}
    let posIdx = -1
    for (let i = actionSequence.length - 1; i >= 0; i--) {
      if (actionSequence[i].position === ipPos) { posIdx = i; break }
    }
    const raisesBeforePos = actionSequence.slice(0, posIdx).filter(a => a.action === 'open' || a.action === '3bet' || a.action === 'squeeze').length
    return deriveRangeForAction(ipPos, posAction.action, openerPos ?? undefined, raisesBeforePos)
  }, [ipPos, finalizedActions, ipRangeOverride, openerPos, actionSequence])

  const oopCombos = useMemo(() => countCombos(oopRange), [oopRange])
  const ipCombos = useMemo(() => countCombos(ipRange), [ipRange])

  const activeCount = new Set(finalizedActions.filter(a => a.action !== 'fold').map(a => a.position)).size
  const allActed = !actionSequence.some(a => a.action === 'pending')
  const canSolve = activeCount >= 2 && oopCombos > 0 && ipCombos > 0 && deadCards.length >= 3 && pot > 0 && effectiveStack > 0

  useEffect(() => { setOopSlider(pctFromSelection(oopRange)) }, [oopRange])
  useEffect(() => { setIpSlider(pctFromSelection(ipRange)) }, [ipRange])

  const solved = result !== null && nodeData !== null


  // Preview strategy for preflop position
  const previewStrategy = useMemo(() => {
    if (viewingIndex === null) return null
    const pa = actionSequence[viewingIndex]
    if (!pa) return null

    // Count raises BEFORE this entry
    const priorActions = actionSequence.slice(0, viewingIndex).filter(a => a.action !== 'pending')
    const priorRaises = priorActions.filter(a => a.action === 'open' || a.action === '3bet' || a.action === 'squeeze')
    const priorRaiseCount = priorRaises.length
    const lastRaiser = priorRaises.length > 0 ? priorRaises[priorRaises.length - 1].position : undefined

    return buildPositionStrategyDisplay(pa.position, pa.action, openerPos ?? undefined, priorRaiseCount, lastRaiser)
  }, [viewingIndex, actionSequence, openerPos])

  // --- Action handlers ---
  const handleSetAction = useCallback((idx: number, action: PreflopAction) => {
    setActionSequence(prev => {
      if (idx < 0 || idx >= prev.length) return prev

      // Find last raise size for context-aware default sizing
      const priorRaises = prev.slice(0, idx).filter(a => a.action === 'open' || a.action === '3bet' || a.action === 'squeeze')
      const lastRaise = priorRaises.length > 0 ? priorRaises[priorRaises.length - 1].raiseSize : 0

      const updated: PositionAction = {
        ...prev[idx],
        action,
        raiseSize: action === 'open' || action === '3bet' || action === 'squeeze'
          ? (prev[idx].action === action ? prev[idx].raiseSize : defaultRaiseSize(action, lastRaise))
          : prev[idx].raiseSize,
      }

      // Build committed sequence (everything up to and including this action)
      const committed = [...prev.slice(0, idx), updated]

      // Rebuild the tail with re-entry slots if needed
      return buildSequenceTail(committed)
    })
    setOopRangeOverride(null)
    setIpRangeOverride(null)
    setResult(null)
    setNodeData(null)
    setPostflopPath([])
    setSelectedPostflopIdx(null)
    setSelectedPreflopHand(null)
    // Auto-view this index
    setViewingIndex(idx)
  }, [])

  const handleSetRaiseSize = useCallback((seqIdx: number, size: number) => {
    setActionSequence(prev => {
      if (seqIdx < 0 || seqIdx >= prev.length) return prev
      const next = [...prev]
      next[seqIdx] = { ...next[seqIdx], raiseSize: Math.max(0, size) }
      return next
    })
  }, [])

  const handleResetActions = useCallback(() => {
    setActionSequence(ALL_POSITIONS.map(pos => ({
      position: pos,
      action: 'pending' as PreflopAction,
      raiseSize: 2.5,
    })))
    setOopRangeOverride(null)
    setIpRangeOverride(null)
    setResult(null)
    setNodeData(null)
    setError(null)
    setSelectedHand(null)
    setFilterAction(null)
    setViewingIndex(null)
    setPostflopPath([])
    setSelectedPostflopIdx(null)
    setCompletedStreets([])
    setAwaitingStreetCard(null)
    setPickingStreetCard(false)
    setBoard([null, null, null, null, null])
    workerRef.current?.destroy()
    workerRef.current = null
    setSolving(false)
    setProgress(null)
  }, [])

  // Range handlers
  const handleRangeToggle = useCallback((player: 'oop' | 'ip', hand: string) => {
    const setter = player === 'oop' ? setOopRangeOverride : setIpRangeOverride
    const current = player === 'oop' ? oopRange : ipRange
    setter(prev => {
      const base = prev || { ...current }
      return { ...base, [hand]: !base[hand] }
    })
  }, [oopRange, ipRange])

  const handleBatchSet = useCallback((player: 'oop' | 'ip', hands: string[], value: boolean) => {
    const setter = player === 'oop' ? setOopRangeOverride : setIpRangeOverride
    const current = player === 'oop' ? oopRange : ipRange
    setter(prev => {
      const base = prev || { ...current }
      const next = { ...base }
      for (const h of hands) next[h] = value
      return next
    })
  }, [oopRange, ipRange])

  const applyPreset = useCallback((player: 'oop' | 'ip', position: Position) => {
    const posRange = openingRanges[position]
    const selection: Record<string, boolean> = {}
    for (const hand of allHands) {
      const action = posRange[hand]
      selection[hand] = action === 'open' || action === 'marginal-open'
    }
    if (player === 'oop') setOopRangeOverride(selection)
    else setIpRangeOverride(selection)
  }, [])

  const applySlider = useCallback((player: 'oop' | 'ip', pct: number) => {
    const selection = selectionFromPct(pct)
    if (player === 'oop') { setOopRangeOverride(selection); setOopSlider(pct) }
    else { setIpRangeOverride(selection); setIpSlider(pct) }
  }, [])

  // Board handlers
  const handlePickBoardCard = useCallback((cardInt: number) => {
    if (pickingBoard === null) return
    const slot = pickingBoard
    setBoard(prev => {
      const next = [...prev]
      next[slot] = cardInt
      return next
    })
    // Auto-advance to next empty flop slot (0→1→2), otherwise close picker
    if (slot < 2) {
      setPickingBoard(slot + 1)
    } else {
      setPickingBoard(null)
    }
  }, [pickingBoard])

  const clearBoardCard = useCallback((slot: number) => {
    setBoard(prev => { const next = [...prev]; next[slot] = null; return next })
  }, [])

  const handleRandomFlop = useCallback(() => {
    const available: number[] = []
    for (let i = 0; i < 52; i++) available.push(i)
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
    setPickingBoard(null)
    setResult(null)
    setNodeData(null)
    setPostflopPath([])
    setSelectedPostflopIdx(null)
  }, [])

  // Bet config
  const toggleBetSize = useCallback((streetKey: 'flop' | 'turn' | 'river', size: number) => {
    setBetConfig(prev => {
      const sc = { ...prev[streetKey] }
      const idx = sc.betSizes.indexOf(size)
      sc.betSizes = idx >= 0 ? sc.betSizes.filter(s => s !== size) : [...sc.betSizes, size].sort()
      return { ...prev, [streetKey]: sc }
    })
  }, [])

  const toggleRaiseSize = useCallback((streetKey: 'flop' | 'turn' | 'river', size: number) => {
    setBetConfig(prev => {
      const sc = { ...prev[streetKey] }
      const idx = sc.raiseSizes.indexOf(size)
      sc.raiseSizes = idx >= 0 ? sc.raiseSizes.filter(s => s !== size) : [...sc.raiseSizes, size].sort()
      return { ...prev, [streetKey]: sc }
    })
  }, [])

  // --- Solve ---
  const handleSolve = useCallback(async () => {
    if (!canSolve) return

    setSolving(true)
    setError(null)
    setProgress(null)
    setResult(null)
    setNodeData(null)
    setSelectedHand(null)
    setFilterAction(null)
    setEditingRange(null)
    setPostflopPath([])
    setSelectedPostflopIdx(null)
    setViewingIndex(null)
    setCompletedStreets([])
    setAwaitingStreetCard(null)
    setPickingStreetCard(false)

    const boardCards = board.filter((c): c is number => c !== null)
    const config: GameTreeConfig = {
      pot, effectiveStack,
      board: boardCards,
      oopRange: rangeFromSelection(oopRange, boardCards),
      ipRange: rangeFromSelection(ipRange, boardCards),
      betSizes: betConfig,
      street,
    }

    if (workerRef.current) workerRef.current.destroy()
    const worker = new SolverWorker()
    workerRef.current = worker
    worker.onProgress(p => setProgress(p))

    try {
      const solveResult = await worker.solve(config, maxIterations, targetExpl, solverAlgorithm)
      setResult(solveResult)
      setSolving(false)

      // Query root node and set up first postflop node
      const rootData = await worker.queryNode({ nodeIdx: 0 })
      setNodeData(rootData)

      const rootPosition = rootData.player === 0 ? oopPos! : ipPos!
      const rootNode: PostflopNode = {
        nodeIdx: 0,
        player: rootData.player,
        position: rootPosition,
        actions: rootData.actions,
        selectedAction: null,
        pot: rootData.pot,
        stack: rootData.stack,
      }
      setPostflopPath([rootNode])
      setSelectedPostflopIdx(0)
    } catch (err) {
      setError(String(err))
      setSolving(false)
    }
  }, [canSolve, board, pot, effectiveStack, oopRange, ipRange, betConfig, street, maxIterations, targetExpl, oopPos, ipPos])

  const handleStop = useCallback(() => { workerRef.current?.stop() }, [])

  // Navigate postflop tree by selecting an action on a postflop node
  const handlePostflopAction = useCallback(async (nodePathIdx: number, actionIdx: number) => {
    if (!workerRef.current) return

    setPostflopPath(prev => {
      const next = prev.slice(0, nodePathIdx + 1)
      next[nodePathIdx] = { ...next[nodePathIdx], selectedAction: actionIdx }
      return next
    })

    // Query the child node
    const currentNode = postflopPath[nodePathIdx]
    if (!currentNode) return

    // Get the node data for the current node to find child indices
    try {
      const currentData = await workerRef.current.queryNode({ nodeIdx: currentNode.nodeIdx })
      const childIdx = currentData.childIndices[actionIdx]
      if (childIdx === undefined) return

      const childData = await workerRef.current.queryNode({ nodeIdx: childIdx })
      setNodeData(childData)
      setSelectedHand(null)
    setFilterAction(null)

      // If child is a player node, add it to the path
      if (childData.actions.length > 0) {
        const childPosition = childData.player === 0 ? oopPos! : ipPos!
        const childNode: PostflopNode = {
          nodeIdx: childIdx,
          player: childData.player,
          position: childPosition,
          actions: childData.actions,
          selectedAction: null,
          pot: childData.pot,
          stack: childData.stack,
        }
        setPostflopPath(prev => {
          const next = prev.slice(0, nodePathIdx + 1)
          next[nodePathIdx] = { ...next[nodePathIdx], selectedAction: actionIdx }
          return [...next, childNode]
        })
        setSelectedPostflopIdx(nodePathIdx + 1)
        setViewingIndex(null)
      } else {
        // Terminal node — check if we can advance to next street
        const boardCount = board.filter(c => c !== null).length

        // If this is a showdown (not a fold) and we haven't dealt all 5 cards yet
        if (boardCount < 5) {
          const nextStreet = boardCount === 3 ? 'turn' : boardCount === 4 ? 'river' : null
          if (nextStreet) {
            setAwaitingStreetCard(nextStreet)
            setPostflopPath(prev => {
              const next = prev.slice(0, nodePathIdx + 1)
              next[nodePathIdx] = { ...next[nodePathIdx], selectedAction: actionIdx }
              return next
            })
          }
        }
        setSelectedPostflopIdx(nodePathIdx)
        setViewingIndex(null)
      }
    } catch (err) {
      console.error('Postflop navigation failed:', err)
    }
  }, [postflopPath, oopPos, ipPos])

  // Click a postflop node to view its strategy
  const handleViewPostflopNode = useCallback(async (nodePathIdx: number) => {
    if (!workerRef.current) return
    const node = postflopPath[nodePathIdx]
    if (!node) return

    try {
      const data = await workerRef.current.queryNode({ nodeIdx: node.nodeIdx })
      setNodeData(data)
      setSelectedHand(null)
    setFilterAction(null)
      setSelectedPostflopIdx(nodePathIdx)
      setViewingIndex(null)
    } catch (err) {
      console.error('Node query failed:', err)
    }
  }, [postflopPath])

  // Deal next street card and re-solve
  const handleDealStreetCard = useCallback(async (cardInt: number) => {
    if (!awaitingStreetCard || !oopPos || !ipPos) return

    // Save current street's postflop path
    const currentStreet = street
    setCompletedStreets(prev => [...prev, {
      street: currentStreet,
      postflopPath: [...postflopPath],
    }])

    // Update board with new card
    const newBoard = [...board]
    const nextSlot = newBoard.findIndex(c => c === null)
    if (nextSlot === -1) return
    newBoard[nextSlot] = cardInt
    setBoard(newBoard)

    // Clear street card state
    setAwaitingStreetCard(null)
    setPickingStreetCard(false)

    // Re-solve for the new street
    const boardCards = newBoard.filter((c): c is number => c !== null)
    const newStreet: 'flop' | 'turn' | 'river' = boardCards.length === 4 ? 'turn' : 'river'

    // Use current ranges — in a real solver these would be narrowed by the previous street's action
    const config: GameTreeConfig = {
      pot: nodeData?.pot ?? pot,
      effectiveStack: nodeData?.stack ?? effectiveStack,
      board: boardCards,
      oopRange: rangeFromSelection(oopRange, boardCards),
      ipRange: rangeFromSelection(ipRange, boardCards),
      betSizes: betConfig,
      street: newStreet,
    }

    setSolving(true)
    setError(null)
    setProgress(null)
    setNodeData(null)
    setSelectedHand(null)
    setFilterAction(null)
    setPostflopPath([])
    setSelectedPostflopIdx(null)

    if (workerRef.current) workerRef.current.destroy()
    const worker = new SolverWorker()
    workerRef.current = worker
    worker.onProgress(p => setProgress(p))

    try {
      const solveResult = await worker.solve(config, maxIterations, targetExpl, solverAlgorithm)
      setResult(solveResult)
      setSolving(false)

      const rootData = await worker.queryNode({ nodeIdx: 0 })
      setNodeData(rootData)

      const rootPosition = rootData.player === 0 ? oopPos : ipPos
      const rootNode: PostflopNode = {
        nodeIdx: 0,
        player: rootData.player,
        position: rootPosition,
        actions: rootData.actions,
        selectedAction: null,
        pot: rootData.pot,
        stack: rootData.stack,
      }
      setPostflopPath([rootNode])
      setSelectedPostflopIdx(0)
    } catch (err) {
      setError(String(err))
      setSolving(false)
    }
  }, [awaitingStreetCard, board, postflopPath, street, oopPos, ipPos, nodeData, pot, effectiveStack, oopRange, ipRange, betConfig, maxIterations, targetExpl])

  // Spot save/load
  const saveSpot = useCallback(() => {
    const boardCards = board.filter((c): c is number => c !== null)
    const spot: SavedSolverSpot = {
      id: generateId(),
      name: spotName || `Spot ${savedSpots.length + 1}`,
      createdAt: Date.now(),
      config: { pot, effectiveStack, board: boardCards, oopRange: rangeFromSelection(oopRange, boardCards), ipRange: rangeFromSelection(ipRange, boardCards), betSizes: betConfig, street },
    }
    const updated = [spot, ...savedSpots]
    setSavedSpots(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSpotName('')
  }, [spotName, savedSpots, board, pot, effectiveStack, oopRange, ipRange, betConfig, street])

  const deleteSpot = useCallback((id: string) => {
    const updated = savedSpots.filter(s => s.id !== id)
    setSavedSpots(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }, [savedSpots])

  useEffect(() => { return () => { workerRef.current?.destroy() } }, [])

  // Fetch per-action EVs when a hand is selected or hovered post-solve
  const activeHand = hoveredHand ?? selectedHand
  useEffect(() => {
    if (!activeHand || !nodeData || !workerRef.current || !solved) {
      setHandEVs(null)
      return
    }
    let cancelled = false
    workerRef.current.queryNode({ nodeIdx: nodeData.nodeIdx, handNotation: activeHand })
      .then(result => {
        if (!cancelled && result.handEVs) {
          setHandEVs(result.handEVs)
        }
      })
      .catch(() => { /* ignore query errors */ })
    return () => { cancelled = true }
  }, [activeHand, nodeData?.nodeIdx, solved])

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div className="animate-fade-in flex flex-col h-full overflow-hidden">
      {/* HEADER */}
      <div className="shrink-0 flex items-center justify-between pb-2 border-b border-slate-border/15 mb-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-forest" />
          <h1 className="text-body font-bold tracking-tight">Solver</h1>
          {solved && <ConvergenceBadge pct={result.exploitabilityPct} />}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowSettings(!showSettings)} className={cn('btn-ghost !py-1 !px-2 text-caption', showSettings && 'bg-slate-card')}>
            <Settings2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setShowSpotManager(!showSpotManager)} className="btn-ghost !py-1 !px-2 text-caption">
            <FolderOpen className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleResetActions} className="btn-ghost !py-1 !px-2 text-caption">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* UNIFIED TIMELINE BAR — preflop positions + board + postflop      */}
      {/* ================================================================ */}
      <div className="shrink-0 mb-2 overflow-x-auto">
        <div className="flex items-stretch gap-0.5 min-w-min pb-1">
          {/* Preflop position cards */}
          {actionSequence.map((pa, idx) => {
            const priorActions = actionSequence.slice(0, idx).filter(a => a.action !== 'pending')
            const availableActions = getAvailableActions(priorActions)
            const isViewing = viewingIndex === idx && selectedPostflopIdx === null
            const isOop = pa.position === oopPos
            const isIp = pa.position === ipPos
            const isReentry = actionSequence.slice(0, idx).some(a => a.position === pa.position)

            return (
              <div
                key={`${pa.position}-${idx}`}
                className={cn(
                  'rounded border transition-all cursor-pointer shrink-0',
                  isReentry ? 'w-[90px]' : 'w-[100px]',
                  isViewing
                    ? 'border-forest bg-slate-surface ring-1 ring-forest/40'
                    : 'border-slate-border/25 bg-slate-card/20 hover:border-slate-border/50',
                )}
                onClick={() => {
                  setViewingIndex(isViewing ? null : idx)
                  setSelectedPostflopIdx(null)
                  setSelectedPreflopHand(null)
                }}
              >
                {/* Position header */}
                <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5">
                  <span className="text-[10px] font-bold text-ink/80">
                    {isReentry && <span className="text-[7px] text-ink/30 mr-0.5">↩</span>}
                    {pa.position}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {(isOop || isIp) && pa.action !== 'fold' && pa.action !== 'pending' && (
                      <span className={cn('text-[7px] font-bold px-0.5 rounded',
                        isOop ? 'bg-error/20 text-error' : 'bg-info/20 text-info')}>
                        {isOop ? 'OOP' : 'IP'}
                      </span>
                    )}
                    <span className="text-[8px] font-mono text-ink/25">{startingStack}</span>
                  </div>
                </div>

                {/* Stacked action list */}
                <div className="px-1 pb-1.5 space-y-px">
                  {availableActions.map(act => {
                    const isSelected = pa.action === act
                    const isRaiseAction = act === 'open' || act === '3bet' || act === 'squeeze'
                    const priorRaises = priorActions.filter(a => a.action === 'open' || a.action === '3bet' || a.action === 'squeeze')
                    const lastPriorRaise = priorRaises.length > 0 ? priorRaises[priorRaises.length - 1].raiseSize : 0
                    const displaySize = isRaiseAction
                      ? (isSelected ? pa.raiseSize : defaultRaiseSize(act, lastPriorRaise))
                      : 0
                    const label = displaySize > 0 ? actionLabelWithSize(act, displaySize) : actionLabel(act)

                    return (
                      <button
                        key={act}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSetAction(idx, act)
                        }}
                        className={cn(
                          'w-full text-left px-1.5 py-0.5 rounded text-[9px] font-medium transition-all',
                          isSelected
                            ? cn('font-bold', selectedActionStyle(act))
                            : 'text-ink/30 hover:text-ink/50 hover:bg-slate-card/30',
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                  {/* Raise size editor for selected raise actions */}
                  {(pa.action === 'open' || pa.action === '3bet' || pa.action === 'squeeze') && (
                    <input
                      type="number"
                      value={pa.raiseSize}
                      onClick={e => e.stopPropagation()}
                      onChange={e => handleSetRaiseSize(idx, Math.max(0, Number(e.target.value)))}
                      className="w-full bg-slate-card/30 border border-slate-border/15 rounded mt-0.5 px-1 py-0.5 text-[8px] font-mono text-center focus:outline-none focus:border-forest/50"
                      step={0.5}
                    />
                  )}
                </div>
              </div>
            )
          })}

          {/* Deal Flop prompt — shown when all positions have acted but no flop dealt */}
          {allActed && deadCards.length < 3 && !solving && (
            <div className="flex items-center gap-1 px-1 shrink-0">
              <button
                onClick={() => setPickingBoard(0)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-dashed border-forest/40 bg-forest/5 hover:bg-forest/10 transition-all"
              >
                <span className="text-[9px] font-semibold text-forest">Deal Flop</span>
                <div className="flex gap-0.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-6 h-8 rounded border border-dashed border-forest/30 flex items-center justify-center">
                      <span className="text-[7px] text-forest/50">F</span>
                    </div>
                  ))}
                </div>
              </button>
              <button
                onClick={handleRandomFlop}
                className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg border border-dashed border-ink/20 bg-slate-card/20 hover:bg-slate-card/40 transition-all"
                title="Random flop"
              >
                <RotateCcw className="w-3.5 h-3.5 text-ink/40" />
                <span className="text-[7px] text-ink/30">Random</span>
              </button>
            </div>
          )}

          {/* Flop board cards */}
          {deadCards.length >= 3 && (
            <div className="flex items-center px-1">
              <div className="flex items-center gap-0.5">
                <span className="text-[8px] text-ink/20 uppercase mr-0.5">Flop</span>
                {board.slice(0, 3).map((card, idx) => (
                  card !== null && (
                    <div key={idx} className="w-7 h-9 rounded border border-slate-border/40 bg-white flex items-center justify-center">
                      <CardLabel card={card} />
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Completed streets — read-only nodes from previous streets */}
          {completedStreets.map((cs, csIdx) => (
            <Fragment key={`cs-${csIdx}`}>
              {/* Completed street's postflop nodes (read-only) */}
              {cs.postflopPath.map((pfNode, pfIdx) => {
                const selectedActionLabel = pfNode.selectedAction !== null ? pfNode.actions[pfNode.selectedAction] : null
                return (
                  <div
                    key={`cs-${csIdx}-pf-${pfIdx}`}
                    className="rounded border border-slate-border/15 bg-slate-card/10 w-[100px] shrink-0 opacity-60"
                  >
                    <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5">
                      <span className="text-[10px] font-bold text-ink/50">{pfNode.position}</span>
                      <span className={cn('text-[7px] font-bold px-0.5 rounded',
                        pfNode.player === 0 ? 'bg-error/20 text-error/60' : 'bg-info/20 text-info/60')}>
                        {pfNode.player === 0 ? 'OOP' : 'IP'}
                      </span>
                    </div>
                    <div className="px-1 pb-1.5">
                      {selectedActionLabel && (
                        <div className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold', solverActionStyle(selectedActionLabel))}>
                          {selectedActionLabel}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Street separator — turn or river card */}
              {board[csIdx === 0 ? 3 : 4] !== null && (
                <div className="flex items-center px-1">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[8px] text-ink/20 uppercase mr-0.5">{csIdx === 0 ? 'Turn' : 'River'}</span>
                    <div className="w-7 h-9 rounded border border-slate-border/40 bg-white flex items-center justify-center">
                      <CardLabel card={board[csIdx === 0 ? 3 : 4]!} />
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          ))}

          {/* Current street's postflop node cards */}
          {postflopPath.map((pfNode, pfIdx) => {
            const isSelected = selectedPostflopIdx === pfIdx && viewingPosition === null

            return (
              <div
                key={`pf-${pfIdx}`}
                className={cn(
                  'rounded border transition-all cursor-pointer w-[100px] shrink-0',
                  isSelected
                    ? 'border-forest bg-slate-surface ring-1 ring-forest/40'
                    : 'border-slate-border/25 bg-slate-card/20 hover:border-slate-border/50',
                )}
                onClick={() => {
                  handleViewPostflopNode(pfIdx)
                  setViewingIndex(null)
                }}
              >
                {/* Node header */}
                <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5">
                  <span className="text-[10px] font-bold text-ink/80">{pfNode.position}</span>
                  <span className={cn('text-[7px] font-bold px-0.5 rounded',
                    pfNode.player === 0 ? 'bg-error/20 text-error' : 'bg-info/20 text-info')}>
                    {pfNode.player === 0 ? 'OOP' : 'IP'}
                  </span>
                </div>

                {/* Stacked action list from solver */}
                <div className="px-1 pb-1.5 space-y-px">
                  {pfNode.actions.map((act, actIdx) => {
                    const isSelectedAction = pfNode.selectedAction === actIdx
                    return (
                      <button
                        key={act}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePostflopAction(pfIdx, actIdx)
                        }}
                        className={cn(
                          'w-full text-left px-1.5 py-0.5 rounded text-[9px] font-medium transition-all',
                          isSelectedAction
                            ? cn('font-bold', solverActionStyle(act))
                            : 'text-ink/30 hover:text-ink/50 hover:bg-slate-card/30',
                        )}
                      >
                        {act}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Deal next street card prompt */}
          {awaitingStreetCard && !solving && (
            <div className="flex items-center gap-1.5 px-1 shrink-0">
              <button
                onClick={() => setPickingStreetCard(true)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg border border-dashed border-forest/40 bg-forest/5 hover:bg-forest/10 transition-all"
              >
                <span className="text-[9px] font-semibold text-forest">Deal {awaitingStreetCard === 'turn' ? 'Turn' : 'River'}</span>
                <div className="w-7 h-9 rounded border border-dashed border-forest/30 flex items-center justify-center">
                  <span className="text-[8px] text-forest/50">{awaitingStreetCard === 'turn' ? 'T' : 'R'}</span>
                </div>
              </button>
              <button
                onClick={() => handleDealStreetCard(pickRandomCard(deadCards))}
                className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg border border-dashed border-ink/20 bg-slate-card/30 hover:bg-slate-card/60 transition-all"
                title={`Random ${awaitingStreetCard} card`}
              >
                <span className="text-[9px] font-medium text-ink/50">Random</span>
                <Shuffle className="w-4 h-4 text-ink/30" />
              </button>
            </div>
          )}

          {/* Solve button at the end */}
          {allActed && !solving && (
            <div className="flex items-center px-1 shrink-0">
              <button
                onClick={handleSolve}
                disabled={!canSolve}
                className={cn(
                  'py-1.5 px-4 rounded-lg text-[10px] font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap',
                  canSolve
                    ? 'bg-forest text-white hover:bg-forest-light'
                    : 'bg-slate-card text-ink/30 cursor-not-allowed',
                )}
              >
                <Play className="w-3 h-3" /> {solved ? 'Re-solve' : 'Solve'}
              </button>
            </div>
          )}
          {solving && (
            <div className="flex items-center px-1 shrink-0">
              <button onClick={handleStop} className="py-1.5 px-4 rounded-lg text-[10px] font-semibold inline-flex items-center gap-1.5 bg-error/80 text-white hover:bg-error">
                <Square className="w-3 h-3" /> Stop
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Board editor + spot info bar */}
      <div className="shrink-0 mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Board card slots */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-ink/25 font-medium uppercase mr-0.5">Board</span>
            {board.map((card, idx) => (
              <button
                key={idx}
                onClick={() => { if (card !== null) clearBoardCard(idx); else setPickingBoard(idx) }}
                className={cn(
                  'w-7 h-9 rounded border flex items-center justify-center font-mono text-[10px] font-bold transition-all',
                  card !== null
                    ? 'bg-white border-slate-border/60 text-graphite'
                    : pickingBoard === idx
                      ? 'border-forest bg-forest/10 text-forest'
                      : idx < 3
                        ? 'border-dashed border-slate-border/30 text-ink/15 hover:border-ink/30'
                        : 'border-dashed border-slate-border/15 text-ink/10 hover:border-ink/20',
                )}
              >
                {card !== null ? <CardLabel card={card} /> : <span className="text-[7px]">{idx < 3 ? 'F' : idx === 3 ? 'T' : 'R'}</span>}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-slate-border/15" />

          <InspectorStat label="Pot" value={`${pot}`} unit="bb" />
          <InspectorStat label="Eff" value={`${effectiveStack}`} unit="bb" />
          <InspectorStat label="SPR" value={spr > 0 ? spr.toFixed(1) : '—'} />

          <div className="h-5 w-px bg-slate-border/15" />

          <div className="flex items-center gap-1">
            <span className="text-[8px] text-ink/25 uppercase">Stack</span>
            <input
              type="number" value={startingStack}
              onChange={e => setStartingStack(Math.max(1, Number(e.target.value)))}
              className="w-12 bg-slate-card border border-slate-border/20 rounded px-1 py-0.5 text-[10px] font-mono text-center focus:outline-none focus:border-forest/50"
            />
          </div>

          {oopPos && <span className="text-[9px]"><span className="text-ink/30">OOP</span> <span className="text-error font-bold">{oopPos}</span></span>}
          {ipPos && <span className="text-[9px]"><span className="text-ink/30">IP</span> <span className="text-info font-bold">{ipPos}</span></span>}
        </div>

        {/* Card picker */}
        {pickingBoard !== null && (
          <div className="card !p-3 mt-2 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <p className="text-micro text-ink/50">Select {pickingBoard < 3 ? 'flop' : pickingBoard === 3 ? 'turn' : 'river'} card</p>
              <button onClick={() => setPickingBoard(null)} className="text-ink/30 hover:text-ink"><X className="w-3.5 h-3.5" /></button>
            </div>
            <CardPicker deadCards={deadCards} onPick={handlePickBoardCard} />
          </div>
        )}

        {/* Street card picker (inline in board area for turn/river) */}
        {pickingStreetCard && awaitingStreetCard && (
          <div className="card !p-3 mt-2 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <p className="text-micro text-ink/50">Select {awaitingStreetCard} card</p>
              <button onClick={() => setPickingStreetCard(false)} className="text-ink/30 hover:text-ink"><X className="w-3.5 h-3.5" /></button>
            </div>
            <CardPicker deadCards={deadCards} onPick={(cardInt) => handleDealStreetCard(cardInt)} />
          </div>
        )}

        {/* Settings */}
        {showSettings && (
          <div className="card !p-3 mt-2 animate-slide-up space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-micro font-medium text-ink/60">Solver Settings</p>
              <button onClick={() => setShowSettings(false)} className="text-ink/30 hover:text-ink"><X className="w-3.5 h-3.5" /></button>
            </div>
            <BetSizeConfig config={betConfig} street={street} onToggleBet={toggleBetSize} onToggleRaise={toggleRaiseSize} />
            <div className="flex items-center gap-4 pt-2 border-t border-slate-border/20">
              <div>
                <label className="text-[9px] text-ink/30 block uppercase">Algorithm</label>
                <div className="flex rounded overflow-hidden border border-slate-border/30 mt-0.5">
                  <button
                    onClick={() => setSolverAlgorithm('cfr+')}
                    className={cn(
                      'px-2 py-1 text-micro font-medium transition-colors',
                      solverAlgorithm === 'cfr+'
                        ? 'bg-forest text-white'
                        : 'bg-slate-card text-ink/40 hover:text-ink/60',
                    )}
                  >
                    CFR+
                  </button>
                  <button
                    onClick={() => setSolverAlgorithm('dcfr')}
                    className={cn(
                      'px-2 py-1 text-micro font-medium transition-colors',
                      solverAlgorithm === 'dcfr'
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-card text-ink/40 hover:text-ink/60',
                    )}
                  >
                    DCFR
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[9px] text-ink/30 block uppercase">Iterations</label>
                <input type="number" value={maxIterations} onChange={e => setMaxIterations(Math.max(10, Number(e.target.value)))} className="w-20 bg-slate-card border border-slate-border/30 rounded px-2 py-1 text-micro font-mono text-center focus:outline-none focus:border-forest/50" />
              </div>
              <div>
                <label className="text-[9px] text-ink/30 block uppercase">Target (%pot)</label>
                <input type="number" value={targetExpl} step={0.1} onChange={e => setTargetExpl(Math.max(0.01, Number(e.target.value)))} className="w-20 bg-slate-card border border-slate-border/30 rounded px-2 py-1 text-micro font-mono text-center focus:outline-none focus:border-forest/50" />
              </div>
            </div>
            {solverAlgorithm === 'dcfr' && (
              <p className="text-[9px] text-purple-400/60 leading-tight">
                Discounted CFR (Brown & Sandholm 2018) — faster convergence via regret discounting (α=1.5, β=0, γ=2)
              </p>
            )}
          </div>
        )}

        {/* Spot manager */}
        {showSpotManager && (
          <div className="card !p-3 mt-2 animate-slide-up space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-micro font-medium text-ink/60">Saved Spots</p>
              <button onClick={() => setShowSpotManager(false)} className="text-ink/30 hover:text-ink"><X className="w-3.5 h-3.5" /></button>
            </div>
            {savedSpots.length === 0 ? <p className="text-micro text-ink/30">No saved spots.</p> : (
              <div className="space-y-0.5 max-h-24 overflow-y-auto">
                {savedSpots.map(spot => (
                  <div key={spot.id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-slate-card/50 text-micro">
                    <span className="font-medium">{spot.name}</span>
                    <button onClick={() => deleteSpot(spot.id)} className="text-ink/20 hover:text-error"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-border/20">
              <input value={spotName} onChange={e => setSpotName(e.target.value)} placeholder="Name..." className="flex-1 bg-slate-card border border-slate-border/30 rounded px-2 py-1 text-micro focus:outline-none focus:border-forest/50" />
              <button onClick={saveSpot} className="btn-primary !py-1 !px-2.5 text-micro inline-flex items-center gap-1"><Save className="w-3 h-3" /> Save</button>
            </div>
          </div>
        )}

        {/* Solving progress */}
        {solving && progress && (
          <div className="card !p-3 mt-2 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse" />
                <span className="text-micro font-medium">
                  <span className={cn('font-mono mr-1.5 text-[9px] px-1 rounded', solverAlgorithm === 'dcfr' ? 'bg-purple-500/20 text-purple-400' : 'bg-forest/20 text-forest-light')}>
                    {solverAlgorithm === 'dcfr' ? 'DCFR' : 'CFR+'}
                  </span>
                  Iter {progress.iteration}/{progress.totalIterations}
                </span>
              </div>
              <span className={cn('text-micro font-mono font-medium', progress.exploitabilityPct < 1 ? 'text-success' : progress.exploitabilityPct < 2 ? 'text-gold' : 'text-error')}>
                {progress.exploitabilityPct.toFixed(2)}% pot
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-card overflow-hidden">
              <div className="h-full bg-forest rounded-full transition-all duration-300" style={{ width: `${(progress.iteration / progress.totalIterations) * 100}%` }} />
            </div>
          </div>
        )}

        {error && <div className="card !p-3 mt-2 border-l-4 border-l-error bg-error/5 text-micro text-error animate-slide-up">{error}</div>}
      </div>

      {/* ================================================================ */}
      {/* MAIN CONTENT                                                     */}
      {/* ================================================================ */}
      <div className="flex-1 min-h-0 flex flex-col">
        {/* Postflop solver results view */}
        {solved && selectedPostflopIdx !== null && nodeData && viewingPosition === null ? (
          <div className="flex-1 min-h-0 flex flex-col gap-2">
            {/* Strategy grid + results */}
            <div className="flex-1 min-h-0 grid grid-cols-[1fr,300px] gap-3">
              {/* LEFT: Strategy Matrix */}
              <div className="min-h-0 overflow-auto">
                <StrategyDisplay
                  handStrategies={nodeData.handStrategies}
                  actions={nodeData.actions}
                  selectedHand={selectedHand}
                  onHandClick={(hand) => { setSelectedHand(hand); setFilterAction(null) }}
                  filterAction={filterAction}
                  onHandHover={setHoveredHand}
                />
              </div>

              {/* RIGHT: Actions + Hand Detail */}
              <div className="min-h-0 overflow-y-auto space-y-3">
                <div>
                  <p className="text-[9px] text-ink/30 uppercase tracking-wider mb-1.5 font-medium">Strategy at Equilibrium</p>
                  <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(nodeData.actions.length, 3)}, 1fr)` }}>
                    {nodeData.aggregateFrequencies
                      .filter(a => a.frequency > 0.005)
                      .sort((a, b) => b.frequency - a.frequency)
                      .map(a => {
                        const isActive = filterAction === a.action
                        return (
                          <button
                            key={a.action}
                            onClick={() => setFilterAction(isActive ? null : a.action)}
                            className={cn(
                              'rounded-lg p-2 text-center transition-all',
                              isActive ? 'ring-2 ring-white/60' : 'hover:ring-1 hover:ring-white/30',
                              isActive ? getActionBgColor(a.action) : cn(getActionBgColor(a.action), !isActive && filterAction ? 'opacity-40' : ''),
                            )}
                          >
                            <p className="text-[10px] font-semibold text-white/90">{a.action}</p>
                            <p className="text-base font-bold font-mono text-white">{(a.frequency * 100).toFixed(1)}%</p>
                            <p className="text-[8px] text-white/50 font-mono">{(a.frequency * nodeData.totalCombos).toFixed(0)} combos</p>
                          </button>
                        )
                      })}
                  </div>
                </div>

                {/* Hand detail — show hovered hand if hovering, otherwise selected */}
                <div className="border-t border-slate-border/20 pt-2">
                  {hoveredHand && nodeData.handStrategies[hoveredHand] ? (
                    <HandStrategyDetail hand={hoveredHand} strategy={nodeData.handStrategies[hoveredHand]} combos={nodeData.comboStrategies[hoveredHand]} handEVs={handEVs} actions={nodeData.actions} />
                  ) : selectedHand && nodeData.handStrategies[selectedHand] ? (
                    <HandStrategyDetail hand={selectedHand} strategy={nodeData.handStrategies[selectedHand]} combos={nodeData.comboStrategies[selectedHand]} handEVs={handEVs} actions={nodeData.actions} />
                  ) : (
                    <div className="text-micro text-ink/30 text-center py-3">Hover or click a hand to inspect</div>
                  )}
                </div>

                {/* Metadata */}
                <div className="border-t border-slate-border/20 pt-2 text-[10px] text-ink/40 space-y-0.5">
                  <p className="text-[9px] text-ink/30 uppercase tracking-wider font-medium mb-1">Solver Metadata</p>
                  <div className="flex justify-between"><span>Algorithm</span><span className={cn('font-mono', solverAlgorithm === 'dcfr' ? 'text-purple-400' : 'text-forest-light')}>{solverAlgorithm === 'dcfr' ? 'DCFR' : 'CFR+'}</span></div>
                  <div className="flex justify-between"><span>Nash distance</span><span className="font-mono">{result.exploitabilityPct.toFixed(2)}% pot</span></div>
                  <div className="flex justify-between"><span>Iterations</span><span className="font-mono">{result.iterations} in {(result.elapsed / 1000).toFixed(1)}s</span></div>
                  <div className="flex justify-between"><span>Pot / Stack</span><span className="font-mono">{nodeData.pot.toFixed(1)} / {nodeData.stack.toFixed(1)}</span></div>
                </div>
              </div>
            </div>
          </div>
        ) : viewingPosition && previewStrategy ? (
          /* Preflop range/strategy preview */
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="flex gap-3">
              <div className="flex-1 card !p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold text-ink/60">
                    {viewingPosition}
                    <span className="text-ink/30 ml-1">— {previewStrategy.label}</span>
                  </p>
                  <button onClick={() => setViewingIndex(null)} className="text-ink/20 hover:text-ink"><X className="w-3 h-3" /></button>
                </div>
                <RangeChart range={previewStrategy.strategy} compact onHandClick={setSelectedPreflopHand} highlightHand={selectedPreflopHand ?? undefined} />
              </div>

              <div className="w-44 shrink-0 space-y-2">
                <p className="text-[9px] text-ink/30 uppercase tracking-wider font-medium">Actions</p>
                {Object.entries(previewStrategy.actionCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([action, combos]) => (
                    <div key={action} className={cn('rounded-lg p-2 text-center', getPreviewActionColor(action))}>
                      <p className="text-[10px] font-semibold text-white/90">{action}</p>
                      <p className="text-base font-bold font-mono text-white">{((combos / TOTAL_COMBOS) * 100).toFixed(1)}%</p>
                      <p className="text-[8px] text-white/50 font-mono">{combos} combos</p>
                    </div>
                  ))}

                {/* Selected hand detail */}
                {selectedPreflopHand && (() => {
                  const action = previewStrategy.strategy[selectedPreflopHand] || 'fold'
                  const combos = selectedPreflopHand.length === 2 ? 6 : selectedPreflopHand.endsWith('s') ? 4 : 12
                  const actionLabels: Record<string, string> = {
                    open: 'Open', fold: 'Fold', call: 'Call', '3bet-value': '3-Bet Value', '3bet-bluff': '3-Bet Bluff', 'marginal-open': 'Marginal Open',
                  }
                  const actionColors: Record<string, string> = {
                    open: 'bg-forest/20 text-forest', fold: 'bg-slate-card/40 text-ink/50', call: 'bg-info/20 text-info',
                    '3bet-value': 'bg-purple-500/20 text-purple-400', '3bet-bluff': 'bg-orange-400/20 text-orange-400', 'marginal-open': 'bg-gold/20 text-gold',
                  }
                  return (
                    <div className="border-t border-slate-border/20 pt-2 space-y-1">
                      <p className="text-[9px] text-ink/30 uppercase tracking-wider font-medium">Hand Detail</p>
                      <p className="text-h4 font-bold font-mono">{selectedPreflopHand}</p>
                      <span className={cn('inline-block px-2 py-0.5 rounded text-[10px] font-semibold', actionColors[action] || 'bg-slate-card/30 text-ink/50')}>
                        {actionLabels[action] || action}
                      </span>
                      <p className="text-micro text-ink/40">{combos} combos • {selectedPreflopHand.length === 2 ? 'Pair' : selectedPreflopHand.endsWith('s') ? 'Suited' : 'Offsuit'}</p>
                      <p className="text-micro text-ink/30">Strength: {handStrength[selectedPreflopHand] ?? '?'}/100</p>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        ) : allActed && activeCount >= 2 && !solved ? (
          /* Range editors */
          <div className="flex-1 min-h-0 overflow-y-auto">
            {editingRange ? (
              <div className="card !p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-caption font-medium">{editingRange === 'oop' ? `OOP${oopPos ? ` (${oopPos})` : ''}` : `IP${ipPos ? ` (${ipPos})` : ''}`}</p>
                  <button onClick={() => setEditingRange(null)} className="btn-ghost !py-0.5 !px-2 text-micro">Done</button>
                </div>
                <div className="flex gap-1 mb-2">
                  {(['UTG', 'HJ', 'CO', 'BU', 'SB'] as Position[]).map(p => (
                    <button key={p} onClick={() => applyPreset(editingRange, p)} className="btn-ghost !py-0.5 !px-2 text-micro">{p}</button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-micro text-ink/40">Top %</span>
                  <input type="range" min={0} max={100} step={0.5} value={editingRange === 'oop' ? oopSlider : ipSlider} onChange={e => applySlider(editingRange, Number(e.target.value))} className="flex-1 h-1 accent-forest" />
                  <span className="text-micro font-mono text-ink/50 w-10 text-right">{editingRange === 'oop' ? oopSlider : ipSlider}%</span>
                </div>
                <RangeChart range={editingRange === 'oop' ? oopRange : ipRange} selectable onToggle={h => handleRangeToggle(editingRange, h)} onBatchSet={(h, v) => handleBatchSet(editingRange, h, v)} compact />
                <p className="text-micro text-ink/40 mt-1 font-mono">{editingRange === 'oop' ? oopCombos : ipCombos} combos ({editingRange === 'oop' ? ((oopCombos / TOTAL_COMBOS) * 100).toFixed(1) : ((ipCombos / TOTAL_COMBOS) * 100).toFixed(1)}%)</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[10px] text-ink/30 uppercase tracking-wider font-medium">Ranges (auto-derived — click to edit)</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="card !p-3 cursor-pointer hover:border-forest/30 transition-all" onClick={() => setEditingRange('oop')}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-caption font-medium">OOP{oopPos ? ` (${oopPos})` : ''}</p>
                      <span className="text-micro text-ink/40 font-mono">{oopCombos} ({((oopCombos / TOTAL_COMBOS) * 100).toFixed(1)}%)</span>
                    </div>
                    <RangeChart range={oopRange} compact />
                  </div>
                  <div className="card !p-3 cursor-pointer hover:border-forest/30 transition-all" onClick={() => setEditingRange('ip')}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-caption font-medium">IP{ipPos ? ` (${ipPos})` : ''}</p>
                      <span className="text-micro text-ink/40 font-mono">{ipCombos} ({((ipCombos / TOTAL_COMBOS) * 100).toFixed(1)}%)</span>
                    </div>
                    <RangeChart range={ipRange} compact />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-caption text-ink/30">
            <Cpu className="w-8 h-8 mx-auto mb-3 text-ink/10" />
            <p className="mb-1 font-medium">Select actions for each position above.</p>
            <p className="text-micro text-ink/20">Click any position to preview its range.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Sub-components & helpers
// ============================================================================

function InspectorStat({ label, value, unit, highlight }: { label: string; value: string; unit?: string; highlight?: 'error' | 'info' }) {
  return (
    <div className="text-center">
      <span className="text-[7px] text-ink/25 uppercase block">{label}</span>
      <span className={cn('text-[10px] font-mono font-bold', highlight === 'error' && 'text-error', highlight === 'info' && 'text-info')}>
        {value}{unit && <span className="text-[8px] text-ink/30 ml-0.5">{unit}</span>}
      </span>
    </div>
  )
}

function selectedActionStyle(action: PreflopAction): string {
  switch (action) {
    case 'open': return 'bg-forest/20 text-forest'
    case 'call': return 'bg-info/20 text-info'
    case '3bet': return 'bg-purple-500/20 text-purple-400'
    case 'squeeze': return 'bg-orange-400/20 text-orange-400'
    case 'fold': return 'bg-slate-card/40 text-ink/50'
    default: return ''
  }
}

function solverActionStyle(action: string): string {
  if (action === 'Fold') return 'bg-error/20 text-error'
  if (action === 'Check') return 'bg-info/20 text-info'
  if (action === 'Call') return 'bg-info/20 text-info'
  if (action.startsWith('Bet')) return 'bg-forest/20 text-forest'
  if (action.startsWith('Raise')) return 'bg-purple-500/20 text-purple-400'
  if (action === 'All-In') return 'bg-gold/20 text-gold'
  return 'bg-slate-card/30 text-ink/50'
}

const SUIT_COLOR: Record<Suit, string> = {
  s: 'text-slate-300',     // spades = light grey (visible on dark bg)
  h: 'text-red-500',       // hearts = red
  d: 'text-blue-400',      // diamonds = blue
  c: 'text-emerald-400',   // clubs = green
}

const SUIT_COLOR_LIGHT: Record<Suit, string> = {
  s: 'text-slate-800',     // spades = dark on light bg
  h: 'text-red-600',       // hearts = red
  d: 'text-blue-600',      // diamonds = blue
  c: 'text-emerald-600',   // clubs = green
}

function CardLabel({ card, onLight = true }: { card: number; onLight?: boolean }) {
  const c = intToCard(card)
  const colors = onLight ? SUIT_COLOR_LIGHT : SUIT_COLOR
  return <span className={cn('text-[10px] font-bold', colors[c.suit])}>{c.rank}{SUIT_SYMBOLS[c.suit]}</span>
}

function CardPicker({ deadCards, onPick }: { deadCards: number[]; onPick: (card: number) => void }) {
  const dead = new Set(deadCards)
  return (
    <div className="grid gap-px" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
      {SUITS.map(suit =>
        RANKS.map(rank => {
          const card = cardToInt({ rank, suit })
          const isDead = dead.has(card)
          return (
            <button key={`${rank}${suit}`} onClick={() => !isDead && onPick(card)} disabled={isDead}
              className={cn('w-7 h-7 flex items-center justify-center text-[10px] font-mono font-bold rounded transition-all',
                isDead ? 'opacity-20 cursor-not-allowed bg-slate-card/30' : cn('bg-slate-card hover:bg-forest/30 cursor-pointer', SUIT_COLOR[suit]))}>
              {rank}{SUIT_SYMBOLS[suit]}
            </button>
          )
        })
      )}
    </div>
  )
}

function BetSizeConfig({ config, street, onToggleBet, onToggleRaise }: {
  config: BetTreeConfig; street: 'flop' | 'turn' | 'river'
  onToggleBet: (s: 'flop' | 'turn' | 'river', size: number) => void
  onToggleRaise: (s: 'flop' | 'turn' | 'river', size: number) => void
}) {
  const streets: ('flop' | 'turn' | 'river')[] = street === 'flop' ? ['flop', 'turn', 'river'] : street === 'turn' ? ['turn', 'river'] : ['river']
  const betOptions = [0.33, 0.5, 0.75, 1.0, 1.5, 2.0]
  const raiseOptions = [0.5, 0.75, 1.0, 1.5]

  return (
    <div className="space-y-2">
      {streets.map(s => (
        <div key={s} className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-ink/30 w-10 capitalize">{s}</span>
          <div className="flex items-center gap-0.5">
            <span className="text-[9px] text-ink/20 mr-0.5">B:</span>
            {betOptions.map(size => (
              <button key={size} onClick={() => onToggleBet(s, size)} className={cn('px-1.5 py-0.5 rounded text-[10px] font-mono transition-all',
                config[s].betSizes.includes(size) ? 'bg-forest/25 text-forest-light border border-forest/30' : 'bg-slate-card/30 text-ink/20 border border-transparent hover:text-ink/40')}>
                {Math.round(size * 100)}%
              </button>
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-[9px] text-ink/20 mr-0.5">R:</span>
            {raiseOptions.map(size => (
              <button key={size} onClick={() => onToggleRaise(s, size)} className={cn('px-1.5 py-0.5 rounded text-[10px] font-mono transition-all',
                config[s].raiseSizes.includes(size) ? 'bg-purple-500/25 text-purple-300 border border-purple-500/30' : 'bg-slate-card/30 text-ink/20 border border-transparent hover:text-ink/40')}>
                {Math.round(size * 100)}%
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ConvergenceBadge({ pct }: { pct: number }) {
  const [label, color] = pct < 0.5 ? ['Excellent', 'badge-success'] : pct < 1 ? ['Good', 'badge-forest'] : pct < 2 ? ['OK', 'badge-gold'] : ['Needs More', 'badge-error']
  return <span className={cn('badge text-[9px]', color)}>{label}</span>
}

function getPreviewActionColor(action: string): string {
  if (action === 'Open' || action === 'Raise') return 'bg-forest/70'
  if (action === 'Fold') return 'bg-error/50'
  if (action === 'Call') return 'bg-info/60'
  if (action === '3-Bet' || action === 'Squeeze') return 'bg-purple-500/60'
  return 'bg-slate-card'
}

function getActionBgColor(action: string): string {
  if (action === 'Fold') return 'bg-error/60'
  if (action === 'Check') return 'bg-info/50'
  if (action === 'Call') return 'bg-info/60'
  if (action.startsWith('Bet')) return 'bg-forest/70'
  if (action.startsWith('Raise')) return 'bg-purple-500/60'
  if (action === 'All-In') return 'bg-gold/70'
  return 'bg-slate-card'
}
