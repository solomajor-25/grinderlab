/**
 * Solver type definitions.
 * All types for the CFR+ poker solver engine.
 */

/** A hand combo with weight (0-1) */
export interface WeightedCombo {
  cards: [number, number]  // two card ints (0-51)
  weight: number           // 0.0-1.0
}

/** Bet size configuration per street */
export interface StreetBetConfig {
  betSizes: number[]       // fractions of pot (e.g., 0.33, 0.5, 0.75, 1.0)
  raiseSizes: number[]     // fractions of pot for raises
  allinThreshold: number   // auto-jam when bet would use >X% of remaining stack (0-1)
}

/** Full bet tree configuration */
export interface BetTreeConfig {
  flop: StreetBetConfig
  turn: StreetBetConfig
  river: StreetBetConfig
}

/** Top-level solver spot configuration */
export interface GameTreeConfig {
  pot: number               // starting pot in bb
  effectiveStack: number    // effective stack in bb
  board: number[]           // 3, 4, or 5 card ints (0-51)
  oopRange: WeightedCombo[] // OOP player's range
  ipRange: WeightedCombo[]  // IP player's range
  betSizes: BetTreeConfig   // action abstraction
  street: 'flop' | 'turn' | 'river'
}

/** Node types in the game tree */
export const NodeType = {
  PlayerOOP: 0,
  PlayerIP: 1,
  Chance: 2,
  TerminalFold: 3,
  TerminalShowdown: 4,
} as const
export type NodeType = (typeof NodeType)[keyof typeof NodeType]

/** Action types on edges of the game tree */
export const ActionType = {
  Fold: 0,
  Check: 1,
  Call: 2,
  Bet: 3,
  Raise: 4,
  AllIn: 5,
} as const
export type ActionType = (typeof ActionType)[keyof typeof ActionType]

/** An action edge in the tree */
export interface Action {
  type: ActionType
  size: number  // bet/raise amount in bb (0 for fold/check/call)
  label: string // human-readable label like "Bet 75%"
}

/** A single node in the flat game tree */
export interface TreeNode {
  type: NodeType
  parent: number         // parent node index (-1 for root)
  actionFromParent: number // which action index of parent led here
  children: number[]     // child node indices
  actions: Action[]      // available actions (for player nodes)
  pot: number            // pot at this node in bb
  stack: number          // remaining effective stack in bb
  street: number         // 0=flop, 1=turn, 2=river
  player: number         // 0=oop, 1=ip (for player nodes)
  foldWinner: number     // 0=oop, 1=ip (for terminal fold nodes)
  strategyOffset: number // offset into strategy arrays
  oopInvested: number    // how much OOP invested from stack into pot
  ipInvested: number     // how much IP invested from stack into pot
}

/** The complete game tree data structure */
export interface GameTreeData {
  nodes: TreeNode[]
  root: number

  // Flat strategy arrays (per player-node: numHands * numActions)
  cumulativeRegret: Float32Array
  strategySum: Float32Array
  currentStrategy: Float32Array
  totalStrategySize: number

  // Hand data
  oopHands: [number, number][]
  ipHands: [number, number][]
  oopWeights: Float32Array
  ipWeights: Float32Array

  // Precomputed showdown matrix
  // showdownMatrix[oopIdx * ipHandCount + ipIdx] = +1 (oop wins), -1 (ip wins), 0 (tie)
  showdownMatrix: Int8Array

  // Board
  board: number[]

  // Config reference
  config: GameTreeConfig
}

/** Action frequency at a solved node */
export interface ActionFrequency {
  action: string     // "fold", "check", "call", "bet 75%", etc.
  frequency: number  // 0-1
  ev: number         // expected value in bb
}

/** Per-combo strategy breakdown (e.g., Q♠J♠ bets, Q♥J♥ checks) */
export interface ComboStrategy {
  combo: string      // e.g. "Q♠J♠"
  card1: number      // card int
  card2: number      // card int
  frequencies: ActionFrequency[]
}

/** Progress updates from the solver */
export interface SolverProgress {
  iteration: number
  totalIterations: number
  exploitability: number  // nash distance in bb
  exploitabilityPct: number // as % of pot
  elapsed: number         // ms
  nodesPerSecond: number
  exploitabilityHistory: number[] // for chart
}

/** Final solver result */
export interface SolverResult {
  converged: boolean
  iterations: number
  exploitability: number
  exploitabilityPct: number
  elapsed: number
}

/** Query for a specific node's strategy */
export interface NodeQuery {
  nodeIdx: number
  handIdx?: number         // if set, return single hand detail
  handNotation?: string    // if set, average EVs across all combos of this notation (e.g. "AKs")
}

/** Response to a node query */
export interface NodeQueryResult {
  nodeIdx: number
  actions: string[]
  player: number
  pot: number
  stack: number
  street: number
  actionHistory: string[]
  // Range-level: hand notation -> action frequencies
  handStrategies: Record<string, ActionFrequency[]>
  // Combo-level: hand notation -> per-combo strategies
  comboStrategies: Record<string, ComboStrategy[]>
  // Aggregate frequencies across the range
  aggregateFrequencies: ActionFrequency[]
  // Child node indices for navigation
  childIndices: number[]
  // Total combos in range at this node
  totalCombos: number
  // Per-action EV for a selected hand (only set when query has handIdx)
  handEVs?: number[]
}

// Worker message types
export type WorkerCommand =
  | { type: 'solve'; config: GameTreeConfig; maxIterations: number; targetExploitability: number; algorithm?: SolverAlgorithm; dcfrParams?: DCFRParams }
  | { type: 'stop' }
  | { type: 'query'; query: NodeQuery }

export type WorkerMessage =
  | { type: 'progress'; data: SolverProgress }
  | { type: 'complete'; data: SolverResult }
  | { type: 'error'; message: string }
  | { type: 'queryResult'; data: NodeQueryResult }

/** Solver algorithm variants */
export type SolverAlgorithm = 'cfr+' | 'dcfr'

/** DCFR discount parameters (from Brown & Sandholm 2018) */
export interface DCFRParams {
  alpha: number   // positive regret discount exponent (default: 1.5)
  beta: number    // negative regret discount exponent (default: 0)
  gamma: number   // strategy contribution exponent (default: 2)
}

/** Default DCFR parameters */
export const DEFAULT_DCFR_PARAMS: DCFRParams = {
  alpha: 1.5,
  beta: 0,
  gamma: 2,
}

/** Saved solver spot */
export interface SavedSolverSpot {
  id: string
  name: string
  createdAt: number
  config: GameTreeConfig
}
