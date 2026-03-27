/**
 * Hand Review analysis engine.
 * Evaluates poker decisions against GTO principles street by street.
 */

import type { Position } from '@/types'
import { openingRanges, handStrength } from '@/data/preflop-ranges'
import { getHandNotation } from './range'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Street = 'preflop' | 'flop' | 'turn' | 'river'
export type ActionType = 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'all-in'

export interface HandAction {
  position: Position
  action: ActionType
  size?: number  // in bb
  isHero: boolean
}

export interface StreetData {
  street: Street
  board: number[]          // card ints for this street's new cards
  actions: HandAction[]
  potBefore: number        // pot at start of street in bb
  potAfter: number         // pot at end of street in bb
}

export interface HandData {
  // Setup
  gameType: 'cash' | 'tournament'
  stakes: string           // e.g., "0.50/1.00"
  effectiveStack: number   // in bb
  heroPosition: Position
  heroCards: [number, number]  // card ints

  // Streets
  streets: StreetData[]
}

export type VerdictLevel = 'excellent' | 'good' | 'acceptable' | 'inaccuracy' | 'mistake'

export interface StreetVerdict {
  street: Street
  heroAction: HandAction | null
  verdict: VerdictLevel
  headline: string         // short summary like "Preferred action is check here"
  preferredAction: string  // "Check" / "Bet 33%" etc.
  preferredFrequency: string  // "High frequency" / "Mixed" / "Always"
  sizingNote: string | null
  evNote: string           // "Lower EV than solver preference" etc.
  reasoning: string[]      // bullet points explaining why
  confidence: 'high' | 'mixed' | 'close'
}

export interface CoachingSummary {
  biggestDeviation: string
  bestPlayedStreet: string
  mainAdjustment: string
  studyDirection: string
  overallGrade: VerdictLevel
}

export interface HandReview {
  hand: HandData
  verdicts: StreetVerdict[]
  summary: CoachingSummary
  tags: string[]
}

// ---------------------------------------------------------------------------
// Preflop Analysis
// ---------------------------------------------------------------------------

function getHandNotationFromCards(c1: number, c2: number): string {
  return getHandNotation(c1, c2)
}

function analyzePreflopAction(hand: HandData): StreetVerdict {
  const preflopStreet = hand.streets.find(s => s.street === 'preflop')
  if (!preflopStreet) {
    return makeEmptyVerdict('preflop')
  }

  const heroAction = preflopStreet.actions.find(a => a.isHero)
  if (!heroAction) return makeEmptyVerdict('preflop')

  const notation = getHandNotationFromCards(hand.heroCards[0], hand.heroCards[1])
  const strength = handStrength[notation] ?? 50
  const posRange = openingRanges[hand.heroPosition]
  const actionClass = posRange?.[notation]

  // Determine what happened before hero
  const heroIdx = preflopStreet.actions.indexOf(heroAction)
  const priorActions = preflopStreet.actions.slice(0, heroIdx)
  const hasRaise = priorActions.some(a => a.action === 'raise' || a.action === 'bet')
  const hasMultipleRaises = priorActions.filter(a => a.action === 'raise').length >= 2

  // Analyze based on context
  const reasoning: string[] = []
  let verdict: VerdictLevel = 'good'
  let headline = ''
  let preferredAction = ''
  let preferredFrequency = 'High frequency'
  let sizingNote: string | null = null
  let evNote = ''
  let confidence: 'high' | 'mixed' | 'close' = 'high'

  if (!hasRaise) {
    // RFI spot (raise first in) or limped pot
    if (heroAction.action === 'fold') {
      if (actionClass === 'open' || actionClass === 'marginal-open') {
        verdict = 'mistake'
        headline = 'This hand should be opened from this position.'
        preferredAction = `Raise ${hand.heroPosition === 'SB' ? '3' : '2.5'}x`
        evNote = 'Folding a profitable open loses expected value.'
        reasoning.push(
          `${notation} is in the ${hand.heroPosition} opening range.`,
          `Hand strength rating: ${strength}/100.`,
          `Opening ranges are designed to be profitable — folding surrenders this edge.`,
        )
      } else {
        verdict = 'excellent'
        headline = 'Correct fold. This hand is not in your opening range.'
        preferredAction = 'Fold'
        evNote = 'This matches solver preference.'
        reasoning.push(
          `${notation} is below the ${hand.heroPosition} opening threshold.`,
          `Discipline in folding marginal hands prevents chip leakage.`,
        )
      }
    } else if (heroAction.action === 'raise' || heroAction.action === 'bet') {
      if (actionClass === 'open' || actionClass === 'marginal-open') {
        verdict = actionClass === 'open' ? 'excellent' : 'good'
        headline = actionClass === 'open'
          ? 'Standard open. This is a core part of your range.'
          : 'Playable open, but this hand is on the margin.'
        preferredAction = `Raise ${hand.heroPosition === 'SB' ? '3' : '2.5'}x`
        evNote = actionClass === 'open'
          ? 'This matches solver preference.'
          : 'Acceptable at low frequency. Slightly +EV but thin.'
        confidence = actionClass === 'open' ? 'high' : 'close'

        // Check sizing
        const expectedSize = hand.heroPosition === 'SB' ? 3 : 2.5
        if (heroAction.size && Math.abs(heroAction.size - expectedSize) > 0.5) {
          sizingNote = `Standard open size from ${hand.heroPosition} is ${expectedSize}x. Your sizing of ${heroAction.size}x is ${heroAction.size > expectedSize ? 'larger' : 'smaller'} than standard.`
        }

        reasoning.push(
          `${notation} is ${actionClass === 'open' ? 'a standard open' : 'a marginal open'} from ${hand.heroPosition}.`,
          `Position: ${getPositionDescription(hand.heroPosition)}.`,
        )
      } else {
        verdict = 'mistake'
        headline = 'This hand should not be opened from this position.'
        preferredAction = 'Fold'
        evNote = 'Opening too wide from this position is -EV long-term.'
        reasoning.push(
          `${notation} is not in the ${hand.heroPosition} opening range.`,
          `Opening weak hands from early position faces too many players behind.`,
          `Hand strength rating: ${strength}/100 — below the ${hand.heroPosition} threshold.`,
        )
      }
    } else if (heroAction.action === 'call') {
      verdict = 'inaccuracy'
      headline = 'Open-limping is not recommended in GTO strategy.'
      preferredAction = actionClass === 'open' ? 'Raise' : 'Fold'
      evNote = 'Limping forfeits initiative and allows blinds to realize equity cheaply.'
      reasoning.push(
        'GTO strategy rarely limps preflop outside of the small blind.',
        'Raising gives you initiative and can win the blinds uncontested.',
        actionClass === 'open'
          ? `${notation} should be raised, not limped.`
          : `${notation} should be folded from this position.`,
      )
    }
  } else if (hasRaise && !hasMultipleRaises) {
    // Facing a single raise (defending)
    const raiser = priorActions.find(a => a.action === 'raise' || a.action === 'bet')
    const raiserPos = raiser?.position ?? 'Unknown'

    if (heroAction.action === 'fold') {
      if (strength >= 85) {
        verdict = 'mistake'
        headline = 'This hand is too strong to fold facing a single raise.'
        preferredAction = 'Call or 3-bet'
        evNote = 'Folding premium hands surrenders significant EV.'
        reasoning.push(
          `${notation} has strength ${strength}/100 — well above the defending threshold.`,
          `Against a ${raiserPos} open, this hand has strong equity and playability.`,
        )
      } else if (strength >= 65) {
        verdict = 'acceptable'
        headline = 'Marginal fold. This hand has some defending merit.'
        preferredAction = 'Call'
        preferredFrequency = 'Mixed — depends on position and opponent'
        evNote = 'Close between calling and folding. Position matters.'
        confidence = 'close'
        reasoning.push(
          `${notation} is in the grey zone for defending vs ${raiserPos}.`,
          `Calling can be profitable with good postflop play and position.`,
        )
      } else {
        verdict = 'good'
        headline = 'Clean fold against the raise.'
        preferredAction = 'Fold'
        evNote = 'This matches solver preference.'
        reasoning.push(
          `${notation} doesn't have enough equity or playability to continue.`,
          `Folding weak hands to raises preserves your stack for better spots.`,
        )
      }
    } else if (heroAction.action === 'call') {
      if (strength >= 90) {
        verdict = 'acceptable'
        headline = 'Flatting is playable, but 3-betting is higher EV here.'
        preferredAction = '3-bet'
        preferredFrequency = 'Mixed — 3-bet at high frequency'
        evNote = 'Flatting premium hands underperforms 3-betting in most spots.'
        confidence = 'mixed'
        reasoning.push(
          `${notation} is strong enough to 3-bet for value.`,
          `3-betting builds the pot with a range advantage and gains initiative.`,
          `Flatting is acceptable but misses value.`,
        )
      } else if (strength >= 55) {
        verdict = 'good'
        headline = 'Solid call. Good hand to defend with.'
        preferredAction = 'Call'
        evNote = 'This matches solver preference.'
        reasoning.push(
          `${notation} has enough equity to continue vs a raise.`,
          `Calling keeps the pot manageable and preserves playability.`,
        )
      } else {
        verdict = 'inaccuracy'
        headline = 'This hand may be too weak to call here.'
        preferredAction = 'Fold'
        evNote = 'Calling with weak hands bleeds chips over time.'
        reasoning.push(
          `${notation} (strength ${strength}/100) is below the typical defending range.`,
          `Without strong equity or playability, folding is preferred.`,
        )
      }
    } else if (heroAction.action === 'raise') {
      if (strength >= 88) {
        verdict = 'excellent'
        headline = 'Strong 3-bet. This hand is a value 3-bet.'
        preferredAction = '3-bet'
        evNote = 'This matches solver preference.'
        reasoning.push(
          `${notation} is a premium 3-bet candidate.`,
          `3-betting for value builds the pot and narrows villain's range.`,
        )
      } else if (strength >= 70) {
        verdict = 'good'
        headline = 'Reasonable 3-bet. This hand has bluffing and semi-bluffing value.'
        preferredAction = '3-bet or Call'
        preferredFrequency = 'Mixed node'
        evNote = 'This is a solver-approved 3-bet candidate at some frequency.'
        confidence = 'mixed'
        reasoning.push(
          `${notation} works as a 3-bet bluff with blockers and playability.`,
          `3-betting also has fold equity against the opener's range.`,
        )
      } else {
        verdict = 'mistake'
        headline = 'This hand is too weak to 3-bet.'
        preferredAction = 'Fold'
        evNote = '3-betting weak hands without blockers or equity is -EV.'
        reasoning.push(
          `${notation} lacks the equity and blocker properties needed for a 3-bet.`,
          `When called, this hand will struggle to realize equity postflop.`,
        )
      }
    }
  } else {
    // Facing 3-bet or 4-bet
    if (heroAction.action === 'fold') {
      if (strength >= 93) {
        verdict = 'mistake'
        headline = 'Premium hands should not fold to 3-bets.'
        preferredAction = '4-bet or Call'
        evNote = 'Folding the top of your range is a major leak.'
        reasoning.push(
          `${notation} is one of the strongest hands in poker.`,
          `Against a 3-bet, this hand has dominant equity.`,
        )
      } else if (strength >= 80) {
        verdict = 'acceptable'
        headline = 'Folding is tight here. Consider calling.'
        preferredAction = 'Call'
        preferredFrequency = 'Mixed — position dependent'
        evNote = 'Close spot. Calling is slightly preferred.'
        confidence = 'close'
        reasoning.push(
          `${notation} has enough equity to continue against most 3-bet ranges.`,
        )
      } else {
        verdict = 'good'
        headline = 'Clean fold against aggression.'
        preferredAction = 'Fold'
        evNote = 'This matches solver preference.'
        reasoning.push(
          `${notation} doesn't have the equity to continue against a tight 3-bet range.`,
        )
      }
    } else if (heroAction.action === 'call') {
      if (strength >= 80) {
        verdict = 'good'
        headline = 'Solid call against the 3-bet.'
        preferredAction = 'Call'
        evNote = 'This matches solver preference.'
        reasoning.push(
          `${notation} has strong equity against a typical 3-bet range.`,
          `Calling controls pot size while maintaining equity realization.`,
        )
      } else {
        verdict = 'inaccuracy'
        headline = 'This hand may be too weak to call a 3-bet.'
        preferredAction = 'Fold'
        evNote = 'Calling 3-bets too wide is a common leak.'
        reasoning.push(
          `${notation} will struggle to realize its equity in a 3-bet pot.`,
          `Tighter 3-bet calling ranges are more profitable.`,
        )
      }
    } else {
      // 4-betting
      if (strength >= 93) {
        verdict = 'excellent'
        headline = 'Premium 4-bet. Perfectly played.'
        preferredAction = '4-bet'
        evNote = 'This matches solver preference.'
        reasoning.push(`${notation} is a clear value 4-bet.`)
      } else {
        verdict = 'acceptable'
        headline = '4-betting here is aggressive but can be profitable with the right range.'
        preferredAction = 'Fold or Call'
        preferredFrequency = 'Low frequency'
        evNote = 'This is only profitable against specific opponent tendencies.'
        confidence = 'close'
        reasoning.push(`${notation} as a 4-bet is high-variance and opponent-dependent.`)
      }
    }
  }

  return {
    street: 'preflop',
    heroAction,
    verdict,
    headline,
    preferredAction,
    preferredFrequency,
    sizingNote,
    evNote,
    reasoning,
    confidence,
  }
}

// ---------------------------------------------------------------------------
// Postflop Analysis
// ---------------------------------------------------------------------------

function analyzePostflopStreet(
  hand: HandData,
  streetData: StreetData,
): StreetVerdict {
  const heroAction = streetData.actions.find(a => a.isHero)
  if (!heroAction) return makeEmptyVerdict(streetData.street)

  const notation = getHandNotationFromCards(hand.heroCards[0], hand.heroCards[1])
  const strength = handStrength[notation] ?? 50

  // Determine context
  const heroIdx = streetData.actions.indexOf(heroAction)
  const priorActions = streetData.actions.slice(0, heroIdx)
  const facingBet = priorActions.some(a => a.action === 'bet' || a.action === 'raise')
  const spr = streetData.potBefore > 0 ? hand.effectiveStack / streetData.potBefore : Infinity

  // Board texture analysis
  const allBoardCards = hand.streets
    .filter(s => getStreetOrder(s.street) <= getStreetOrder(streetData.street))
    .flatMap(s => s.board)

  const boardTexture = analyzeBoardTexture(allBoardCards)
  const handBoardFit = evaluateHandBoardFit(hand.heroCards, allBoardCards, strength)

  const reasoning: string[] = []
  let verdict: VerdictLevel = 'good'
  let headline = ''
  let preferredAction = ''
  let preferredFrequency = 'High frequency'
  let sizingNote: string | null = null
  let evNote = ''
  let confidence: 'high' | 'mixed' | 'close' = 'high'

  if (!facingBet) {
    // In position or checked to — deciding whether to bet or check
    if (heroAction.action === 'check') {
      if (handBoardFit === 'strong') {
        // Strong hand checking — could be trapping or could be a mistake
        verdict = 'acceptable'
        headline = 'Checking with a strong hand. Consider betting for value.'
        preferredAction = `Bet ${boardTexture.wet ? '75%' : '33%'} pot`
        preferredFrequency = 'Mixed — betting is preferred at higher frequency'
        evNote = 'Checking strong hands can allow free cards that reduce your equity.'
        confidence = 'mixed'
        reasoning.push(
          `Your hand connects well with this board.`,
          `Betting extracts value from worse hands and denies equity.`,
          boardTexture.wet ? 'The wet board texture makes protection betting important.' : 'On this dry board, checking to trap is more viable.',
          spr < 4 ? `Low SPR (${spr.toFixed(1)}) favors getting chips in.` : '',
        )
      } else if (handBoardFit === 'medium') {
        verdict = 'good'
        headline = 'Reasonable check with a medium-strength hand.'
        preferredAction = 'Check'
        preferredFrequency = 'Mixed node'
        evNote = 'Medium hands often check to control pot size.'
        confidence = 'mixed'
        reasoning.push(
          'Medium-strength hands benefit from pot control.',
          'Checking avoids bloating the pot when behind and keeps bluff-catchers alive.',
          boardTexture.wet ? 'On wet boards, checking protects your checking range.' : '',
        )
      } else if (handBoardFit === 'draw') {
        verdict = 'acceptable'
        headline = 'Checking a draw. Consider semi-bluffing.'
        preferredAction = 'Bet or Check'
        preferredFrequency = 'Mixed — semi-bluff at some frequency'
        evNote = 'Semi-bluffing with draws combines fold equity with equity when called.'
        confidence = 'mixed'
        reasoning.push(
          'Draws make good semi-bluff candidates.',
          'Betting applies pressure and can win the pot immediately.',
          'Checking preserves the option to realize equity for free.',
        )
      } else {
        verdict = 'excellent'
        headline = 'Good check with a weak hand.'
        preferredAction = 'Check'
        evNote = 'This matches solver preference.'
        reasoning.push(
          'Weak hands should check to avoid putting money in behind.',
          'Checking preserves equity realization.',
        )
      }
    } else if (heroAction.action === 'bet') {
      if (handBoardFit === 'strong') {
        verdict = 'excellent'
        headline = 'Value bet with a strong hand. Well played.'
        preferredAction = 'Bet'
        evNote = 'This matches solver preference.'
        reasoning.push(
          'Betting for value with strong hands is fundamental to GTO.',
          'Your hand is ahead of villain\'s continuing range.',
        )

        // Sizing analysis
        if (heroAction.size !== undefined && streetData.potBefore > 0) {
          const sizePct = heroAction.size / streetData.potBefore
          if (boardTexture.wet && sizePct < 0.5) {
            sizingNote = 'Consider sizing up on this wet board to charge draws.'
          } else if (!boardTexture.wet && sizePct > 0.8) {
            sizingNote = 'On this dry board, a smaller sizing gets called by more hands.'
          }
        }
      } else if (handBoardFit === 'medium') {
        verdict = 'acceptable'
        headline = 'Thin value bet. This hand is on the border of value and bluff.'
        preferredAction = 'Check or Bet small'
        preferredFrequency = 'Mixed — check preferred at higher frequency'
        evNote = 'Betting medium hands risks getting raised off equity.'
        confidence = 'close'
        reasoning.push(
          'Medium-strength hands are difficult to play as bets.',
          'When called, you\'re often behind. When raised, you must fold.',
          'Checking controls the pot and preserves showdown value.',
        )
      } else if (handBoardFit === 'draw') {
        verdict = 'good'
        headline = 'Semi-bluff with a draw. Aggressive and profitable.'
        preferredAction = 'Bet'
        preferredFrequency = 'Mixed — good semi-bluff candidate'
        evNote = 'Semi-bluffing combines fold equity with equity when called.'
        confidence = 'mixed'
        reasoning.push(
          'Draws with equity make ideal bluff candidates.',
          'You win when villain folds, and still have outs when called.',
        )
      } else {
        // Bluffing with air
        if (boardTexture.highCards) {
          verdict = 'acceptable'
          headline = 'Bluff on a favorable board texture. High-risk, high-reward.'
          preferredAction = 'Check'
          preferredFrequency = 'Low frequency bluff'
          evNote = 'Bluffing can be profitable but requires the right board and range composition.'
          confidence = 'close'
          reasoning.push(
            'Bluffing on boards that favor your range can be effective.',
            'Ensure your bluffing frequency is balanced with value bets.',
          )
        } else {
          verdict = 'inaccuracy'
          headline = 'Bluffing here is ambitious. The board doesn\'t strongly favor your range.'
          preferredAction = 'Check'
          evNote = 'Bluffing without range advantage or blockers is lower EV.'
          reasoning.push(
            'Effective bluffs need range advantage or strong blockers.',
            'Without these, checking and giving up is more profitable.',
          )
        }
      }
    }
  } else {
    // Facing a bet
    if (heroAction.action === 'fold') {
      if (handBoardFit === 'strong') {
        verdict = 'mistake'
        headline = 'Folding a strong hand to a bet. Reconsider.'
        preferredAction = 'Call or Raise'
        evNote = 'Folding strong hands surrenders significant EV.'
        reasoning.push(
          'Your hand has strong equity against a betting range.',
          'Folding allows villain to profit with bluffs.',
          'At minimum, calling keeps villain honest.',
        )
      } else if (handBoardFit === 'medium') {
        verdict = 'acceptable'
        headline = 'Folding a medium hand. Could go either way.'
        preferredAction = 'Call'
        preferredFrequency = 'Mixed — depends on sizing and opponent'
        evNote = 'Close between calling and folding. Pot odds matter.'
        confidence = 'close'
        reasoning.push(
          'Medium hands serve as bluff-catchers.',
          'Folding too many medium hands makes you exploitable to bluffs.',
          'Consider pot odds and opponent tendencies.',
        )
      } else if (handBoardFit === 'draw') {
        const potOdds = streetData.potBefore > 0 && heroAction.size
          ? heroAction.size / (streetData.potBefore + heroAction.size)
          : 0.3
        if (potOdds < 0.25) {
          verdict = 'inaccuracy'
          headline = 'Folding a draw with good pot odds. Consider calling.'
          preferredAction = 'Call'
          evNote = 'The pot odds may justify continuing with your draw.'
          reasoning.push('With enough outs, the pot odds make calling profitable.')
        } else {
          verdict = 'good'
          headline = 'Folding a draw facing a large bet. Disciplined.'
          preferredAction = 'Fold'
          evNote = 'The sizing prices out your draw.'
          reasoning.push('Large bets deny the correct odds to chase draws.')
        }
      } else {
        verdict = 'excellent'
        headline = 'Clean fold with a weak hand. No reason to continue.'
        preferredAction = 'Fold'
        evNote = 'This matches solver preference.'
        reasoning.push('Folding without showdown value or draws is correct.')
      }
    } else if (heroAction.action === 'call') {
      if (handBoardFit === 'strong') {
        verdict = 'good'
        headline = 'Solid call with a strong hand. Consider raising for value.'
        preferredAction = 'Call or Raise'
        preferredFrequency = 'Mixed — raising has merit'
        evNote = 'Calling is safe but raising may extract more value.'
        confidence = 'mixed'
        reasoning.push(
          'Strong hands can call to keep villain\'s bluffs in.',
          'Raising for value is also viable, especially on wet boards.',
        )
      } else if (handBoardFit === 'medium') {
        verdict = 'good'
        headline = 'Correct bluff-catch with a medium hand.'
        preferredAction = 'Call'
        evNote = 'Medium-strength hands are natural bluff-catchers.'
        reasoning.push(
          'Your hand beats villain\'s bluffs and some thin value bets.',
          'Calling keeps villain from profiting with excessive bluffs.',
        )
      } else if (handBoardFit === 'draw') {
        verdict = 'good'
        headline = 'Drawing with the right odds. Reasonable call.'
        preferredAction = 'Call'
        evNote = 'Continuing with draws when odds are favorable is correct.'
        reasoning.push('Draws should call when pot odds or implied odds justify it.')
      } else {
        verdict = 'inaccuracy'
        headline = 'Calling without equity or showdown value is a leak.'
        preferredAction = 'Fold or Raise (as bluff)'
        evNote = 'Calling with air bleeds chips. Bluff-raise or fold.'
        reasoning.push(
          'Without equity, calling just delays the inevitable.',
          'Either fold cleanly or raise as a bluff with fold equity.',
        )
      }
    } else if (heroAction.action === 'raise') {
      if (handBoardFit === 'strong') {
        verdict = 'excellent'
        headline = 'Value raise with a strong hand. Aggressive and correct.'
        preferredAction = 'Raise'
        evNote = 'This matches solver preference.'
        reasoning.push(
          'Raising builds the pot with the best hand.',
          'This puts pressure on villain\'s medium-strength hands.',
        )
      } else if (handBoardFit === 'draw') {
        verdict = 'good'
        headline = 'Semi-bluff raise with a draw. High-equity aggression.'
        preferredAction = 'Call or Raise'
        preferredFrequency = 'Mixed — raise at some frequency'
        evNote = 'Semi-bluff raises combine fold equity with draw equity.'
        confidence = 'mixed'
        reasoning.push(
          'Raising with draws applies maximum pressure.',
          'You have equity when called and can win immediately if villain folds.',
        )
      } else {
        verdict = 'inaccuracy'
        headline = 'Raising without a strong hand or draw is risky.'
        preferredAction = 'Call or Fold'
        evNote = 'Bluff-raising requires specific board textures and blockers.'
        reasoning.push(
          'Effective bluff-raises need strong blockers to villain\'s continuing range.',
          'Without these, the raise is lower EV than folding or calling.',
        )
      }
    }
  }

  // Filter empty reasoning strings
  reasoning.forEach((r, i) => { if (!r) reasoning.splice(i, 1) })

  // Add contextual reasoning
  if (spr < 2 && streetData.street !== 'preflop') {
    reasoning.push(`Very low SPR (${spr.toFixed(1)}) — commitment decisions dominate.`)
  }
  if (boardTexture.monotone) {
    reasoning.push('Monotone board increases flush draw frequency — adjust ranges accordingly.')
  }
  if (boardTexture.paired) {
    reasoning.push('Paired board reduces hand combinations — trips and full houses are in play.')
  }

  return {
    street: streetData.street,
    heroAction,
    verdict,
    headline,
    preferredAction,
    preferredFrequency,
    sizingNote,
    evNote,
    reasoning: reasoning.filter(r => r.length > 0),
    confidence,
  }
}

// ---------------------------------------------------------------------------
// Board Texture
// ---------------------------------------------------------------------------

interface BoardTexture {
  wet: boolean
  monotone: boolean
  paired: boolean
  connected: boolean
  highCards: boolean
  broadway: number
}

function analyzeBoardTexture(boardCards: number[]): BoardTexture {
  if (boardCards.length === 0) return { wet: false, monotone: false, paired: false, connected: false, highCards: false, broadway: 0 }

  const ranks = boardCards.map(c => c >> 2)
  const suits = boardCards.map(c => c & 3)

  // Count suits
  const suitCounts: Record<number, number> = {}
  for (const s of suits) suitCounts[s] = (suitCounts[s] || 0) + 1
  const maxSuitCount = Math.max(...Object.values(suitCounts))
  const monotone = maxSuitCount >= 3

  // Check for pairs
  const rankCounts: Record<number, number> = {}
  for (const r of ranks) rankCounts[r] = (rankCounts[r] || 0) + 1
  const paired = Object.values(rankCounts).some(c => c >= 2)

  // Check connectivity
  const sortedRanks = [...new Set(ranks)].sort((a, b) => a - b)
  let maxGap = 0
  for (let i = 1; i < sortedRanks.length; i++) {
    const gap = sortedRanks[i] - sortedRanks[i - 1]
    if (gap <= 2) maxGap = Math.max(maxGap, 1)
  }
  const connected = sortedRanks.length >= 2 && sortedRanks[sortedRanks.length - 1] - sortedRanks[0] <= 4

  // Broadway count (T+)
  const broadway = ranks.filter(r => r >= 8).length
  const highCards = broadway >= 2

  // Wet = flush draws or straight draws possible
  const wet = maxSuitCount >= 2 || connected || (sortedRanks.length >= 3 && sortedRanks[sortedRanks.length - 1] - sortedRanks[0] <= 5)

  return { wet, monotone, paired, connected, highCards, broadway }
}

// ---------------------------------------------------------------------------
// Hand-Board Fit
// ---------------------------------------------------------------------------

type HandFit = 'strong' | 'medium' | 'draw' | 'weak'

function evaluateHandBoardFit(
  heroCards: [number, number],
  boardCards: number[],
  preStrength: number,
): HandFit {
  if (boardCards.length === 0) return preStrength >= 80 ? 'strong' : preStrength >= 50 ? 'medium' : 'weak'

  const heroRanks = [heroCards[0] >> 2, heroCards[1] >> 2]
  const heroSuits = [heroCards[0] & 3, heroCards[1] & 3]
  const boardRanks = boardCards.map(c => c >> 2)
  const boardSuits = boardCards.map(c => c & 3)

  // Check for pairs with the board
  const pairCount = heroRanks.filter(r => boardRanks.includes(r)).length
  const topBoardRank = Math.max(...boardRanks)

  // Check for overpair
  const isOverpair = heroRanks[0] === heroRanks[1] && heroRanks[0] > topBoardRank

  // Check for top pair with good kicker
  const hasTopPair = heroRanks.some(r => r === topBoardRank)
  const kicker = hasTopPair ? Math.max(...heroRanks.filter(r => r !== topBoardRank), ...heroRanks) : 0

  // Check for two pair or better
  const hasTwoPair = pairCount >= 2

  // Check for flush draw
  const heroSuited = heroSuits[0] === heroSuits[1]
  const boardSuitCounts: Record<number, number> = {}
  for (const s of boardSuits) boardSuitCounts[s] = (boardSuitCounts[s] || 0) + 1

  let hasFlushDraw = false
  if (heroSuited) {
    const heroSuit = heroSuits[0]
    hasFlushDraw = (boardSuitCounts[heroSuit] || 0) >= 2
  }

  // Check for straight draw (simplified)
  const allRanks = [...heroRanks, ...boardRanks].sort((a, b) => a - b)
  const uniqueRanks = [...new Set(allRanks)]
  let hasStraightDraw = false
  for (let i = 0; i <= uniqueRanks.length - 4; i++) {
    if (uniqueRanks[i + 3] - uniqueRanks[i] <= 4) {
      const windowRanks = uniqueRanks.slice(i, i + 4)
      const usesHeroCard = windowRanks.some(r => heroRanks.includes(r))
      if (usesHeroCard) hasStraightDraw = true
    }
  }

  // Classify
  if (isOverpair || hasTwoPair || (hasTopPair && kicker >= 10)) return 'strong'
  if (hasTopPair || pairCount >= 1) return 'medium'
  if (hasFlushDraw || hasStraightDraw) return 'draw'
  return 'weak'
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStreetOrder(street: Street): number {
  return { preflop: 0, flop: 1, turn: 2, river: 3 }[street]
}

function getPositionDescription(pos: Position): string {
  const descs: Record<Position, string> = {
    UTG: 'Early position — tightest range',
    HJ: 'Middle position — slightly wider than UTG',
    CO: 'Cutoff — opens wider with position advantage',
    BU: 'Button — widest opening range',
    SB: 'Small blind — must play out of position postflop',
    BB: 'Big blind — defends widest due to pot odds',
  }
  return descs[pos] ?? pos
}

function makeEmptyVerdict(street: Street): StreetVerdict {
  return {
    street,
    heroAction: null,
    verdict: 'good',
    headline: 'No hero action on this street.',
    preferredAction: '-',
    preferredFrequency: '-',
    sizingNote: null,
    evNote: '',
    reasoning: [],
    confidence: 'high',
  }
}

// ---------------------------------------------------------------------------
// Main Analysis
// ---------------------------------------------------------------------------

function generateCoachingSummary(verdicts: StreetVerdict[]): CoachingSummary {
  const verdictScores: Record<VerdictLevel, number> = {
    excellent: 5, good: 4, acceptable: 3, inaccuracy: 2, mistake: 1,
  }

  const activeVerdicts = verdicts.filter(v => v.heroAction !== null)

  if (activeVerdicts.length === 0) {
    return {
      biggestDeviation: 'No actions to analyze.',
      bestPlayedStreet: '-',
      mainAdjustment: 'Enter your actions on each street for analysis.',
      studyDirection: 'Start with preflop opening ranges.',
      overallGrade: 'good',
    }
  }

  // Find worst and best streets
  const sorted = [...activeVerdicts].sort((a, b) => verdictScores[a.verdict] - verdictScores[b.verdict])
  const worst = sorted[0]
  const best = sorted[sorted.length - 1]

  // Overall grade — average
  const avg = activeVerdicts.reduce((sum, v) => sum + verdictScores[v.verdict], 0) / activeVerdicts.length
  let overallGrade: VerdictLevel = 'good'
  if (avg >= 4.5) overallGrade = 'excellent'
  else if (avg >= 3.5) overallGrade = 'good'
  else if (avg >= 2.5) overallGrade = 'acceptable'
  else if (avg >= 1.5) overallGrade = 'inaccuracy'
  else overallGrade = 'mistake'

  const streetNames: Record<Street, string> = { preflop: 'Preflop', flop: 'Flop', turn: 'Turn', river: 'River' }

  // Study direction based on worst verdict
  let studyDirection = 'Continue refining your postflop play.'
  if (worst.street === 'preflop') {
    studyDirection = 'Review preflop opening and defending ranges for your position.'
  } else if (worst.reasoning.some(r => r.includes('bluff'))) {
    studyDirection = 'Study bluffing frequencies and blocker concepts.'
  } else if (worst.reasoning.some(r => r.includes('pot control') || r.includes('medium'))) {
    studyDirection = 'Practice pot control decisions with medium-strength hands.'
  } else if (worst.reasoning.some(r => r.includes('value'))) {
    studyDirection = 'Work on value bet sizing and frequency.'
  }

  return {
    biggestDeviation: `${streetNames[worst.street]}: ${worst.headline}`,
    bestPlayedStreet: `${streetNames[best.street]}: ${best.headline}`,
    mainAdjustment: worst.reasoning[0] ?? 'Review the flagged street for improvement.',
    studyDirection,
    overallGrade,
  }
}

function generateTags(hand: HandData, verdicts: StreetVerdict[]): string[] {
  const tags: string[] = []

  // Pot type
  const preflopActions = hand.streets.find(s => s.street === 'preflop')?.actions ?? []
  const raiseCount = preflopActions.filter(a => a.action === 'raise').length
  if (raiseCount >= 2) tags.push('3BP')
  else if (raiseCount >= 1) tags.push('SRP')
  else tags.push('Limped')

  // Position matchup
  const villain = preflopActions.find(a => !a.isHero && a.action !== 'fold')
  if (villain) {
    tags.push(`${hand.heroPosition} vs ${villain.position}`)
  }

  // Specific patterns
  const hasRiverBluff = verdicts.find(v =>
    v.street === 'river' && v.heroAction?.action === 'bet' && v.reasoning.some(r => r.toLowerCase().includes('bluff'))
  )
  if (hasRiverBluff) tags.push('River bluff')

  const hasBigMistake = verdicts.some(v => v.verdict === 'mistake')
  if (hasBigMistake) tags.push('Key mistake')

  const allGood = verdicts.every(v => v.verdict === 'excellent' || v.verdict === 'good')
  if (allGood) tags.push('Well played')

  return tags
}

export function analyzeHand(hand: HandData): HandReview {
  const verdicts: StreetVerdict[] = []

  // Preflop
  verdicts.push(analyzePreflopAction(hand))

  // Postflop streets
  for (const streetData of hand.streets) {
    if (streetData.street === 'preflop') continue
    verdicts.push(analyzePostflopStreet(hand, streetData))
  }

  const summary = generateCoachingSummary(verdicts)
  const tags = generateTags(hand, verdicts)

  return { hand, verdicts, summary, tags }
}
