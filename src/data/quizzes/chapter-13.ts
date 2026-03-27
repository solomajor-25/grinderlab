import type { QuizQuestion } from '@/types'

export const chapter13Questions: QuizQuestion[] = [
  {
    id: 'q-13-001',
    chapterId: 13,
    conceptIds: ['c-betting', '3-betting'],
    type: 'multiple-choice',
    prompt:
      'In 3-bet pots, why is Hero often able to use a smaller c-bet sizing compared to single raised pots?',
    options: [
      {
        id: 'a',
        text: "The aggressor's range is wider in 3-bet pots, requiring more protection with small bets.",
        explanation:
          'Ranges in 3-bet pots are generally narrower and better defined, not wider, and smaller bets provide less protection against draws.',
      },
      {
        id: 'b',
        text: "Small sizing is used specifically to induce bluffs from the defender's capped range.",
        explanation:
          'While small sizing can induce action, its primary function in 3-bet pots is linked to SPR management and balancing the RFE of bluffs.',
      },
      {
        id: 'c',
        text: "Smaller bets always generate more fold equity because they look more like a 'trapping' value hand.",
        explanation:
          "While small bets can look strong, they mathematically require less fold equity to break even, but they don't inherently generate more folds than larger bets.",
      },
      {
        id: 'd',
        text: 'The lower stack-to-pot ratio (SPR) makes it easier to get the full stack in by the river even with small initial bets.',
        explanation:
          'Smaller bet sizes on the flop in 3-bet pots still grow the pot sufficiently to allow for a comfortable river shove due to the high starting pot relative to effective stacks.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'In 3-bet pots the SPR is already low, so even small flop bets grow the pot enough to allow a natural river shove — no need for large sizing to build the pot.',
    chapterReference: 'Chapter 13 — 3-Bet Pot C-Bet Sizing',
  },
  {
    id: 'q-13-002',
    chapterId: 13,
    conceptIds: ['c-betting', 'fold-equity'],
    type: 'multiple-choice',
    prompt:
      'If Hero bets half-pot in a 3-bet pot, what is the required fold equity (RFE) for the bet to be profitable as a pure bluff, before adjusting for equity realization?',
    options: [
      {
        id: 'a',
        text: '50%',
        explanation:
          'This would be the RFE for a pot-sized bet, where the bet must succeed half the time to break even.',
      },
      {
        id: 'b',
        text: '33%',
        explanation:
          'The RFE for a half-pot bet is calculated using the formula Bet/(Bet+Pot), which is 0.5/(0.5+1.0) = 33.3%.',
      },
      {
        id: 'c',
        text: '25%',
        explanation:
          'This would be the RFE for a one-third pot bet, calculated as 0.33/(0.33+1.0).',
      },
      {
        id: 'd',
        text: '40%',
        explanation:
          'This value does not correspond to a standard fraction of the pot using the RFE formula.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'RFE for a half-pot bet = Bet/(Bet+Pot) = 0.5/(0.5+1.0) = 33.3%. Hero needs Villain to fold just one-third of the time.',
    chapterReference: 'Chapter 13 — Half-Pot RFE',
  },
  {
    id: 'q-13-003',
    chapterId: 13,
    conceptIds: ['general-strategy'],
    type: 'multiple-choice',
    prompt:
      "According to the 'Semi-Bluffing Principle,' how should Hero adjust Villain's Required Equity (RE) when balancing a betting range on the turn?",
    options: [
      {
        id: 'a',
        text: "Increase the RE target by approximately 10% to account for the equity Hero's semi-bluffs retain.",
        explanation:
          "Because semi-bluffs can improve to the best hand, Villain needs more equity to call profitably than they would on the river where bluffs have zero equity.",
      },
      {
        id: 'b',
        text: 'Keep the RE target the same as the river to maintain consistency in range construction.',
        explanation:
          "On the river, bluffs have 0% equity, but on the turn, they have 'outs,' which changes the math for the caller.",
      },
      {
        id: 'c',
        text: 'Increase the RE target by 20% to match the adjustment used on the flop.',
        explanation:
          'The 20% adjustment is typically reserved for the flop because there are more streets and more potential outs remaining.',
      },
      {
        id: 'd',
        text: 'Decrease the RE target by 10% to account for the lack of future betting streets.',
        explanation:
          'The principle suggests increasing the target because bluffs have equity to improve, making calling more attractive for the opponent.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      "The Semi-Bluffing Principle increases the RE target by ~10% on the turn because Hero's bluffs retain equity (outs), meaning Villain needs more equity to call profitably.",
    chapterReference: 'Chapter 13 — Semi-Bluffing Principle',
  },
  {
    id: 'q-13-004',
    chapterId: 13,
    conceptIds: ['hand-selection', 'general-strategy'],
    type: 'multiple-choice',
    prompt:
      'When selecting bluffs on the river for a balanced range, why are hands with the lowest showdown value (SDV) preferred?',
    options: [
      {
        id: 'a',
        text: 'Bluffing a hand with SDV must be significantly more successful than RFE% to be better than simply checking.',
        explanation:
          'A hand with some SDV has a positive EV when checking; therefore, bluffing must exceed that positive EV to be the superior play.',
      },
      {
        id: 'b',
        text: "Hands with SDV should always be turned into bluffs to maximize the pressure on Villain's middle-range hands.",
        explanation:
          'Turning SDV into a bluff is usually a mistake because you sacrifice the times you win at showdown for a move that might not have enough fold equity.',
      },
      {
        id: 'c',
        text: 'Villain is more likely to fold when Hero holds low cards due to card removal effects.',
        explanation:
          'Card removal effects (blockers) are based on specific card ranks, not the absolute showdown strength of the hand.',
      },
      {
        id: 'd',
        text: 'Lower SDV hands have a higher probability of blocking the nuts.',
        explanation:
          'Showdown value is unrelated to blocking the nuts; blockers are a separate criteria based on specific hole cards.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Hands with SDV have positive EV when checking. To justify bluffing, the bet must exceed that checking EV — so lowest SDV hands are preferred as bluffs since they sacrifice the least.',
    chapterReference: 'Chapter 13 — River Bluff Selection',
  },
  {
    id: 'q-13-005',
    chapterId: 13,
    conceptIds: ['general-strategy'],
    type: 'multiple-choice',
    prompt:
      "What does the 'Indifference Principle' state regarding Hero's calling range when facing a bet?",
    options: [
      {
        id: 'a',
        text: "Hero should be indifferent to calling or folding regardless of Villain's sizing.",
        explanation:
          "The principle is about making the *opponent* indifferent through Hero's strategy, not Hero being personally undecided.",
      },
      {
        id: 'b',
        text: 'Hero is indifferent whenever he has a bluff-catcher in a polarized spot.',
        explanation:
          "Being indifferent as the caller is a result of Villain's balanced betting range, not the other way around.",
      },
      {
        id: 'c',
        text: 'Hero\'s range is balanced only when he calls with exactly 50% of his hands.',
        explanation:
          "The required calling frequency depends entirely on Villain's bet size and the resulting RFE target.",
      },
      {
        id: 'd',
        text: "Hero's calling range is balanced whenever Villain is 0 EV by bluffing.",
        explanation:
          'By calling at a frequency that prevents Villain from profiting with any arbitrary bluff, Hero makes Villain indifferent to bluffing.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      "The Indifference Principle: Hero's calling range is balanced when Villain's bluffs are exactly 0EV — calling frequently enough to prevent profitable bluffing.",
    chapterReference: 'Chapter 13 — Indifference Principle',
  },
  {
    id: 'q-13-006',
    chapterId: 13,
    conceptIds: ['general-strategy', 'fold-equity'],
    type: 'multiple-choice',
    prompt:
      "Under 'Balancing Principle 2', if Villain's bet size generates an RFE of 38%, what percentage of Hero's range must be called to make Villain indifferent to bluffing?",
    options: [
      {
        id: 'a',
        text: '38%',
        explanation:
          'This is the percentage of the time Villain needs Hero to fold, not the frequency Hero needs to call.',
      },
      {
        id: 'b',
        text: '62%',
        explanation:
          'To prevent a bluff from being profitable, Hero must call 100% \u2212 RFE%, which in this case is 100% \u2212 38% = 62%.',
      },
      {
        id: 'c',
        text: '50%',
        explanation:
          'This is a generic defense frequency that does not account for the specific RFE generated by the bet size.',
      },
      {
        id: 'd',
        text: '72%',
        explanation:
          'This number is mathematically unrelated to an RFE of 38%.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Hero must call 100% \u2212 RFE% = 100% \u2212 38% = 62% of the time to make Villain indifferent to bluffing.',
    chapterReference: 'Chapter 13 — Balancing Principle 2',
  },
  {
    id: 'q-13-007',
    chapterId: 13,
    conceptIds: ['general-strategy'],
    type: 'multiple-choice',
    prompt:
      'In Hand 130, Hero calculates that 29.4% of the river betting range should be bluffs. If Hero has 16 value combos, what is the approximate number of bluff combos needed for balance?',
    options: [
      {
        id: 'a',
        text: '4 combos',
        explanation:
          'This would result in a bluff percentage of 4/(16 + 4) = 20%, which is too low.',
      },
      {
        id: 'b',
        text: '7 combos',
        explanation:
          'Using the equation X/(16+X) = 0.294 results in X \u2248 6.66, which rounds to 7 combos.',
      },
      {
        id: 'c',
        text: '16 combos',
        explanation:
          'A 1 : 1 ratio implies an RE of 50%, which is far higher than the 29.4% calculated.',
      },
      {
        id: 'd',
        text: '10 combos',
        explanation:
          'This would result in a bluff percentage of 10/(16 + 10) \u2248 38%, which is too high.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'With 29.4% bluffs and 16 value combos: X/(16+X) = 0.294 \u2192 X \u2248 6.66, rounded to 7 bluff combos for balance.',
    chapterReference: 'Chapter 13 — Hand 130 River Balance',
  },
  {
    id: 'q-13-008',
    chapterId: 13,
    conceptIds: ['general-strategy'],
    type: 'multiple-choice',
    prompt:
      "The 'Offensive/Defensive Rule' suggests playing defensively (balanced) when:",
    options: [
      {
        id: 'a',
        text: 'Hero is unsure whether or not he is likely to meet the RE on a call or RFE on a bluff.',
        explanation:
          'When info is lacking, balance provides a safe default strategy that cannot be exploited by an unknown opponent.',
      },
      {
        id: 'b',
        text: 'The pot is small and the opponent is known to be very aggressive.',
        explanation:
          "Against a known aggressive opponent, the rule suggests playing offensively/exploitatively to capitalize on their imbalances.",
      },
      {
        id: 'c',
        text: 'Hero is the pre-flop aggressor and has a significant range advantage.',
        explanation:
          "While Hero can be balanced here, the rule specifically links defensive play to a lack of information about the opponent's tendencies.",
      },
      {
        id: 'd',
        text: "Villain is known to be extremely unbalanced and unaware of Hero's range.",
        explanation:
          'This is a prime condition for offensive (exploitative) play, not defensive play.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Play defensively (balanced) when lacking information. Balance provides a safe default that cannot be exploited by an unknown opponent.',
    chapterReference: 'Chapter 13 — Offensive/Defensive Rule',
  },
  {
    id: 'q-13-009',
    chapterId: 13,
    conceptIds: ['hand-selection', 'general-strategy'],
    type: 'multiple-choice',
    prompt:
      'In Hand 131 with AsKs on a 4h3s3c9s board, why does the manual recommend checking the turn instead of betting?',
    options: [
      {
        id: 'a',
        text: "Because betting turns the hand into a bluff, sacrificing its high showdown value (SDV) and ability to check/call.",
        explanation:
          "AK has significant SDV against Villain's floats; checking allows Hero to realize that equity and protect the check/calling range.",
      },
      {
        id: 'b',
        text: 'Because the flush draw makes the hand too weak to withstand a check-raise.',
        explanation:
          'The flush draw actually adds equity, making the hand more robust, not weaker.',
      },
      {
        id: 'c',
        text: 'Because Villain is likely to fold all worse hands and call with only better hands.',
        explanation:
          "While this is often true for bluffs, the manual's primary focus here is the preservation of SDV and range protection.",
      },
      {
        id: 'd',
        text: 'To hide the strength of the nut flush draw for a river check-shove.',
        explanation:
          'The recommendation is focused on standard SDV management and balancing the check/calling range, not setting up a specific check-shove.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      "AK has significant SDV against Villain's floats. Betting turns it into a bluff, sacrificing showdown value. Checking preserves that equity and protects the check/calling range.",
    chapterReference: 'Chapter 13 — Hand 131 Turn Decision',
  },
  {
    id: 'q-13-010',
    chapterId: 13,
    conceptIds: ['general-strategy'],
    type: 'multiple-choice',
    prompt:
      "According to the 'Degrees of Exploitation,' which of the following increases the incentive to be extremely unbalanced?",
    options: [
      {
        id: 'a',
        text: 'Hero is unsure if Villain is overfolding or underfolding.',
        explanation:
          'Uncertainty is a signal to remain balanced, not to deviate into extreme exploitation.',
      },
      {
        id: 'b',
        text: 'The spot is rare and the pot is large.',
        explanation:
          'Rare, large pots offer high vacuum EV for exploitative plays with minimal risk of being counter-exploited due to the low sample size.',
      },
      {
        id: 'c',
        text: "Villain is a highly aware 'Regular' player who tracks Hero's stats.",
        explanation:
          'Against aware players, staying closer to balance is usually safer to avoid being exploited yourself.',
      },
      {
        id: 'd',
        text: 'The pot is small and the spot occurs very frequently.',
        explanation:
          "Frequent small-pot spots allow opponents to gather data and exploit Hero's imbalances more easily over time.",
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Rare, large pots maximize the incentive for extreme exploitation — high vacuum EV with minimal risk of counter-exploitation due to low sample size.',
    chapterReference: 'Chapter 13 — Degrees of Exploitation',
  },
]
