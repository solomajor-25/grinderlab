import type { QuizQuestion } from '@/types'

export const chapter5Questions: QuizQuestion[] = [
  {
    id: 'q-5-001',
    chapterId: 5,
    conceptIds: ['value-betting'],
    type: 'multiple-choice',
    prompt:
      'According to the manual, what is the precise definition of a Value Bet?',
    options: [
      {
        id: 'a',
        text: "A bet made where Hero expects to have > 50% equity vs. Villain's continuing range to that bet.",
        explanation:
          'A value bet requires that the hand is a favorite against the specific subset of hands the opponent calls or raises with.',
      },
      {
        id: 'b',
        text: 'A bet made with the intention of forcing a fold from hands that have significant equity against Hero.',
        explanation:
          'This describes a bluff or a protection bet, whereas a value bet specifically seeks to be called by worse hands.',
      },
      {
        id: 'c',
        text: "A bet made where Hero expects to have > 50% equity vs. Villain's whole range on the current street.",
        explanation:
          'Value betting is not concerned with the hands the opponent folds, but rather the equity against the range that continues.',
      },
      {
        id: 'd',
        text: 'A bet made only when Hero holds the absolute nuts on any given board texture.',
        explanation:
          "Value bets can be 'thin,' meaning they are made with hands that are not the nuts but still hold more than 50% equity against a calling range.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      "A value bet is defined by having > 50% equity against Villain's continuing range — the hands that call or raise, not the ones that fold.",
    chapterReference: 'Chapter 5 — Value Bet Definition',
  },
  {
    id: 'q-5-002',
    chapterId: 5,
    conceptIds: ['value-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "Which of the following best describes 'Relative Hand Strength' as opposed to 'Absolute Hand Strength'?",
    options: [
      {
        id: 'a',
        text: 'How a hand performs against a random selection of hole cards pre-flop.',
        explanation:
          "Pre-flop raw equity is an absolute measure and does not consider the specific post-flop context or the 'continuing range' logic.",
      },
      {
        id: 'b',
        text: 'The numerical rank of a hand, such as a Jack-high straight or a Nut Flush.',
        explanation:
          "This refers to absolute hand strength, which doesn't account for board texture or opponent action.",
      },
      {
        id: 'c',
        text: 'The strength of a hand considering board texture, villain type, stack depth, and previous action.',
        explanation:
          'Relative strength determines if a hand is a value bet or a bluff-catcher based on the specific variables of the situation.',
      },
      {
        id: 'd',
        text: "The percentage of time a specific hand combination appears in a player's total range.",
        explanation:
          'This refers to range composition or frequency, not the strength of the hand in relation to the board and opponent.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      'Relative hand strength evaluates a hand in context — board texture, villain type, stack depth, and action history determine whether a hand is strong enough to value bet.',
    chapterReference: 'Chapter 5 — Relative vs Absolute Strength',
  },
  {
    id: 'q-5-003',
    chapterId: 5,
    conceptIds: ['value-betting'],
    type: 'multiple-choice',
    prompt:
      "What is the 'Exponential Mistake' in the context of value betting?",
    options: [
      {
        id: 'a',
        text: 'Over-betting the pot on the flop, which forces the opponent to fold their entire range.',
        explanation:
          "While this might lose value, the 'exponential' mistake specifically refers to the compounding effect of pot growth across streets.",
      },
      {
        id: 'b',
        text: "Miscalculating your equity against a villain who has a wide 'Went to Showdown' (WTSD) statistic.",
        explanation:
          'This is a reading error, whereas the exponential mistake is a procedural failure to build the pot size.',
      },
      {
        id: 'c',
        text: 'Betting for value when your equity against a calling range is exactly 50%.',
        explanation:
          'This is simply a neutral EV value bet, not the specific error associated with pot building described in the text.',
      },
      {
        id: 'd',
        text: 'Missing a bet or sizing too small on early streets, resulting in a significantly smaller pot on the river.',
        explanation:
          'Because the pot grows based on previous sizes, a small error on the flop leads to a much larger loss of potential value by the river.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'The Exponential Mistake occurs when Hero misses a bet or sizes too small on early streets. Because pot growth compounds, a small flop error leads to a drastically smaller river pot.',
    chapterReference: 'Chapter 5 — The Exponential Mistake',
  },
  {
    id: 'q-5-004',
    chapterId: 5,
    conceptIds: ['value-betting', 'position'],
    type: 'multiple-choice',
    prompt:
      'Hero calls a raise from the Big Blind pre-flop. On the flop, Hero checks to the pre-flop raiser. How does the manual classify this action?',
    options: [
      {
        id: 'a',
        text: 'A procedural check that should usually bypass the value betting flowchart.',
        explanation:
          'A procedural check is made by the non-aggressor to the aggressor and generally doesn\'t indicate strength or weakness.',
      },
      {
        id: 'b',
        text: 'A weak-lead check indicating that Hero has missed the flop entirely.',
        explanation:
          'The manual states that a procedural check skews the range toward neither strength nor weakness.',
      },
      {
        id: 'c',
        text: 'A mandatory check-raise setup that must be executed with all value hands.',
        explanation:
          'A procedural check is simply checking to the aggressor; the decision to raise comes after the aggressor bets.',
      },
      {
        id: 'd',
        text: 'A deceptive slowplay intended to mask the strength of a strong hand.',
        explanation:
          'Slowplaying is a deliberate choice to be passive with a strong hand; this check is a standard strategic norm.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Checking to the pre-flop raiser is a procedural check — a standard strategic norm that doesn\'t reveal hand strength and typically bypasses the value betting flowchart.',
    chapterReference: 'Chapter 5 — Procedural Checks',
  },
  {
    id: 'q-5-005',
    chapterId: 5,
    conceptIds: ['value-betting'],
    type: 'multiple-choice',
    prompt:
      "If Villain has a high 'WTSD' (Went to Showdown) stat of 35+, how should Hero adjust their strategy?",
    options: [
      {
        id: 'a',
        text: "Check more often to induce bluffs from Villain's wide range.",
        explanation:
          "High WTSD players are often passive (Fish); Hero needs to bet to build the pot since Villain won't do it.",
      },
      {
        id: 'b',
        text: 'Value bet more thinly and avoid bluffing.',
        explanation:
          'A player who refuses to fold is a prime target for getting paid off by marginal hands that still beat their wide calling range.',
      },
      {
        id: 'c',
        text: 'Fold top pair more often because Villain only goes to showdown with the nuts.',
        explanation:
          'This would be the adjustment for a very low WTSD (nit), not a high WTSD player.',
      },
      {
        id: 'd',
        text: 'Bluff more frequently because Villain is likely to be weak.',
        explanation:
          "High WTSD players are 'calling stations' who rarely fold, making bluffing a low EV play.",
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Against high WTSD players (35+), Hero should value bet more thinly to extract max value from their wide calling range, and avoid bluffing since they rarely fold.',
    chapterReference: 'Chapter 5 — WTSD Adjustments',
  },
  {
    id: 'q-5-006',
    chapterId: 5,
    conceptIds: ['value-betting'],
    type: 'multiple-choice',
    prompt:
      'Under what condition does the manual suggest slowplaying is viable on a dry board?',
    options: [
      {
        id: 'a',
        text: 'Only when Hero is out of position against a very passive Fish.',
        explanation:
          "Checking to a passive fish usually results in a 'stagnant' pot; slowplaying is better against aggressive villains who will bet for you.",
      },
      {
        id: 'b',
        text: "When the board is 'wet' (highly coordinated) to prevent Villain from folding draws.",
        explanation:
          "Wet boards are poor candidates for slowplaying because free cards can easily kill Hero's action or beat Hero's hand.",
      },
      {
        id: 'c',
        text: 'When the pot is already huge and no further building is required.',
        explanation:
          'The manual emphasizes that even in large pots, value betting is often superior to checking if no higher EV line exists.',
      },
      {
        id: 'd',
        text: 'When the effective stack is short enough that all money can still get in over fewer streets.',
        explanation:
          "If the stack-to-pot ratio is low, Hero has a 'spare' street to check and induce bluffs without missing out on stacking the opponent.",
      },
    ],
    correctOptionId: 'd',
    explanation:
      'Slowplaying on a dry board is viable when the SPR is low enough that all the money can still get in over fewer betting streets, giving Hero a spare street to induce.',
    chapterReference: 'Chapter 5 — Slowplaying Conditions',
  },
  {
    id: 'q-5-007',
    chapterId: 5,
    conceptIds: ['value-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "What does it mean to 'Crush the Deck' in the context of choosing to check a strong hand?",
    options: [
      {
        id: 'a',
        text: 'Hero has successfully bluffed Villain multiple times in a single session.',
        explanation:
          "This is a psychological or 'meta-game' state, not the technical term used for range blockers.",
      },
      {
        id: 'b',
        text: "Hero has a high 'Aggression Factor' and is currently winning most pots.",
        explanation:
          "Aggression factor is a HUD stat, whereas 'crushing the deck' refers to specific card combinations.",
      },
      {
        id: 'c',
        text: 'Hero has made a hand that is so strong it cannot be beaten by any turn or river card.',
        explanation:
          "While related, having the nuts is not the same as 'crushing the deck,' which specifically refers to blocking the opponent's calling range.",
      },
      {
        id: 'd',
        text: "Hero's hole cards make it statistically unlikely that Villain has a strong enough hand to call a bet.",
        explanation:
          'By holding key blockers (e.g., holding two Queens on a Q-8-8 board), Hero makes it very hard for the opponent to have a hand they can continue with.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      "Crushing the deck means Hero's hole cards block the opponent's potential calling range, making it unlikely Villain has a hand strong enough to continue.",
    chapterReference: 'Chapter 5 — Crushing the Deck',
  },
  {
    id: 'q-5-008',
    chapterId: 5,
    conceptIds: ['value-betting'],
    type: 'multiple-choice',
    prompt:
      "Why is thin value betting more feasible against a 'Capped Range'?",
    options: [
      {
        id: 'a',
        text: "Because Villain's previous actions (like checking the turn) have excluded the strongest possible hands from their range.",
        explanation:
          "When Villain is unlikely to have the nuts, Hero's marginal hands are 'best' more often when called.",
      },
      {
        id: 'b',
        text: "Because a capped range indicates that Villain is a 'Fish' who will call with any two cards.",
        explanation:
          'Capping a range is a result of action (lines taken), not necessarily player type, though Regs are easier to cap.',
      },
      {
        id: 'c',
        text: 'Because a capped range is mathematically guaranteed to fold to any bet larger than half-pot.',
        explanation:
          'Capped ranges call quite often; they simply lack the absolute strongest hands that would beat Hero.',
      },
      {
        id: 'd',
        text: "Because it allows Hero to bet much larger to maximize the 'Exponential Mistake'.",
        explanation:
          'Thin value betting usually requires careful sizing; the exponential mistake is about pot building, not range capping.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      "A capped range has had its strongest hands excluded by Villain's previous actions, making Hero's marginal hands winners more often when called.",
    chapterReference: 'Chapter 5 — Thin Value vs Capped Ranges',
  },
  {
    id: 'q-5-009',
    chapterId: 5,
    conceptIds: ['value-betting'],
    type: 'multiple-choice',
    prompt:
      "Which river line is most suitable when Villain's betting range is weaker than their calling range?",
    options: [
      {
        id: 'a',
        text: 'Check/Fold',
        explanation:
          "Check/folding is used when Villain's betting range is too strong to call and Hero cannot value bet.",
      },
      {
        id: 'b',
        text: 'Bet/Fold',
        explanation:
          'Bet/folding is better when Villain calls with many worse hands but only raises with better hands.',
      },
      {
        id: 'c',
        text: 'Check/Call',
        explanation:
          'If Villain will fold worse hands to a bet but bet those same hands (or bluffs) if checked to, Hero gains more by bluff-catching.',
      },
      {
        id: 'd',
        text: 'Overbet Shove',
        explanation:
          "This sizing usually polarizes ranges and is unlikely to be the optimal line if Villain's betting range is weak.",
      },
    ],
    correctOptionId: 'c',
    explanation:
      "When Villain's betting range is weaker than their calling range, Check/Call captures value from bluffs and weak bets that would fold to a Hero bet.",
    chapterReference: 'Chapter 5 — River Lines',
  },
  {
    id: 'q-5-010',
    chapterId: 5,
    conceptIds: ['value-betting'],
    type: 'multiple-choice',
    prompt:
      "In the 'EV Gain of a Value Bet' calculation, if Hero bets 20BB and gets called 40% of the time with 100% equity, what is the Overall EV Gain?",
    options: [
      {
        id: 'a',
        text: '+7BB',
        explanation:
          '7BB was the example result for a 7BB bet with a 100% call frequency.',
      },
      {
        id: 'b',
        text: '+8BB',
        explanation:
          'The calculation is 20 (EV Gain when called) \u00d7 0.40 (Call frequency) = 8.',
      },
      {
        id: 'c',
        text: '+20BB',
        explanation:
          '20BB is the EV gain when called, but the overall gain must account for the 60% of the time Villain folds.',
      },
      {
        id: 'd',
        text: '+5BB',
        explanation:
          '5BB would be the result if the call frequency was 25% or the bet size was smaller.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Overall EV Gain = EV when called \u00d7 call frequency = 20BB \u00d7 0.40 = +8BB.',
    chapterReference: 'Chapter 5 — EV Gain Calculation',
  },
  {
    id: 'q-5-011',
    chapterId: 5,
    conceptIds: ['value-betting'],
    type: 'multiple-choice',
    prompt:
      "When facing a 'Fish' with an 'Inelastic' calling range, how should Hero size their value bets?",
    options: [
      {
        id: 'a',
        text: 'Use a large size because the Fish is likely to call with the same range regardless of the price.',
        explanation:
          "Inelasticity means the 'Width of Calling Range' doesn't shrink much as 'Bet Size' increases, allowing for maximum value extraction.",
      },
      {
        id: 'b',
        text: "Use a small size to ensure the Fish doesn't fold their marginal pairs.",
        explanation:
          "This is 'milking syndrome'; an inelastic range calls the same hands regardless of sizing, so Hero loses money by sizing small.",
      },
      {
        id: 'c',
        text: "Check behind to avoid 'blowing them out of the pot'.",
        explanation:
          'Checking behind misses value entirely, which is the opposite of the goal against a stationy Fish.',
      },
      {
        id: 'd',
        text: "Size exactly the same as against a Regular to remain 'balanced'.",
        explanation:
          "The manual suggests varying size based on hand strength against Fish, as they aren't observant enough to exploit the imbalance.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      "Against inelastic calling ranges, Hero should size large because the Fish calls with the same hands regardless of price, maximizing value extraction.",
    chapterReference: 'Chapter 5 — Inelastic Calling Ranges',
  },
]
