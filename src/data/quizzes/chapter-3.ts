import type { QuizQuestion } from '@/types'

export const chapter3Questions: QuizQuestion[] = [
  {
    id: 'q-3-001',
    chapterId: 3,
    conceptIds: ['open-raising', 'fold-equity'],
    type: 'multiple-choice',
    prompt:
      'According to the text, what is the primary reason why open limping is considered an inferior strategy in 6-max cash games?',
    options: [
      {
        id: 'a',
        text: 'It alerts opponents to the fact that the player holds a specifically weak hand.',
        explanation:
          'While weak players often limp with weak hands, the text focuses on the mechanical disadvantages of the play rather than just the information given away.',
      },
      {
        id: 'b',
        text: 'It gives up the opportunity to win the pot immediately through pre-flop fold equity.',
        explanation:
          'Open limping allows opponents to see a flop for free or cheap, sacrificing one of the most stable flows of Expected Value (EV).',
      },
      {
        id: 'c',
        text: 'It keeps the pot size too small for high-value hands to maximize profit.',
        explanation:
          'While true that it fails to build a pot, the text emphasizes the loss of fold equity as a more fundamental strategic failure.',
      },
      {
        id: 'd',
        text: 'It forces the player to play out of position on most post-flop streets.',
        explanation:
          'Position is determined by table seat, not the act of limping itself, though limping does allow others to take the initiative.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Open limping sacrifices pre-flop fold equity — the most stable source of EV — by allowing opponents to see a flop cheaply.',
    chapterReference: 'Chapter 3 — Open Limping Strategy',
  },
  {
    id: 'q-3-002',
    chapterId: 3,
    conceptIds: ['isolation'],
    type: 'multiple-choice',
    prompt:
      "In the context of the ISO Triangle, which factor is described as an 'absolute factor' that can justify a raise on its own?",
    options: [
      {
        id: 'a',
        text: 'Fold Equity',
        explanation:
          'Fold equity alone is rarely enough to ISO if your hand has zero strength and you are in the worst possible position.',
      },
      {
        id: 'b',
        text: 'Position',
        explanation:
          'The text notes that position is actually the least influential of the three factors, though it often acts as a deal-breaker.',
      },
      {
        id: 'c',
        text: 'Frequent Strength',
        explanation:
          "Hands with massive 'brute force' strength, like AA, do not require fold equity or position to be a profitable isolation raise.",
      },
      {
        id: 'd',
        text: 'Stack Depth',
        explanation:
          'Stack depth is not one of the three primary points of the ISO Triangle model presented in the manual.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      'Frequent Strength is the absolute factor — premium hands like AA have enough brute-force strength to justify an ISO raise regardless of position or fold equity.',
    chapterReference: 'Chapter 3 — The ISO Triangle',
  },
  {
    id: 'q-3-003',
    chapterId: 3,
    conceptIds: ['isolation', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "Which type of 'Fish' is characterized by a high 'Fold to F Cbet' stat (between 55% and 75%) and a large gap between VPIP and PFR?",
    options: [
      {
        id: 'a',
        text: 'The Whale (Type D)',
        explanation:
          "Whales are defined by the magnitude of their errors and extreme loose-passivity or loose-aggression, rather than a specific 'fit-or-fold' tendency.",
      },
      {
        id: 'b',
        text: 'The Station Fish (Type B)',
        explanation:
          'Calling stations are defined by their refusal to fold, typically having fold to c-bet stats of 45% or lower.',
      },
      {
        id: 'c',
        text: 'The Aggro Fish (Type C)',
        explanation:
          'Aggressive fish typically have higher PFR stats and convergence between VPIP and PFR, often preferring to bet rather than fold.',
      },
      {
        id: 'd',
        text: 'The Fit-or-Fold Fish (Type A)',
        explanation:
          'This player enters many pots but gives up easily post-flop unless they connect strongly with the board, making them ideal targets for ISOs.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'The Fit-or-Fold Fish (Type A) has a high Fold to F Cbet stat and large VPIP-PFR gap, meaning they limp in frequently but give up easily post-flop.',
    chapterReference: 'Chapter 3 — Fish Types',
  },
  {
    id: 'q-3-004',
    chapterId: 3,
    conceptIds: ['isolation'],
    type: 'multiple-choice',
    prompt:
      'According to the ISO Sizing Rule, what should be the standard raise size if Hero is in the Big Blind facing two limpers from earlier positions?',
    options: [
      {
        id: 'a',
        text: '6 BB',
        explanation:
          'The rule is 3 BB + 1 BB for each limper (+2 BB) plus 1 BB for being out of position (3 + 2 + 1 = 6).',
      },
      {
        id: 'b',
        text: '5 BB',
        explanation:
          'This calculation either misses one of the limpers or neglects the extra penalty for being out of position.',
      },
      {
        id: 'c',
        text: '4 BB',
        explanation:
          'This fails to account for either the second limper or the fact that the Hero is playing out of position.',
      },
      {
        id: 'd',
        text: '3 BB',
        explanation:
          'This is a standard open-raise size and does not account for the dead money from limpers or positional disadvantages.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'ISO sizing from the BB with two limpers: 3 BB base + 1 BB per limper (×2) + 1 BB OOP penalty = 6 BB.',
    chapterReference: 'Chapter 3 — ISO Sizing Rule',
  },
  {
    id: 'q-3-005',
    chapterId: 3,
    conceptIds: ['isolation', 'fold-equity'],
    type: 'multiple-choice',
    prompt:
      'When should Hero consider decreasing their standard ISO sizing to approximately 3 BB despite a limper being in the pot?',
    options: [
      {
        id: 'a',
        text: "When the limper has a very low 'Fold to ISO' percentage.",
        explanation:
          'If a player never folds, you should typically size up with strong hands to build a bigger pot for value.',
      },
      {
        id: 'b',
        text: "When there are '3-bet happy' regulars left to act behind Hero.",
        explanation:
          "Lowering the size protects Hero's range from being exploited by aggressive 3-betting, similar to adjusting open sizes on the Button.",
      },
      {
        id: 'c',
        text: "When there is an 'Aggro Fish' in the blinds who calls too much.",
        explanation:
          'Against players who call too much, you generally want to increase sizing for value or stick to the rule, not decrease it.',
      },
      {
        id: 'd',
        text: 'When Hero is in position and wants to encourage the limper to call.',
        explanation:
          'The goal of an ISO is usually to maximize fold equity and play heads-up, not to give the opponent better odds to see a flop.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      "Reduce ISO sizing to ~3 BB when aggressive 3-bettors are behind you to protect your range from being exploited.",
    chapterReference: 'Chapter 3 — ISO Sizing Adjustments',
  },
  {
    id: 'q-3-006',
    chapterId: 3,
    conceptIds: ['isolation', 'implied-odds', 'pot-odds'],
    type: 'multiple-choice',
    prompt:
      "What does the text suggest as the best course of action when the ISO Triangle is 'more empty than full'?",
    options: [
      {
        id: 'a',
        text: 'Fold immediately to avoid playing a marginalized pot.',
        explanation:
          "While folding is an option, the text provides a secondary 'Limping Triangle' to evaluate if calling is a better alternative.",
      },
      {
        id: 'b',
        text: 'Min-raise to keep the pot small while still taking the initiative.',
        explanation:
          'The manual explicitly provides a sizing rule that is larger than standard opens; min-raising is not recommended.',
      },
      {
        id: 'c',
        text: 'Always ISO anyway to maintain an aggressive table image.',
        explanation:
          'The manual teaches an exploitation-based strategy where we only ISO when the specific factors make it +EV.',
      },
      {
        id: 'd',
        text: "Move to the 'Limping Triangle' to evaluate Pot Odds, Implied Odds, and Steal Potential.",
        explanation:
          'If a raise is not profitable, Hero should check if the price and future potential of the hand justify limping behind or completing.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      "When the ISO Triangle doesn't support a raise, shift to the Limping Triangle to evaluate whether pot odds, implied odds, and steal potential make overlimping profitable.",
    chapterReference: 'Chapter 3 — ISO vs Limping Triangles',
  },
  {
    id: 'q-3-007',
    chapterId: 3,
    conceptIds: ['isolation', 'position'],
    type: 'multiple-choice',
    prompt:
      'In Hand 11, why does Hero \'complete\' from the Small Blind with 98s instead of ISO raising?',
    options: [
      {
        id: 'a',
        text: 'Hero is out of position against a Regular in the Big Blind and a Fish in the Cutoff.',
        explanation:
          'The positional disadvantage and the presence of an observant player behind compromise fold equity and post-flop control.',
      },
      {
        id: 'b',
        text: 'The pot odds offered in the Small Blind are too poor to justify a raise.',
        explanation:
          'Pot odds are a reason to call (complete), but they are actually very favorable (5 : 1) in this specific spot.',
      },
      {
        id: 'c',
        text: 'The hand lacks any implied odds against the specific opponents.',
        explanation:
          'The text states that 98s actually has okay implied odds because it can flop straights and two-pair.',
      },
      {
        id: 'd',
        text: "Hero's hand has 'Absolute Frequent Strength' and wants to keep the pot small.",
        explanation:
          'Hands with absolute strength, like AA, want to build the pot, and 98s does not have absolute strength.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Hero completes with 98s from the SB because being OOP against a Reg in the BB and a Fish in the CO makes the ISO Triangle too empty — fold equity and position are both compromised.',
    chapterReference: 'Chapter 3 — Hand 11: SB Complete',
  },
  {
    id: 'q-3-008',
    chapterId: 3,
    conceptIds: ['hand-selection'],
    type: 'multiple-choice',
    prompt:
      "How does the manual define 'Showdown Value' (SDV)?",
    options: [
      {
        id: 'a',
        text: 'The value gained from an opponent folding to a large river bet.',
        explanation:
          'Winning because an opponent folds is related to fold equity, not showdown value.',
      },
      {
        id: 'b',
        text: 'The measure of how likely a hand is to win at the end of a round without improving.',
        explanation:
          "Hands like Ace-high often have SDV when they miss the board entirely, as they can still beat various 'air' ranges.",
      },
      {
        id: 'c',
        text: 'The likelihood that a hand will flop a set or a flush draw.',
        explanation:
          'This describes draw potential or frequent strength rather than the ability of an unimproved hand to win.',
      },
      {
        id: 'd',
        text: 'The mathematical probability of a hand being the best starting hand pre-flop.',
        explanation:
          'While related to pre-flop strength, SDV specifically looks forward to the outcome of an unimproved showdown.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Showdown Value (SDV) measures how likely a hand is to win at showdown without improving — hands like Ace-high can beat bluffs and air ranges.',
    chapterReference: 'Chapter 3 — Showdown Value',
  },
  {
    id: 'q-3-009',
    chapterId: 3,
    conceptIds: ['isolation', 'position'],
    type: 'multiple-choice',
    prompt:
      'Which of the following is NOT listed as a reason why being in position (IP) makes an ISO more profitable?',
    options: [
      {
        id: 'a',
        text: 'It adds fold equity to continuation bets post-flop.',
        explanation:
          'This is a listed benefit; opponents find it harder to continue when acting first on every street.',
      },
      {
        id: 'b',
        text: 'It gives Hero more control over the size of the pot.',
        explanation:
          'This is a listed benefit; Hero can choose to check back to keep the pot small or bet to grow it.',
      },
      {
        id: 'c',
        text: "Hero picks up more information by seeing the opponent act first.",
        explanation:
          "This is a listed benefit; seeing Villain's action allows for more accurate hand reading.",
      },
      {
        id: 'd',
        text: 'It guarantees that Hero will have the best hand at showdown.',
        explanation:
          'Position provides information and control but has no impact on the actual cards dealt or hand rankings.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'Position gives information, pot control, and fold equity advantages — but it never guarantees having the best hand at showdown.',
    chapterReference: 'Chapter 3 — Position and ISO Profitability',
  },
  {
    id: 'q-3-010',
    chapterId: 3,
    conceptIds: ['isolation', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "What is the specific adjustment recommended when playing against a 'Whale' (Type D)?",
    options: [
      {
        id: 'a',
        text: 'Always limp behind to keep the pot small and minimize variance.',
        explanation:
          "Hero wants to build a pot against a player who might 'call down with king-high for three streets' for maximum value.",
      },
      {
        id: 'b',
        text: 'Only ISO with premium pairs like QQ or better.',
        explanation:
          "Waiting only for premiums would miss too many profitable opportunities to exploit the Whale's fundamental lack of understanding.",
      },
      {
        id: 'c',
        text: "ISO a very wide range to capitalize on the Whale's gargantuan errors.",
        explanation:
          "The potential value from a Whale's mistakes is so high that Hero should take every reasonable chance to get heads-up with them.",
      },
      {
        id: 'd',
        text: 'Tighten the ISO range significantly due to lack of fold equity.',
        explanation:
          'This is the advice for Station Fish, but Whales make errors so large that Hero should broaden the range instead.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      "Against Whales, ISO very wide because the magnitude of their errors is so large that nearly any heads-up pot is profitable.",
    chapterReference: 'Chapter 3 — Playing Against Whales',
  },
]
