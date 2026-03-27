/**
 * Practice hand generator for each chapter.
 * Produces 200 hands per chapter from scenario templates.
 */
import type { PracticeHandScenario, Card, Position, ActionType, Difficulty, VillainType, Rank, Suit } from '@/types'

interface ChapterHandInput {
  chapterId: number
  title: string
  conceptIds: string[]
  /** Scenario templates specific to this chapter */
  scenarios: ScenarioTemplate[]
}

interface ScenarioTemplate {
  titleTemplate: string
  descriptionTemplate: string
  street: 'preflop' | 'flop' | 'turn' | 'river'
  heroPositions: Position[]
  villainPositions: Position[]
  villainTypes: VillainType[]
  handCategories: HandCategory[]
  boardPatterns?: BoardPattern[]
  priorActionTemplate: string
  correctAction: ActionType
  correctSizing?: number
  alternativeActions?: { action: ActionType; quality: 'acceptable' | 'suboptimal' | 'bad' }[]
  explanationTemplate: string
  factors: string[]
  difficulty: Difficulty
  replayVariant?: {
    description: string
    change: string
  }
}

type HandCategory = 'premium-pair' | 'medium-pair' | 'small-pair' | 'big-broadway-suited' | 'big-broadway-offsuit' |
  'suited-connector' | 'suited-gapper' | 'suited-ace' | 'weak-broadway' | 'trash' |
  'top-pair' | 'overpair' | 'middle-pair' | 'draw' | 'air'

interface BoardPattern {
  type: 'dry-high' | 'dry-low' | 'wet' | 'monotone' | 'paired' | 'broadway' | 'low-connected' | 'ace-high'
}

// Deterministic seeded random
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function pickRandom<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

const RANKS: readonly Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const SUITS: readonly Suit[] = ['s', 'h', 'd', 'c']

function makeCard(rank: Rank, suit: Suit): Card { return { rank, suit } }

function generateHand(category: HandCategory, rng: () => number): [Card, Card] {
  const s1 = pickRandom(SUITS, rng)
  const s2 = pickRandom(SUITS.filter(s => s !== s1), rng)

  switch (category) {
    case 'premium-pair': {
      const r = pickRandom(['A', 'K', 'Q', 'J'] as Rank[], rng)
      return [makeCard(r, s1), makeCard(r, s2)]
    }
    case 'medium-pair': {
      const r = pickRandom(['T', '9', '8', '7'] as Rank[], rng)
      return [makeCard(r, s1), makeCard(r, s2)]
    }
    case 'small-pair': {
      const r = pickRandom(['6', '5', '4', '3', '2'] as Rank[], rng)
      return [makeCard(r, s1), makeCard(r, s2)]
    }
    case 'big-broadway-suited': {
      const r1 = pickRandom(['A', 'K', 'Q'] as Rank[], rng)
      const pool = (['A', 'K', 'Q', 'J', 'T'] as Rank[]).filter(r => r !== r1)
      const r2 = pickRandom(pool, rng)
      return [makeCard(r1, s1), makeCard(r2, s1)] // same suit
    }
    case 'big-broadway-offsuit': {
      const r1 = pickRandom(['A', 'K', 'Q'] as Rank[], rng)
      const pool = (['A', 'K', 'Q', 'J', 'T'] as Rank[]).filter(r => r !== r1)
      const r2 = pickRandom(pool, rng)
      return [makeCard(r1, s1), makeCard(r2, s2)]
    }
    case 'suited-connector': {
      const starts = ['J', 'T', '9', '8', '7', '6', '5'] as Rank[]
      const r1 = pickRandom(starts, rng)
      const r1Idx = RANKS.indexOf(r1)
      const r2 = RANKS[r1Idx + 1]
      return [makeCard(r1, s1), makeCard(r2, s1)]
    }
    case 'suited-gapper': {
      const starts = ['J', 'T', '9', '8', '7', '6'] as Rank[]
      const r1 = pickRandom(starts, rng)
      const r1Idx = RANKS.indexOf(r1)
      const r2 = RANKS[r1Idx + 2]
      return [makeCard(r1, s1), makeCard(r2, s1)]
    }
    case 'suited-ace': {
      const r2 = pickRandom(['5', '4', '3', '2', '8', '7', '6'] as Rank[], rng)
      return [makeCard('A', s1), makeCard(r2, s1)]
    }
    case 'weak-broadway': {
      const r1 = pickRandom(['K', 'Q', 'J'] as Rank[], rng)
      const r2 = pickRandom(['T', '9', '8'] as Rank[], rng)
      return [makeCard(r1, s1), makeCard(r2, s2)]
    }
    case 'trash': {
      const r1 = pickRandom(['9', '8', '7'] as Rank[], rng)
      const r2 = pickRandom(['4', '3', '2'] as Rank[], rng)
      return [makeCard(r1, s1), makeCard(r2, s2)]
    }
    // Postflop hand categories — generate hands that plausibly make these holdings
    case 'top-pair': {
      // Strong top pair hands: high card + decent kicker
      const r1 = pickRandom(['A', 'K', 'Q'] as Rank[], rng)
      const r2 = pickRandom(['K', 'Q', 'J', 'T', '9'] as Rank[], rng)
      if (r1 === r2) return [makeCard(r1, s1), makeCard('J', s2)]
      return [makeCard(r1, s1), makeCard(r2, s2)]
    }
    case 'overpair': {
      // Pocket pairs that overpair most boards
      const r = pickRandom(['A', 'K', 'Q', 'J'] as Rank[], rng)
      return [makeCard(r, s1), makeCard(r, s2)]
    }
    case 'middle-pair': {
      // Mid-strength hands that make middle or bottom pair on many boards
      const r1 = pickRandom(['J', 'T', '9', '8'] as Rank[], rng)
      const r2 = pickRandom(['9', '8', '7', '6'] as Rank[], rng)
      if (r1 === r2) return [makeCard(r1, s1), makeCard('5', s2)]
      return [makeCard(r1, s1), makeCard(r2, s2)]
    }
    case 'draw': {
      // Suited connectors / suited gappers that make draws
      const starts = ['J', 'T', '9', '8', '7', '6'] as Rank[]
      const r1 = pickRandom(starts, rng)
      const r1Idx = RANKS.indexOf(r1)
      const gap = pickRandom([1, 2], rng)
      const r2 = RANKS[Math.min(r1Idx + gap, RANKS.length - 1)]
      return [makeCard(r1, s1), makeCard(r2, s1)] // suited for flush draws
    }
    case 'air': {
      // Missed hands: low unconnected offsuit cards
      const r1 = pickRandom(['T', '9', '8', '7'] as Rank[], rng)
      const r2 = pickRandom(['5', '4', '3', '2'] as Rank[], rng)
      return [makeCard(r1, s1), makeCard(r2, s2)]
    }
    default:
      return [makeCard('A', s1), makeCard('K', s2)]
  }
}

function generateBoard(pattern: BoardPattern | undefined, heroCards: [Card, Card], rng: () => number): Card[] {
  if (!pattern) return []

  const usedKeys = new Set([`${heroCards[0].rank}${heroCards[0].suit}`, `${heroCards[1].rank}${heroCards[1].suit}`])

  function pickCard(rankPool: readonly Rank[], suitPool: readonly Suit[]): Card {
    for (let attempt = 0; attempt < 50; attempt++) {
      const r = pickRandom(rankPool, rng)
      const s = pickRandom(suitPool, rng)
      const key = `${r}${s}`
      if (!usedKeys.has(key)) {
        usedKeys.add(key)
        return makeCard(r, s)
      }
    }
    // Fallback
    for (const r of rankPool) {
      for (const s of suitPool) {
        const key = `${r}${s}`
        if (!usedKeys.has(key)) {
          usedKeys.add(key)
          return makeCard(r, s)
        }
      }
    }
    return makeCard('2', 'c')
  }

  switch (pattern.type) {
    case 'dry-high':
      return [
        pickCard(['A', 'K', 'Q'] as Rank[], SUITS),
        pickCard(['7', '6', '5', '4', '3'] as Rank[], SUITS),
        pickCard(['2', '3', '4'] as Rank[], SUITS),
      ]
    case 'dry-low':
      return [
        pickCard(['8', '7', '6'] as Rank[], SUITS),
        pickCard(['4', '3'] as Rank[], SUITS),
        pickCard(['2'] as Rank[], SUITS),
      ]
    case 'wet': {
      const baseSuit = pickRandom(SUITS, rng)
      return [
        pickCard(['9', 'T', 'J'] as Rank[], [baseSuit]),
        pickCard(['8', '9', 'T'] as Rank[], [baseSuit]),
        pickCard(['7', '6', '5'] as Rank[], SUITS),
      ]
    }
    case 'monotone': {
      const flushSuit = pickRandom(SUITS, rng)
      return [
        pickCard(['K', 'Q', 'J', 'T'] as Rank[], [flushSuit]),
        pickCard(['8', '7', '6', '5'] as Rank[], [flushSuit]),
        pickCard(['4', '3', '2'] as Rank[], [flushSuit]),
      ]
    }
    case 'paired':
      const pairRank = pickRandom(['7', '8', '9', 'T'] as Rank[], rng)
      return [
        pickCard([pairRank], SUITS),
        pickCard([pairRank], SUITS),
        pickCard(['2', '3', '4', '5'] as Rank[], SUITS),
      ]
    case 'broadway':
      return [
        pickCard(['A', 'K'] as Rank[], SUITS),
        pickCard(['Q', 'J'] as Rank[], SUITS),
        pickCard(['T', '9'] as Rank[], SUITS),
      ]
    case 'low-connected':
      return [
        pickCard(['7', '6'] as Rank[], SUITS),
        pickCard(['5', '4'] as Rank[], SUITS),
        pickCard(['3', '2'] as Rank[], SUITS),
      ]
    case 'ace-high':
      return [
        pickCard(['A'] as Rank[], SUITS),
        pickCard(['8', '7', '6', '5'] as Rank[], SUITS),
        pickCard(['3', '2', '4'] as Rank[], SUITS),
      ]
    default:
      return []
  }
}

function formatCard(c: Card): string {
  const suitMap: Record<Suit, string> = { s: '\u2660', h: '\u2665', d: '\u2666', c: '\u2663' }
  return `${c.rank}${suitMap[c.suit]}`
}

/**
 * Generate 200 practice hands for a chapter
 */
export function generateChapterHands(input: ChapterHandInput): PracticeHandScenario[] {
  const { chapterId, scenarios } = input
  const rng = seededRandom(chapterId * 6271 + 83497)
  const hands: PracticeHandScenario[] = []
  let idx = 1

  // Cycle through scenarios, generating variations
  while (hands.length < 200) {
    for (const template of scenarios) {
      if (hands.length >= 200) break

      const heroPos = pickRandom(template.heroPositions, rng)
      const villainPos = pickRandom(template.villainPositions, rng)
      const villainType = pickRandom(template.villainTypes, rng)
      const handCat = pickRandom(template.handCategories, rng)
      const heroCards = generateHand(handCat, rng)
      const boardPattern = template.boardPatterns ? pickRandom(template.boardPatterns, rng) : undefined
      const board = generateBoard(boardPattern, heroCards, rng)
      // Pot size and stacks based on street context
      let potSize: number
      let heroStack: number
      let villainStack: number

      if (template.street === 'preflop') {
        // Unopened pot = just blinds (1.5bb)
        potSize = 1.5
        heroStack = 100
        villainStack = 100
      } else {
        // Postflop: scale pot by street to be realistic
        const streetMultiplier: Record<string, number> = { flop: 1, turn: 2, river: 3 }
        const mult = streetMultiplier[template.street] ?? 1
        potSize = Math.round((5 + rng() * 8) * mult * 10) / 10
        heroStack = 100
        villainStack = 100
      }

      const handStr = `${formatCard(heroCards[0])} ${formatCard(heroCards[1])}`
      const boardStr = board.map(formatCard).join(' ')

      const titleText = template.titleTemplate
        .replace('{hand}', handStr)
        .replace('{heroPos}', heroPos)
        .replace('{villainPos}', villainPos)

      const descText = template.descriptionTemplate
        .replace('{hand}', handStr)
        .replace('{heroPos}', heroPos)
        .replace('{villainPos}', villainPos)
        .replace('{villainType}', villainType.replace('-', ' '))
        .replace('{board}', boardStr)
        .replace('{potSize}', String(potSize))

      const priorText = template.priorActionTemplate
        .replace('{villainPos}', villainPos)
        .replace('{heroPos}', heroPos)
        .replace('{potSize}', String(potSize))

      const explainText = template.explanationTemplate
        .replace('{hand}', handStr)
        .replace('{heroPos}', heroPos)
        .replace('{villainPos}', villainPos)
        .replace('{villainType}', villainType.replace('-', ' '))

      hands.push({
        id: `ph-${chapterId}-${String(idx).padStart(3, '0')}`,
        chapterId,
        conceptIds: input.conceptIds,
        difficulty: template.difficulty,
        title: titleText,
        description: descText,
        heroPosition: heroPos,
        heroCards: heroCards,
        villainPosition: villainPos,
        villainType: villainType,
        board: board,
        potSize,
        heroStack,
        villainStack,
        street: template.street,
        priorAction: priorText,
        correctAction: template.correctAction,
        correctSizing: template.correctSizing,
        alternativeActions: template.alternativeActions,
        explanation: explainText,
        factors: template.factors,
        replayVariant: template.replayVariant,
      })
      idx++
    }
  }

  return hands.slice(0, 200)
}
