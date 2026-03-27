import type { Position, ActionClass } from '@/types'

// ---------------------------------------------------------------------------
// 1. All 169 distinct starting hands in standard notation
// ---------------------------------------------------------------------------

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const

/** All 169 canonical starting hands: pairs, suited combos, offsuit combos. */
export const allHands: string[] = (() => {
  const hands: string[] = []
  for (let i = 0; i < RANKS.length; i++) {
    for (let j = i; j < RANKS.length; j++) {
      if (i === j) {
        hands.push(`${RANKS[i]}${RANKS[j]}`)
      } else {
        hands.push(`${RANKS[i]}${RANKS[j]}s`)
        hands.push(`${RANKS[i]}${RANKS[j]}o`)
      }
    }
  }
  return hands
})()

// ---------------------------------------------------------------------------
// 2. Hand strength ratings (1-100)
// ---------------------------------------------------------------------------

export const handStrength: Record<string, number> = {
  // Pocket pairs
  AA: 100, KK: 98, QQ: 96, JJ: 93, TT: 89,
  '99': 85, '88': 81, '77': 77, '66': 72, '55': 68,
  '44': 64, '33': 60, '22': 56,

  // Suited Aces
  AKs: 97, AQs: 94, AJs: 91, ATs: 88, A9s: 79,
  A8s: 76, A7s: 74, A6s: 72, A5s: 73, A4s: 70,
  A3s: 68, A2s: 66,

  // Offsuit Aces
  AKo: 95, AQo: 91, AJo: 87, ATo: 82, A9o: 71,
  A8o: 67, A7o: 64, A6o: 61, A5o: 62, A4o: 59,
  A3o: 57, A2o: 55,

  // Suited Kings
  KQs: 90, KJs: 86, KTs: 83, K9s: 75, K8s: 69,
  K7s: 66, K6s: 64, K5s: 62, K4s: 59, K3s: 57,
  K2s: 55,

  // Offsuit Kings
  KQo: 86, KJo: 80, KTo: 76, K9o: 65, K8o: 58,
  K7o: 55, K6o: 52, K5o: 49, K4o: 47, K3o: 45,
  K2o: 43,

  // Suited Queens
  QJs: 84, QTs: 80, Q9s: 72, Q8s: 65, Q7s: 60,
  Q6s: 58, Q5s: 55, Q4s: 53, Q3s: 51, Q2s: 49,

  // Offsuit Queens
  QJo: 78, QTo: 73, Q9o: 61, Q8o: 53, Q7o: 49,
  Q6o: 46, Q5o: 44, Q4o: 42, Q3o: 40, Q2o: 38,

  // Suited Jacks
  JTs: 82, J9s: 73, J8s: 66, J7s: 60, J6s: 55,
  J5s: 52, J4s: 49, J3s: 47, J2s: 45,

  // Offsuit Jacks
  JTo: 75, J9o: 62, J8o: 54, J7o: 48, J6o: 44,
  J5o: 41, J4o: 39, J3o: 37, J2o: 35,

  // Suited Tens
  T9s: 78, T8s: 70, T7s: 62, T6s: 56, T5s: 50,
  T4s: 47, T3s: 45, T2s: 43,

  // Offsuit Tens
  T9o: 68, T8o: 58, T7o: 50, T6o: 44, T5o: 40,
  T4o: 37, T3o: 35, T2o: 33,

  // Suited Nines
  '98s': 74, '97s': 65, '96s': 58, '95s': 51, '94s': 46,
  '93s': 43, '92s': 41,

  // Offsuit Nines
  '98o': 63, '97o': 53, '96o': 46, '95o': 40, '94o': 36,
  '93o': 33, '92o': 31,

  // Suited Eights
  '87s': 71, '86s': 62, '85s': 54, '84s': 47, '83s': 42,
  '82s': 39,

  // Offsuit Eights
  '87o': 60, '86o': 50, '85o': 43, '84o': 37, '83o': 33,
  '82o': 30,

  // Suited Sevens
  '76s': 68, '75s': 60, '74s': 52, '73s': 45, '72s': 40,

  // Offsuit Sevens
  '76o': 57, '75o': 48, '74o': 41, '73o': 35, '72o': 31,

  // Suited Sixes
  '65s': 65, '64s': 56, '63s': 49, '62s': 43,

  // Offsuit Sixes
  '65o': 54, '64o': 45, '63o': 39, '62o': 34,

  // Suited Fives
  '54s': 63, '53s': 54, '52s': 47,

  // Offsuit Fives
  '54o': 51, '53o': 43, '52o': 37,

  // Suited Fours
  '43s': 52, '42s': 45,

  // Offsuit Fours
  '43o': 41, '42o': 35,

  // Suited Threes
  '32s': 44,

  // Offsuit Threes
  '32o': 33,
}

// ---------------------------------------------------------------------------
// 3. Opening ranges by position
// ---------------------------------------------------------------------------

/** Hands that are always an open in a given position. */
const UTG_OPENS: string[] = [
  'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66',
  'AKs', 'AQs', 'AJs', 'ATs', 'A5s',
  'AKo', 'AQo', 'AJo', 'KQo',
  'KQs', 'KJs', 'KTs',
  'QJs',
  'JTs',
  'T9s',
]

const UTG_MARGINAL: string[] = ['55', 'A9s', 'QTs', '98s']

const HJ_OPENS: string[] = [
  ...UTG_OPENS,
  '55',
  'A9s', 'A8s', 'A4s', 'A3s', 'A2s',
  'QTs', 'J9s', 'T8s', '98s',
  'ATo', 'KJo', 'QJo',
]

const HJ_MARGINAL: string[] = ['44', 'A7s', 'A6s', 'K9s', 'Q9s', '97s', '87s', 'KTo']

const CO_OPENS: string[] = [
  ...HJ_OPENS,
  '44', '33', '22',
  'A7s', 'A6s', 'A5s',
  'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s',
  'Q9s', 'Q8s', 'Q7s', 'Q6s', 'J8s',
  'T7s', '97s', '87s',
  'KTo', 'JTo',
  'A9o', 'A8o',
]

const CO_MARGINAL: string[] = [
  'J7s',
  'QTo', 'K9o',
]

const BU_OPENS: string[] = [
  ...CO_OPENS,
  'K2s',
  'Q5s',
  'J7s', 'J6s', 'J5s',
  'T6s',
  '96s', '86s', '76s', '75s', '65s', '64s', '54s',
  'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',
  'K9o', 'QTo', 'Q9o', 'J9o', 'T9o',
]

const BU_MARGINAL: string[] = [
  'Q4s', 'Q3s', 'J4s',
  'K8o', 'K7o', 'K6o', 'Q8o', 'J8o', 'T8o', '98o',
]

const SB_OPENS: string[] = [
  // Pairs
  'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '22',
  // Suited Aces & Kings — all
  'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
  'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
  // Suited Queens & Jacks
  'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s',
  'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s',
  // Suited connectors & gappers
  'T9s', 'T8s', 'T7s', 'T6s',
  '98s', '97s', '96s',
  '87s', '86s',
  '76s', '75s',
  '65s', '64s',
  '54s',
  // Offsuit
  'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o',
  'KQo', 'KJo', 'KTo',
  'QJo', 'QTo',
  'JTo',
  'T9o', 'T8o',
]

const SB_MARGINAL: string[] = [
  '33',
  'Q4s', 'Q3s', 'Q2s',
  'J4s', 'J3s',
  'A8o', 'A2o',
  'K9o', 'K8o', 'K7o',
  'Q9o', 'Q8o',
  'J9o', 'J8o',
  '98o', '87o',
]

function buildPositionRange(
  opens: string[],
  marginals: string[],
): Record<string, ActionClass> {
  const range: Record<string, ActionClass> = {}
  for (const h of allHands) {
    if (opens.includes(h)) {
      range[h] = 'open'
    } else if (marginals.includes(h)) {
      range[h] = 'marginal-open'
    } else {
      range[h] = 'fold'
    }
  }
  return range
}

export const openingRanges: Record<Position, Record<string, ActionClass>> = {
  UTG: buildPositionRange(UTG_OPENS, UTG_MARGINAL),
  HJ: buildPositionRange(HJ_OPENS, HJ_MARGINAL),
  CO: buildPositionRange(CO_OPENS, CO_MARGINAL),
  BU: buildPositionRange(BU_OPENS, BU_MARGINAL),
  SB: buildPositionRange(SB_OPENS, SB_MARGINAL),
  BB: buildPositionRange([], []), // BB doesn't open — handled via facing-open logic
}

// ---------------------------------------------------------------------------
// 4. Facing 3-bet ranges
// ---------------------------------------------------------------------------

/**
 * When WE opened from a position and face a 3-bet, how should we respond?
 * `value`  = 4-bet for value / call happily
 * `bluff`  = 4-bet as a bluff (fold to 5-bet)
 * `call`   = call the 3-bet
 * Everything else is a fold.
 */
export const facing3BetRanges: Record<
  Position,
  { value: string[]; bluff: string[]; call: string[] }
> = {
  UTG: {
    value: ['AA', 'KK', 'AKs'],
    bluff: ['A5s', 'A4s'],
    call: ['QQ', 'JJ', 'TT', 'AKo', 'AQs'],
  },
  HJ: {
    value: ['AA', 'KK', 'AKs'],
    bluff: ['A5s', 'A4s', 'A3s'],
    call: ['QQ', 'JJ', 'TT', 'AKo', 'AQs', 'AJs'],
  },
  CO: {
    value: ['AA', 'KK', 'QQ', 'AKs'],
    bluff: ['A5s', 'A4s', 'A3s', 'A2s'],
    call: ['JJ', 'TT', '99', 'AKo', 'AQs', 'AQo', 'AJs', 'KQs'],
  },
  BU: {
    value: ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    bluff: ['A5s', 'A4s', 'A3s', 'A2s', 'K5s', 'K4s'],
    call: [
      'JJ', 'TT', '99', '88', '77',
      'AQs', 'AQo', 'AJs', 'ATs',
      'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s', '87s', '76s',
    ],
  },
  SB: {
    value: ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    bluff: ['A5s', 'A4s', 'A3s', 'A2s'],
    call: [
      'JJ', 'TT', '99',
      'AQs', 'AQo', 'AJs', 'ATs',
      'KQs', 'KJs', 'QJs', 'JTs', 'T9s',
    ],
  },
  BB: {
    value: ['AA', 'KK', 'QQ', 'AKs'],
    bluff: ['A5s', 'A4s', 'A3s'],
    call: ['JJ', 'TT', '99', 'AKo', 'AQs', 'AJs', 'KQs'],
  },
}

// ---------------------------------------------------------------------------
// 5. BB defense vs. open (calling and 3-betting ranges)
// ---------------------------------------------------------------------------

const BB_3BET_VALUE = [
  'AA', 'KK', 'QQ', 'AKs', 'AKo',
]

const BB_3BET_BLUFF = [
  'A5s', 'A4s', 'A3s', 'A2s',
  'K5s', 'K4s',
  '76s', '65s', '54s',
]

const BB_CALL_VS_EP = [
  'JJ', 'TT', '99', '88', '77', '66', '55',
  'AQs', 'AQo', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s',
  'KQs', 'KQo', 'KJs', 'KTs', 'K9s',
  'QJs', 'QTs', 'Q9s',
  'JTs', 'J9s',
  'T9s', 'T8s',
  '98s', '97s',
  '87s', '86s',
  '76s', '75s',
  '65s', '64s',
  '54s', '53s',
  '43s',
]

const BB_CALL_VS_BU = [
  ...BB_CALL_VS_EP,
  '44', '33', '22',
  'A4s', 'A3s', 'A2s',
  'K8s', 'K7s', 'K6s', 'K5s', 'K4s',
  'Q8s', 'Q7s',
  'J8s', 'J7s',
  'T7s',
  '96s',
  '85s',
  '74s',
  '63s',
  '52s',
  '42s',
  'AJo', 'ATo', 'A9o',
  'KQo', 'KJo', 'KTo',
  'QJo', 'QTo',
  'JTo', 'J9o',
  'T9o',
  '98o',
]

// ---------------------------------------------------------------------------
// 6. getHandActionClass helper
// ---------------------------------------------------------------------------

/**
 * Returns the recommended preflop action classification for a hand.
 *
 * If only `heroPosition` is supplied, assumes an unopened pot (RFI decision).
 * If `villainPosition` is supplied, we treat it as hero in BB facing an open
 * from that position (or hero facing a 3-bet after opening from heroPosition).
 */
export function getHandActionClass(
  hand: string,
  heroPosition: Position,
  villainPosition?: Position,
  _villainType?: string,
): ActionClass {
  // --- Facing a 3-bet after we opened ---
  if (villainPosition && heroPosition !== 'BB') {
    const ranges = facing3BetRanges[heroPosition]
    if (ranges.value.includes(hand)) return '3bet-value'
    if (ranges.bluff.includes(hand)) return '3bet-bluff'
    if (ranges.call.includes(hand)) return 'call'
    return 'fold'
  }

  // --- BB facing an open ---
  if (heroPosition === 'BB' && villainPosition) {
    if (BB_3BET_VALUE.includes(hand)) return '3bet-value'
    if (BB_3BET_BLUFF.includes(hand)) return '3bet-bluff'

    const callRange =
      villainPosition === 'BU' || villainPosition === 'SB'
        ? BB_CALL_VS_BU
        : BB_CALL_VS_EP

    if (callRange.includes(hand)) return 'call'
    return 'fold'
  }

  // --- RFI (unopened pot) ---
  const posRange = openingRanges[heroPosition]
  if (!posRange) return 'fold'
  return posRange[hand] ?? 'fold'
}

// ---------------------------------------------------------------------------
// 7. getHandExplanation helper
// ---------------------------------------------------------------------------

const POSITION_LABELS: Record<Position, string> = {
  UTG: 'Under the Gun (UTG)',
  HJ: 'Hijack (HJ)',
  CO: 'Cutoff (CO)',
  BU: 'Button (BU)',
  SB: 'Small Blind (SB)',
  BB: 'Big Blind (BB)',
}

function isPair(hand: string): boolean {
  return hand.length === 2 && hand[0] === hand[1]
}

function isSuited(hand: string): boolean {
  return hand.endsWith('s')
}

function isBroadway(hand: string): boolean {
  const broadways = ['A', 'K', 'Q', 'J', 'T']
  return broadways.includes(hand[0]) && broadways.includes(hand[1])
}

function isSuitedConnector(hand: string): boolean {
  if (!isSuited(hand)) return false
  const r1 = RANKS.indexOf(hand[0] as typeof RANKS[number])
  const r2 = RANKS.indexOf(hand[1] as typeof RANKS[number])
  return Math.abs(r1 - r2) === 1
}

function isSuitedGapper(hand: string): boolean {
  if (!isSuited(hand)) return false
  const r1 = RANKS.indexOf(hand[0] as typeof RANKS[number])
  const r2 = RANKS.indexOf(hand[1] as typeof RANKS[number])
  return Math.abs(r1 - r2) === 2
}

function hasAce(hand: string): boolean {
  return hand[0] === 'A'
}

/**
 * Returns an educational explanation for why a hand receives a given
 * classification from a given position. Useful for training / tooltips.
 */
export function getHandExplanation(
  hand: string,
  heroPosition: Position,
  actionClass: ActionClass,
): string {
  const posLabel = POSITION_LABELS[heroPosition]
  const strength = handStrength[hand] ?? 0

  // --- Premium / value 3-bets ---
  if (actionClass === '3bet-value') {
    return (
      `${hand} is a premium holding (strength ${strength}/100) that you should 3-bet for value ` +
      `from ${posLabel}. You want to build the pot with this hand because it plays well ` +
      `against your opponent's continuing range and has strong equity when called.`
    )
  }

  if (actionClass === '3bet-bluff') {
    const blockerNote = hasAce(hand)
      ? ' It contains an Ace blocker, reducing the likelihood that your opponent holds premium hands like AA or AK.'
      : isSuited(hand)
        ? ' Being suited gives it some post-flop equity when called, making it a better bluff candidate than a random hand.'
        : ''
    return (
      `${hand} works well as a 3-bet bluff from ${posLabel}.${blockerNote} ` +
      `By 3-betting this hand you balance your value 3-bets and apply pressure, ` +
      `generating fold equity against hands that opened but cannot continue.`
    )
  }

  if (actionClass === 'call') {
    const suitedNote = isSuited(hand)
      ? ' Being suited adds equity through flush possibilities, making it profitable to continue.'
      : ''
    const pairNote = isPair(hand)
      ? ' Pocket pairs have great implied odds when you flop a set, making them profitable calls.'
      : ''
    return (
      `${hand} from ${posLabel} is strong enough to continue but not strong enough to raise. ` +
      `Calling keeps in the weaker parts of your opponent's range and controls the pot size.` +
      `${suitedNote}${pairNote}`
    )
  }

  // --- Opening ranges ---
  if (actionClass === 'open') {
    if (isPair(hand)) {
      if (strength >= 90) {
        return (
          `${hand} is a premium pocket pair that is a mandatory open from every position. ` +
          `From ${posLabel}, you should raise to build the pot with one of the strongest ` +
          `hands in poker.`
        )
      }
      return (
        `${hand} is a pocket pair that is profitable to open from ${posLabel}. ` +
        `Pocket pairs have excellent implied odds when you flop a set and decent equity ` +
        `as an overpair or middle pair on many boards.`
      )
    }

    if (isBroadway(hand)) {
      const suitNote = isSuited(hand)
        ? 'The suited component adds flush and backdoor flush equity, increasing post-flop playability.'
        : 'While offsuit, the high-card strength makes this hand profitable to open.'
      return (
        `${hand} is a strong broadway hand that is a standard open from ${posLabel}. ` +
        `${suitNote} It connects well with flops containing high cards and can make ` +
        `strong top-pair hands.`
      )
    }

    if (isSuitedConnector(hand)) {
      return (
        `${hand} is a suited connector, one of the best speculative hands to open from ${posLabel}. ` +
        `It can make straights, flushes, and strong draws. These hands play well in position ` +
        `and add balance to your range so you're not only opening big-card hands.`
      )
    }

    if (isSuitedGapper(hand)) {
      return (
        `${hand} is a suited one-gapper that is worth opening from ${posLabel}. ` +
        `While slightly weaker than a suited connector, it still has good straight and flush ` +
        `potential. Opening these hands keeps your range balanced and hard to play against.`
      )
    }

    if (hasAce(hand) && isSuited(hand)) {
      return (
        `${hand} is a suited Ace that is profitable to open from ${posLabel}. ` +
        `Suited Aces have the nut-flush potential, strong backdoor equity, and decent ` +
        `high-card value. They perform especially well when they flop a flush draw or ` +
        `two pair / trips with the kicker.`
      )
    }

    return (
      `${hand} (strength ${strength}/100) is within the standard opening range for ` +
      `${posLabel}. It has sufficient equity and playability to open-raise profitably ` +
      `from this position at a typical 6-max table.`
    )
  }

  if (actionClass === 'marginal-open') {
    return (
      `${hand} is on the fringe of the opening range from ${posLabel}. ` +
      `In a standard game you can include it, but it becomes more clearly profitable ` +
      `against passive opponents who over-fold to steals. Against tough, 3-bet-heavy ` +
      `opponents you may prefer to fold this hand from ${posLabel}.`
    )
  }

  if (actionClass === 'exploit-open') {
    return (
      `${hand} is not part of the default opening range from ${posLabel}, but can ` +
      `be added as an exploitative open when conditions are favorable -- for example ` +
      `when the remaining players are tight and passive, or when the blinds rarely defend.`
    )
  }

  // --- Fold ---
  if (heroPosition === 'BB') {
    return (
      `${hand} is too weak to defend from the Big Blind in this situation. ` +
      `Even though you close the action and get a good price, the combination of ` +
      `being out of position and having insufficient equity makes folding correct.`
    )
  }

  const positionContext =
    heroPosition === 'UTG' || heroPosition === 'HJ'
      ? 'From early position, you need a strong hand to open because many players remain to act behind you who could wake up with a premium holding.'
      : heroPosition === 'CO'
        ? 'From the Cutoff you can open wider than EP, but this hand still lacks the equity or playability needed.'
        : heroPosition === 'BU'
          ? 'Even on the Button where you can open very wide, this hand does not have enough equity or playability to be profitable.'
          : 'From the Small Blind you are out of position against the Big Blind, so you need a reasonable hand to open.'

  return (
    `${hand} (strength ${strength}/100) should be folded from ${posLabel}. ${positionContext}`
  )
}
