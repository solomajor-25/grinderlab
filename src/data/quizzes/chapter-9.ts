import type { QuizQuestion } from '@/types'

export const chapter9Questions: QuizQuestion[] = [
  {
    id: 'q-9-001',
    chapterId: 9,
    conceptIds: ['combinatorics'],
    type: 'multiple-choice',
    prompt:
      'In Texas Holdem, how many individual combinations (combos) make up a specific pocket pair, such as 88?',
    options: [
      {
        id: 'a',
        text: '12',
        explanation:
          'This is the number of combinations for a specific offsuit unpaired hand, such as AQo.',
      },
      {
        id: 'b',
        text: '4',
        explanation:
          'This number corresponds to the number of combinations available for a specific suited hand, not a pocket pair.',
      },
      {
        id: 'c',
        text: '16',
        explanation:
          'This represents the total number of combinations for any unpaired hand, including both suited and offsuit variations.',
      },
      {
        id: 'd',
        text: '6',
        explanation:
          'There are six ways to pair the four suits of a single rank (cd, ch, cs, dh, ds, hs).',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'A specific pocket pair has 6 combinations — the six ways to pair four suits of a single rank.',
    chapterReference: 'Chapter 9 — Combo Counting Basics',
  },
  {
    id: 'q-9-002',
    chapterId: 9,
    conceptIds: ['combinatorics'],
    type: 'multiple-choice',
    prompt:
      "If a player's range consists of one pocket pair (e.g., AA) and one unpaired hand (e.g., 72), what is the probability they were actually dealt the pocket pair?",
    options: [
      {
        id: 'a',
        text: '50%',
        explanation:
          'This assumes both hand types are equally likely, which is a common misconception known as the Equal Chance Fallacy.',
      },
      {
        id: 'b',
        text: '\u2248 37.5%',
        explanation:
          'This might result from incorrectly using 4 suited combos instead of 16 total unpaired combos in the denominator.',
      },
      {
        id: 'c',
        text: '\u2248 27%',
        explanation:
          'The probability is calculated by dividing the 6 pocket pair combos by the total 22 possible combos (6 + 16).',
      },
      {
        id: 'd',
        text: '73%',
        explanation:
          'This represents the probability of holding the unpaired hand rather than the pocket pair.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      'The pocket pair has 6 combos while the unpaired hand has 16. Probability = 6 / (6 + 16) = 6/22 \u2248 27%.',
    chapterReference: 'Chapter 9 — Combo Frequency',
  },
  {
    id: 'q-9-003',
    chapterId: 9,
    conceptIds: ['combinatorics', 'hand-reading'],
    type: 'multiple-choice',
    prompt:
      'Hero holds A\u2661K\u25c7 on the Button. How many combinations of AA can the opponent in the Big Blind possibly hold?',
    options: [
      {
        id: 'a',
        text: '4',
        explanation:
          'This number is often confused with suited hand combinations and does not reflect the reduction caused by a single blocker for a pair.',
      },
      {
        id: 'b',
        text: '1',
        explanation:
          'This would only be true if two Aces were accounted for, such as one in Hero\'s hand and one on the board.',
      },
      {
        id: 'c',
        text: '6',
        explanation:
          'This is the total number of AA combinations when no Aces are removed from the deck by blockers.',
      },
      {
        id: 'd',
        text: '3',
        explanation:
          'Holding one Ace reduces the available combinations of AA from 6 down to 3.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'Holding one Ace blocks half the AA combinations, reducing them from 6 to 3.',
    chapterReference: 'Chapter 9 — Blocker Effects',
  },
  {
    id: 'q-9-004',
    chapterId: 9,
    conceptIds: ['combinatorics', 'equity'],
    type: 'multiple-choice',
    prompt:
      "What is the primary reason Hero's equity with QQ against a range of [KK+, AK] is approximately 40% rather than significantly lower?",
    options: [
      {
        id: 'a',
        text: 'AK only has 4 suited combinations',
        explanation:
          'While true for suited AK, the offsuit combinations (12) must also be counted, significantly increasing the total AK count.',
      },
      {
        id: 'b',
        text: 'Hero blocks one of the combinations of AA',
        explanation:
          'Hero holds QQ, which does not block AA or KK at all; the distribution is based on the natural frequency of unpaired hands.',
      },
      {
        id: 'c',
        text: 'The range is weighted toward AK',
        explanation:
          'There are 16 combinations of AK (which QQ slightly beats) and only 12 combinations of AA and KK combined (which crush QQ).',
      },
      {
        id: 'd',
        text: 'QQ is a coin-flip against KK',
        explanation:
          'QQ is actually a massive underdog against KK; the equity boost comes from the weighting of other hands.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      'QQ has ~40% equity vs [KK+, AK] because the range is combo-weighted toward AK (16 combos) which QQ beats, vs only 12 combos of AA+KK.',
    chapterReference: 'Chapter 9 — Combo Weighting',
  },
  {
    id: 'q-9-005',
    chapterId: 9,
    conceptIds: ['combinatorics', 'hand-reading'],
    type: 'multiple-choice',
    prompt:
      'On a board of J\u25c76\u26612\u26618\u26602\u2663, how many combinations of 22 (quads) can the Villain hold?',
    options: [
      {
        id: 'a',
        text: '6',
        explanation:
          'This is the default number of combinations for a pocket pair when none of the cards are blocked.',
      },
      {
        id: 'b',
        text: '3',
        explanation:
          'This would be the number of combinations if only one of that rank were visible on the board.',
      },
      {
        id: 'c',
        text: '0',
        explanation:
          'There are still enough Twos remaining in the deck to form one specific pocket pair combination.',
      },
      {
        id: 'd',
        text: '1',
        explanation:
          'Since two of the four Twos are on the board, only one combination of the remaining two cards is possible.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'With two Twos on the board, only one combination of the remaining two Twos exists for quads.',
    chapterReference: 'Chapter 9 — Board Blockers',
  },
  {
    id: 'q-9-006',
    chapterId: 9,
    conceptIds: ['combinatorics'],
    type: 'multiple-choice',
    prompt:
      "Which concept describes the logical error of assuming that two possible outcomes (like 'he has the nuts' or 'he is bluffing') are equally likely?",
    options: [
      {
        id: 'a',
        text: 'The Equal Chance Fallacy',
        explanation:
          'This fallacy occurs when a player ignores the different frequencies (combos) of different hand types within a range.',
      },
      {
        id: 'b',
        text: 'The Blocker Effect',
        explanation:
          'This refers to the physical removal of cards from the deck, not the psychological misestimation of frequencies.',
      },
      {
        id: 'c',
        text: 'Required Equity (RE)',
        explanation:
          'This is a mathematical threshold needed for a call based on pot odds, not a fallacy regarding hand frequencies.',
      },
      {
        id: 'd',
        text: 'Range Polarisation',
        explanation:
          "This is a strategic state where a range consists of very strong hands and bluffs, but it doesn't imply they occur with equal frequency.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      'The Equal Chance Fallacy is assuming two outcomes are equally likely while ignoring that different hand types have different combo frequencies.',
    chapterReference: 'Chapter 9 — The Equal Chance Fallacy',
  },
  {
    id: 'q-9-007',
    chapterId: 9,
    conceptIds: ['combinatorics', 'fold-equity'],
    type: 'multiple-choice',
    prompt:
      "Why does holding A\u2661K\u25c7 increase Hero's fold equity when 4-betting pre-flop?",
    options: [
      {
        id: 'a',
        text: 'It makes it impossible for the opponent to hold AKs',
        explanation:
          'While it reduces the combinations, it does not make AKs impossible unless Hero blocks specific suits for all 4 combos.',
      },
      {
        id: 'b',
        text: "It blocks many of the opponent's 'calling' and 'shoving' hands",
        explanation:
          "By holding an Ace and a King, Hero reduces the combinations of AA, KK, and AK in the opponent's range, making those hands less likely to appear.",
      },
      {
        id: 'c',
        text: 'It increases the likelihood of the opponent holding QQ',
        explanation:
          'Holding AK does not physically change the number of QQ combos; it only changes the relative weight of the range by blocking other hands.',
      },
      {
        id: 'd',
        text: 'Hero is guaranteed to have 50% equity if called',
        explanation:
          "Equity varies based on the opponent's specific range and is rarely exactly 50% when called by a tight shoving range.",
      },
    ],
    correctOptionId: 'b',
    explanation:
      "AK blocks AA (3 fewer combos), KK (3 fewer combos), and AK (9 fewer combos) in the opponent's range, significantly increasing fold equity when 4-betting.",
    chapterReference: 'Chapter 9 — Blockers and Fold Equity',
  },
  {
    id: 'q-9-008',
    chapterId: 9,
    conceptIds: ['combinatorics', 'hand-reading'],
    type: 'multiple-choice',
    prompt:
      "In the context of Hand 78, how does the manual calculate the number of 'bluff' combinations on the river?",
    options: [
      {
        id: 'a',
        text: "By assuming Villain bluffs 100% of their entire range",
        explanation:
          'Ranging requires estimating specific hand types; assuming a 100% bluff rate would be an extreme and often inaccurate exploitative read.',
      },
      {
        id: 'b',
        text: 'By counting suited hands that flopped a flush draw and missed',
        explanation:
          'The manual identifies suited combinations that give Villain a flush draw on the board and assumes a percentage of them bluff.',
      },
      {
        id: 'c',
        text: 'By subtracting value combos from the total number of pocket pairs',
        explanation:
          'Bluffs are usually identified by missed draws or specific air hands, not just by looking at pocket pairs.',
      },
      {
        id: 'd',
        text: 'By counting all offsuit K and Q high hands',
        explanation:
          'The analysis focuses on suited flush draws that missed, as these are more likely to raise the flop and bet three streets.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'The manual counts suited combinations that flopped a flush draw and missed by the river, then estimates what percentage of those Villain would bluff with.',
    chapterReference: 'Chapter 9 — Hand 78 Analysis',
  },
  {
    id: 'q-9-009',
    chapterId: 9,
    conceptIds: ['combinatorics', 'equity'],
    type: 'multiple-choice',
    prompt:
      "If Villain shoves over Hero's 4-bet and Hero needs 37.9% equity to call, what is the significance of AKo blocking 13 combinations of Villain's tight range?",
    options: [
      {
        id: 'a',
        text: "It makes the call profitable because Hero's equity exceeds the Required Equity (RE)",
        explanation:
          "The reduction in nutted combinations in Villain's range keeps Hero's equity at 42%, which is higher than the 37.9% needed.",
      },
      {
        id: 'b',
        text: 'It means Villain can never have AA',
        explanation:
          'Villain can still have AA, but the number of ways they can have it is reduced from 6 to 3.',
      },
      {
        id: 'c',
        text: 'It ensures Hero has over 50% equity',
        explanation:
          "Blockers improve equity, but against a very tight range like [JJ+, AK, AQs], Hero's equity with AKo is typically around 42%, not 50%.",
      },
      {
        id: 'd',
        text: 'It allows Hero to fold more often to the shove',
        explanation:
          "Blocking the top of Villain's range makes calling more attractive, not folding.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      "AKo blocks 13 combos from Villain's tight range, keeping Hero's equity at ~42% — above the 37.9% RE threshold, making the call profitable.",
    chapterReference: 'Chapter 9 — Blockers in 4-Bet Pots',
  },
  {
    id: 'q-9-010',
    chapterId: 9,
    conceptIds: ['combinatorics', 'general-strategy'],
    type: 'multiple-choice',
    prompt:
      "According to the manual, a 'balanced river betting range' should achieve what objective?",
    options: [
      {
        id: 'a',
        text: "Make the opponent's bluff-catchers indifferent to calling or folding",
        explanation:
          'Balance ensures that the opponent cannot exploit Hero by either over-calling or over-folding.',
      },
      {
        id: 'b',
        text: 'Ensure Hero wins 100% of the time when called',
        explanation:
          'A range that only wins when called would contain no bluffs, making it extremely unbalanced and exploitable.',
      },
      {
        id: 'c',
        text: 'Always have more bluffs than value bets',
        explanation:
          "The ratio of bluffs to value is determined by the bet size to make the opponent's call break even, not by simply having more bluffs.",
      },
      {
        id: 'd',
        text: 'Maximize the number of folds Hero gets',
        explanation:
          'While fold equity is important, balance specifically refers to protecting against being exploited, not just maximizing folds.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      "A balanced river betting range makes the opponent's bluff-catchers indifferent between calling and folding, preventing them from exploiting Hero's strategy.",
    chapterReference: 'Chapter 9 — Balanced River Ranges',
  },
]
