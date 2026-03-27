import type { QuizQuestion } from '@/types'

export const chapter12Questions: QuizQuestion[] = [
  {
    id: 'q-12-001',
    chapterId: 12,
    conceptIds: ['c-betting', 'board-texture'],
    type: 'multiple-choice',
    prompt:
      "According to the manual, what is the primary distinction between a 'Double Barrel' and a 'Delayed C-Bet'?",
    options: [
      {
        id: 'a',
        text: 'A Double Barrel involves betting both the flop and the turn, whereas a Delayed C-Bet involves checking the flop and betting the turn.',
        explanation:
          'A Double Barrel occurs when the pre-flop raiser follows a flop c-bet with a turn bet, while a Delayed C-bet occurs after a flop check.',
      },
      {
        id: 'b',
        text: 'A Double Barrel requires the initiative pre-flop, but a Delayed C-Bet does not.',
        explanation:
          'Both terms specifically refer to actions taken by the pre-flop raiser, who holds the initiative.',
      },
      {
        id: 'c',
        text: 'A Double Barrel is always for value, while a Delayed C-Bet is always a bluff.',
        explanation:
          'Both lines can be used for either value or as bluffs depending on the hand and the situation.',
      },
      {
        id: 'd',
        text: 'A Double Barrel only occurs in position, while a Delayed C-Bet only occurs out of position.',
        explanation:
          'Both actions can be taken regardless of whether the player is in or out of position.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'A Double Barrel is a flop c-bet followed by a turn bet. A Delayed C-Bet skips the flop bet and fires on the turn instead.',
    chapterReference: 'Chapter 12 — Double Barrel vs Delayed C-Bet',
  },
  {
    id: 'q-12-002',
    chapterId: 12,
    conceptIds: ['c-betting', 'board-texture'],
    type: 'multiple-choice',
    prompt:
      "When considering a turn barrel bluff against a 'Reg' (Regular), which factor is listed as 'Good' in the manual?",
    options: [
      {
        id: 'a',
        text: 'Hero has high Showdown Value (SDV).',
        explanation:
          "High SDV is actually a 'Bad' factor for bluffing because the hand might win at showdown without betting.",
      },
      {
        id: 'b',
        text: "The Villain is a 'Warring Reg'.",
        explanation:
          'Warring Regs are aggressive and ego-driven, making them less likely to fold to bluffs.',
      },
      {
        id: 'c',
        text: "The Villain has a high 'Fold to F CBet' stat.",
        explanation:
          "A high Fold to F Cbet suggests the Villain's remaining range is stronger and less likely to fold on the turn.",
      },
      {
        id: 'd',
        text: "The turn card improves Hero's perceived range.",
        explanation:
          'Regs are more likely to understand how certain cards strengthen a range and fold accordingly.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      "A turn card that improves Hero's perceived range is a 'Good' factor for bluffing against Regs, who understand range dynamics and fold accordingly.",
    chapterReference: 'Chapter 12 — Turn Barrel Bluff Factors',
  },
  {
    id: 'q-12-003',
    chapterId: 12,
    conceptIds: ['c-betting'],
    type: 'multiple-choice',
    prompt:
      "Why is it generally considered a bad idea to bluff turn cards that do not change the board texture against 'Fish'?",
    options: [
      {
        id: 'a',
        text: 'Fish tend to decide on the flop if they like their hand and rarely fold on blanks.',
        explanation:
          "Weaker players often refuse to fold if the turn doesn't look 'scary' to them or doesn't complete a perceived draw.",
      },
      {
        id: 'b',
        text: "Blanks on the turn improve the Villain's range equity more than the Hero's.",
        explanation:
          'Whether equity shifts depends on the specific hands, but the psychological refusal to fold is the key factor against Fish.',
      },
      {
        id: 'c',
        text: 'Non-texture-changing cards give Fish too many opportunities to bluff-raise.',
        explanation:
          'While some Fish are aggressive, the primary issue is their lack of folding on non-scary cards.',
      },
      {
        id: 'd',
        text: 'Fish are expert at balancing their calling ranges on safe turns.',
        explanation:
          'Fish are typically unbalanced and do not think in terms of ranges.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      "Fish decide on the flop whether they like their hand. Blank turn cards don't scare them, so they rarely fold — making bluffs on non-texture-changing turns unprofitable.",
    chapterReference: 'Chapter 12 — Bluffing Blanks vs Fish',
  },
  {
    id: 'q-12-004',
    chapterId: 12,
    conceptIds: ['c-betting', 'fold-equity'],
    type: 'multiple-choice',
    prompt:
      "If Hero bets 8 BB into a 11 BB pot on the turn as a pure bluff, what is the 'Raw Real Fold Equity' (RFE) required to break even?",
    options: [
      {
        id: 'a',
        text: '72%',
        explanation:
          'This incorrectly uses the pot size as the denominator without adding the bet size.',
      },
      {
        id: 'b',
        text: '50%',
        explanation:
          'This would be the RFE for a pot-sized bet.',
      },
      {
        id: 'c',
        text: '42%',
        explanation:
          'The formula for RFE is Risk/(Risk + Reward), which is 8/(8 + 11) \u2248 0.421.',
      },
      {
        id: 'd',
        text: '33%',
        explanation:
          'This would be the RFE for a half-pot bet, which is 1/3.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      'RFE = Risk / (Risk + Reward) = 8 / (8 + 11) \u2248 42%. Hero needs Villain to fold at least 42% of the time for this bluff to break even.',
    chapterReference: 'Chapter 12 — Turn Bluff RFE Calculation',
  },
  {
    id: 'q-12-005',
    chapterId: 12,
    conceptIds: ['c-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      'When triple-barreling on the river against a Reg, which hand is a better bluff on a Q\u2661 9\u2662 7\u2661 T\u2660 3\u2661 board?',
    options: [
      {
        id: 'a',
        text: 'A\u2662K\u2662',
        explanation:
          "While it blocks some hands, it doesn't block the flushes or straights as effectively as the A\u2661 does.",
      },
      {
        id: 'b',
        text: 'A\u2661J\u2660',
        explanation:
          'This hand blocks flushes and straights (KJ) that the Villain is unlikely to fold.',
      },
      {
        id: 'c',
        text: '8\u26635\u2663',
        explanation:
          "While it has lower absolute SDV, it doesn't block any of the hands Villain will actually call with.",
      },
      {
        id: 'd',
        text: 'Q\u2663J\u2663',
        explanation:
          'This hand has too much SDV to be turned into a bluff on this run-out.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'A\u2661J\u2660 is the best river bluff — it blocks flushes (A\u2661) and straights (KJ), reducing the combos Villain can call with.',
    chapterReference: 'Chapter 12 — River Bluff Selection',
  },
  {
    id: 'q-12-006',
    chapterId: 12,
    conceptIds: ['c-betting'],
    type: 'multiple-choice',
    prompt:
      "What is 'Reason 2' for choosing a Delayed C-Bet over an immediate flop C-Bet?",
    options: [
      {
        id: 'a',
        text: "The flop c-bet is -EV, but the Villain's flop checking range is capped.",
        explanation:
          'This describes Reason 1, where the flop bet is unprofitable due to range connectivity.',
      },
      {
        id: 'b',
        text: 'To induce a bluff from an aggressive Fish on the turn.',
        explanation:
          'Delayed c-bets are typically used to realize fold equity, not to induce bluffs with air.',
      },
      {
        id: 'c',
        text: "The flop c-bet is -EV, but the turn card makes the Hero's range stronger.",
        explanation:
          'This describes Reason 3, where the turn card specifically changes the fold equity.',
      },
      {
        id: 'd',
        text: 'To collect information against a fit-or-fold player who broadcasts their hand strength on the turn.',
        explanation:
          'Checking the flop allows Hero to see if the Villain checks again, confirming a lack of interest in the pot.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      "Reason 2 for a Delayed C-Bet is information gathering — checking the flop lets Hero see if Villain checks again, confirming weakness before betting the turn.",
    chapterReference: 'Chapter 12 — Delayed C-Bet Reasons',
  },
  {
    id: 'q-12-007',
    chapterId: 12,
    conceptIds: ['c-betting', 'board-texture'],
    type: 'multiple-choice',
    prompt:
      "In the context of 'Turn Probes', what does it mean when Hero 'Range Checks' a turn card like an A\u2661 after a J\u2660 5\u2660 7\u2660 flop?",
    options: [
      {
        id: 'a',
        text: 'Hero checks because the card completed a flush and he lacks the flush himself.',
        explanation:
          "While a flush completion is a factor, 'Range Check' is a strategic decision for the entire range, not just a specific hand type.",
      },
      {
        id: 'b',
        text: "Hero checks his entire range, regardless of hand strength, because the card significantly improves the pre-flop raiser's range.",
        explanation:
          "Certain cards, like an Ace, reset the range advantage to the pre-flop raiser, making a probe bet risky for the Hero's whole range.",
      },
      {
        id: 'c',
        text: 'Hero only checks his air hands to ensure he doesn\'t lose a big pot.',
        explanation:
          'A Range Check specifically means checking everything, including value hands, to maintain balance.',
      },
      {
        id: 'd',
        text: 'Hero checks because he has 100% equity and wants to trap.',
        explanation:
          'A Range Check is for balance and defense, not primarily for trapping with the nuts.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      "A Range Check means checking the entire range — the turn card significantly improved the pre-flop raiser's range, making probing risky for Hero's whole distribution.",
    chapterReference: 'Chapter 12 — Turn Probes and Range Checks',
  },
  {
    id: 'q-12-008',
    chapterId: 12,
    conceptIds: ['c-betting', 'position'],
    type: 'multiple-choice',
    prompt:
      "When should Hero generally favor a 'River Raising' game over a 'Turn Raising' game in position?",
    options: [
      {
        id: 'a',
        text: "When Hero wants to keep his river range strong and versatile while there is no urgent need for fold equity on the turn.",
        explanation:
          "Delaying the raise keeps Hero's range uncapped on the river and forces Villain to worry about more combinations.",
      },
      {
        id: 'b',
        text: 'When the turn card is a blank and unlikely to have helped either player.',
        explanation:
          "If the turn is a blank, Hero might raise for protection or immediate fold equity if Villain's range is capped.",
      },
      {
        id: 'c',
        text: 'When Hero has a draw with very low equity.',
        explanation:
          'Low equity draws often need to raise the turn to maximize fold equity before they miss on the river.',
      },
      {
        id: 'd',
        text: 'When Hero is against a Station Fish who will never fold a pair.',
        explanation:
          "Against a station, Hero shouldn't be bluff-raising at all, on any street.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      "Favor river raising when there's no urgent turn fold equity need — delaying keeps Hero's range uncapped and versatile, forcing Villain to worry about more combos.",
    chapterReference: 'Chapter 12 — River vs Turn Raising',
  },
  {
    id: 'q-12-009',
    chapterId: 12,
    conceptIds: ['c-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "What is the primary reason for a 'Protection Probe' with a hand like 5\u2660 5\u2663 on a 7\u2662 6\u2660 2\u2661 3\u2662 board after the raiser checks back the flop?",
    options: [
      {
        id: 'a',
        text: 'To represent a straight and force the Villain to fold a 7.',
        explanation:
          'A 7 is unlikely to fold to a single probe bet, and protection is the more immediate concern.',
      },
      {
        id: 'b',
        text: 'To build a large pot in case Hero hits a set on the river.',
        explanation:
          "With only one card to come, 'building a pot' to hit a 2-outer is mathematically poor.",
      },
      {
        id: 'c',
        text: 'To fold out overcards that have 6 outs (significant equity) against Hero\'s small pair.',
        explanation:
          'Against a fit-or-fold player, betting small pairs can win the pot immediately and prevent Villain from realizing equity with high cards.',
      },
      {
        id: 'd',
        text: 'Because 55 has high Showdown Value and Hero wants to get called by worse hands like 44.',
        explanation:
          'While it has some SDV, the bet is primarily to fold out hands that have equity against us, not to get value from worse pairs.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      'A Protection Probe with small pairs folds out overcards that have ~6 outs of equity. Against fit-or-fold players, this denies equity and wins the pot immediately.',
    chapterReference: 'Chapter 12 — Protection Probes',
  },
  {
    id: 'q-12-010',
    chapterId: 12,
    conceptIds: ['c-betting', 'general-strategy'],
    type: 'multiple-choice',
    prompt:
      "The manual states that against a 'Warring Reg', Hero should tighten his bluffing ranges. Why is this?",
    options: [
      {
        id: 'a',
        text: 'Because Hero wants to minimize variance against high-skill players.',
        explanation:
          'While it does reduce variance, the strategic reason is that their calling frequency makes bluffing -EV.',
      },
      {
        id: 'b',
        text: 'Because they only 3-bet the nuts pre-flop.',
        explanation:
          'Warring Regs are defined by high 3-bet percentages, meaning their pre-flop ranges are wide, not narrow.',
      },
      {
        id: 'c',
        text: 'Because they play a perfect GTO (Game Theory Optimal) strategy.',
        explanation:
          "The manual describes them as ego-driven and 'fighting fire with fire', which is the opposite of a balanced GTO approach.",
      },
      {
        id: 'd',
        text: 'Because they ego-call too often and are unlikely to fold to aggression.',
        explanation:
          'Warring Regs fear being bluffed and often call down with a wide portion of their range, making bluffs unprofitable.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'Warring Regs ego-call too often, fearing being bluffed. Their wide calling frequency makes bluffs unprofitable, so Hero should tighten bluffing ranges against them.',
    chapterReference: 'Chapter 12 — Bluffing Against Warring Regs',
  },
]
