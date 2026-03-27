import type { QuizQuestion } from '@/types'

export const chapter10Questions: QuizQuestion[] = [
  {
    id: 'q-10-001',
    chapterId: 10,
    conceptIds: ['3-betting'],
    type: 'multiple-choice',
    prompt:
      'According to the manual, what are the two necessary conditions that must be met before adopting a polar 3-bet strategy?',
    options: [
      {
        id: 'a',
        text: 'Hero must have a range of exclusively suited connectors and be facing a minimum open raise.',
        explanation:
          'While suited connectors are good bluff candidates, the strategy is defined by range structure and opponent tendencies rather than specific hand types or open sizes.',
      },
      {
        id: 'b',
        text: 'Hero must be in position and the opponent must have a low Fold to 3-Bet statistic.',
        explanation:
          'Being in position is helpful, but a low Fold to 3-Bet statistic actually discourages a polar strategy in favor of a linear, value-heavy one.',
      },
      {
        id: 'c',
        text: 'Hero must be facing a 4-bet frequently and have no interest in flatting any hands.',
        explanation:
          "If Hero does not want to flat any hands, the range becomes linear by definition, as there is no 'middle' group to separate value from bluffs.",
      },
      {
        id: 'd',
        text: 'Hero must have significant fold equity and a group of hands they want to flat the open with.',
        explanation:
          "Polarity requires a gap between value and bluff ranges, which is filled by a calling range, and bluffs require the opponent to fold often enough to be profitable.",
      },
    ],
    correctOptionId: 'd',
    explanation:
      'A polar 3-bet strategy requires both significant fold equity (opponent folds enough) and a calling range that creates the gap between value and bluff hands.',
    chapterReference: 'Chapter 10 — Polar 3-Bet Conditions',
  },
  {
    id: 'q-10-002',
    chapterId: 10,
    conceptIds: ['3-betting'],
    type: 'multiple-choice',
    prompt:
      "What is the recommended benchmark for the 'Fold to PF 3-Bet After Open' statistic to justify a polar 3-betting range?",
    options: [
      {
        id: 'a',
        text: '50% or higher',
        explanation:
          'At 50%, the fold equity is high enough that bluffs with some playability and blockers can reach a break-even point or better.',
      },
      {
        id: 'b',
        text: '70% or higher',
        explanation:
          'While 70% is excellent for bluffing, the manual sets the minimum threshold for beginning a polar strategy at a lower, average level.',
      },
      {
        id: 'c',
        text: '30%',
        explanation:
          'A 30% fold frequency is considered extremely low, meaning the opponent is very stationary and bluffs will not be profitable.',
      },
      {
        id: 'd',
        text: '40%',
        explanation:
          'This frequency is still considered low and indicates an opponent who is unbalanced toward underfolding.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'A Fold to 3-Bet of 50% or higher provides enough fold equity for bluffs with playability and blockers to be profitable in a polar strategy.',
    chapterReference: 'Chapter 10 — Fold to 3-Bet Benchmark',
  },
  {
    id: 'q-10-003',
    chapterId: 10,
    conceptIds: ['3-betting', 'general-strategy'],
    type: 'multiple-choice',
    prompt:
      "When constructing a balanced polar 3-bet range, what is the primary goal regarding the opponent's 4-betting strategy?",
    options: [
      {
        id: 'a',
        text: "To make the opponent's 4-bet bluffs exactly 0EV.",
        explanation:
          "By folding at a frequency that matches the opponent's Required Fold Equity (RFE), Hero makes the opponent indifferent to bluffing.",
      },
      {
        id: 'b',
        text: 'To ensure Hero can 4-bet shove any two cards profitably.',
        explanation:
          'Balanced 3-betting focuses on the 3-betting range itself; 4-betting ranges are a separate consideration for the player facing the 4-bet.',
      },
      {
        id: 'c',
        text: 'To ensure the opponent never folds to a 3-bet.',
        explanation:
          'The goal of a polar range is to capitalize on folds; making an opponent never fold would negate the value of the bluffing portion of the range.',
      },
      {
        id: 'd',
        text: "To maximize the frequency of the opponent flatting out of position.",
        explanation:
          "While flatting happens, a balanced strategy specifically focuses on making the opponent's aggressive counter-adjustments, like 4-betting, non-profitable.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      "A balanced polar 3-bet range makes the opponent's 4-bet bluffs exactly 0EV by folding at the precise frequency that matches their RFE.",
    chapterReference: 'Chapter 10 — Balanced 3-Bet Construction',
  },
  {
    id: 'q-10-004',
    chapterId: 10,
    conceptIds: ['3-betting'],
    type: 'multiple-choice',
    prompt:
      'In a linear 3-betting strategy, how is the range typically structured?',
    options: [
      {
        id: 'a',
        text: 'It splits hands into value and bluffs, separated by a wide calling range.',
        explanation:
          'This describes a polar range, which is the direct opposite of a linear structure.',
      },
      {
        id: 'b',
        text: 'It prioritizes low suited connectors to ensure board coverage while folding big offsuit cards.',
        explanation:
          'Linear ranges prioritize raw hand strength; skipping strong hands to 3-bet weak ones would make the range polar.',
      },
      {
        id: 'c',
        text: 'It consists only of hands that can profitably call a 4-bet shove.',
        explanation:
          'A linear range includes hands Hero 3-bets for value or isolation that might still fold to a 4-bet, depending on the opponent.',
      },
      {
        id: 'd',
        text: 'It contains the best hands Hero wants to 3-bet at the top and the worst at the bottom, with no gaps.',
        explanation:
          'A linear range is a continuous block of hands from strongest to weakest, often used when fold equity is low or calling is not an option.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'A linear 3-bet range is a continuous block from strongest to weakest with no gaps — used when fold equity is low or flatting is not viable.',
    chapterReference: 'Chapter 10 — Linear 3-Bet Strategy',
  },
  {
    id: 'q-10-005',
    chapterId: 10,
    conceptIds: ['3-betting', 'position'],
    type: 'multiple-choice',
    prompt:
      'Why is it often recommended to use a linear 3-betting strategy from the Small Blind (SB)?',
    options: [
      {
        id: 'a',
        text: 'Because opponents fold significantly more often to SB 3-bets than BB 3-bets.',
        explanation:
          'Fold equity varies by player, but the structural difficulty of calling from the SB is the main reason for the linear approach.',
      },
      {
        id: 'b',
        text: 'Because it is difficult to maintain a calling range with an active player in the Big Blind who might squeeze.',
        explanation:
          "Flatting in the SB exposes Hero to being squeezed or playing out of position in a multiway pot, making '3-bet or fold' a more robust strategy.",
      },
      {
        id: 'c',
        text: 'Because the SB always receives the best pot odds to call.',
        explanation:
          'The SB actually has worse absolute pot odds than the BB and must play the rest of the hand out of position.',
      },
      {
        id: 'd',
        text: 'Because polar ranges are only effective when the effective stacks are deeper than 200BB.',
        explanation:
          'Polar ranges are effective at standard 100BB stacks; the positional disadvantage of the SB is the primary driver for linearity here.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      "The SB uses a linear 3-bet strategy because flatting exposes Hero to BB squeezes and OOP multiway pots, making '3-bet or fold' more robust.",
    chapterReference: 'Chapter 10 — SB Linear 3-Betting',
  },
  {
    id: 'q-10-006',
    chapterId: 10,
    conceptIds: ['3-betting'],
    type: 'multiple-choice',
    prompt:
      'Which type of squeeze is intended to build a pot with a strong hand where Hero is happy to be called by multiple players?',
    options: [
      {
        id: 'a',
        text: 'Isolation-Semi-Bluff Squeeze',
        explanation:
          'This is not a term defined in the source material for describing squeeze motivations.',
      },
      {
        id: 'b',
        text: 'Bluff-Bluff Squeeze',
        explanation:
          'This squeeze relies entirely on fold equity against all players in the pot.',
      },
      {
        id: 'c',
        text: 'Value-Bluff Squeeze',
        explanation:
          'This seeks to isolate a weaker player for value while forcing the stronger player (the opener) to fold.',
      },
      {
        id: 'd',
        text: 'Value-Value Squeeze',
        explanation:
          'This type of squeeze uses high-equity hands that perform well multiway or seek to extract maximum value from all opponents.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'A Value-Value Squeeze builds a pot with a premium hand that Hero is happy to play multiway, seeking maximum value from all opponents.',
    chapterReference: 'Chapter 10 — Squeeze Types',
  },
  {
    id: 'q-10-007',
    chapterId: 10,
    conceptIds: ['3-betting', 'position'],
    type: 'multiple-choice',
    prompt:
      'How should 3-bet sizing generally be adjusted when Hero is Out of Position (OOP) compared to being In Position (IP)?',
    options: [
      {
        id: 'a',
        text: "Sizing should be larger OOP to discourage the opponent from calling with their positional advantage.",
        explanation:
          "Larger sizing OOP cuts the opponent's pot odds and implied odds, which they would otherwise use to exploit their position post-flop.",
      },
      {
        id: 'b',
        text: 'Sizing should be smaller OOP to minimize the amount of money lost in a disadvantaged spot.',
        explanation:
          'Small sizing OOP makes it too easy for the opponent to call and use their position to win the pot later.',
      },
      {
        id: 'c',
        text: 'Sizing should remain exactly the same regardless of position to maintain balance.',
        explanation:
          'While balance is important within a specific spot, optimal sizing varies significantly between IP and OOP scenarios.',
      },
      {
        id: 'd',
        text: "Sizing should only increase if the opponent has a very high 'Fold to 3-Bet' statistic.",
        explanation:
          'While stats matter, the fundamental mathematical disadvantage of being OOP necessitates larger sizing as a baseline.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      "3-bet sizing should be larger OOP to cut the opponent's pot odds and implied odds, discouraging them from exploiting their positional advantage post-flop.",
    chapterReference: 'Chapter 10 — 3-Bet Sizing by Position',
  },
  {
    id: 'q-10-008',
    chapterId: 10,
    conceptIds: ['3-betting'],
    type: 'multiple-choice',
    prompt:
      "In the context of 'Hand 91' with 40BB effective stacks, why was an 8BB 3-bet considered too large against a 3BB open?",
    options: [
      {
        id: 'a',
        text: 'It gives the opponent too many implied odds to set-mine with small pairs.',
        explanation:
          'Larger sizing actually reduces implied odds; the issue here is the leverage provided to the opponent\'s 4-bet shove.',
      },
      {
        id: 'b',
        text: 'A larger size is only used when Hero wants to be called, and here Hero wants a fold.',
        explanation:
          'Sizing is balanced; the problem is the mathematical vulnerability to a 4-bet shove at this specific stack depth.',
      },
      {
        id: 'c',
        text: "It exceeds the maximum pot size allowed by the 'Grinder's Rule' for short stacks.",
        explanation:
          'There is no such rule mentioned; the reasoning is based on stack-to-pot ratios and RFE targets.',
      },
      {
        id: 'd',
        text: "It creates an RFE for the opponent to 4-bet shove that is too high, making a light 4-bet shove very profitable.",
        explanation:
          'At shallow stacks, a large 3-bet leaves a small enough remaining stack that the opponent can 4-bet shove with high fold equity and decent realization of equity.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      "At 40BB effective, an 8BB 3-bet creates too-favorable RFE for the opponent's 4-bet shove — the remaining stack is small enough that light shoves become very profitable.",
    chapterReference: 'Chapter 10 — Hand 91 Analysis',
  },
  {
    id: 'q-10-009',
    chapterId: 10,
    conceptIds: ['3-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      'What are the two primary perks Hero looks for when selecting hands for a 3-bet bluff range?',
    options: [
      {
        id: 'a',
        text: 'Blockers and Playability',
        explanation:
          "Blockers (like an Ace or King) reduce the frequency of strong hands in the opponent's range, and playability (suitedness/connectivity) helps post-flop when called.",
      },
      {
        id: 'b',
        text: 'High Implied Odds and Multiway Connectivity',
        explanation:
          'Implied odds hands like small pairs are better for calling; 3-bet bluffs prioritize fold equity and blockers.',
      },
      {
        id: 'c',
        text: 'Raw Equity and Showdown Value',
        explanation:
          'Showdown value hands are usually better kept in a calling range; bluffs use hands that would otherwise be folded.',
      },
      {
        id: 'd',
        text: 'Board Coverage and Trap Potential',
        explanation:
          'Trap potential usually refers to slow-playing strong hands, which is the opposite of 3-bet bluffing.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      "3-bet bluffs need Blockers (reducing opponent's strong hands) and Playability (suitedness/connectivity for post-flop backup when called).",
    chapterReference: 'Chapter 10 — 3-Bet Bluff Selection',
  },
  {
    id: 'q-10-010',
    chapterId: 10,
    conceptIds: ['3-betting', 'general-strategy'],
    type: 'multiple-choice',
    prompt:
      "According to the manual, what is the risk of 'overbluffing' against an opponent who folds too much?",
    options: [
      {
        id: 'a',
        text: 'It is always the correct long-term strategy and has no downside against non-professional players.',
        explanation:
          "The manual warns that even sluggish players will eventually notice patterns, hurting Hero's long-term EV.",
      },
      {
        id: 'b',
        text: "It creates an obvious hole in Hero's game that the opponent can exploit by underfolding or 4-betting more.",
        explanation:
          "The manual illustrates an 'adjustment spiral' where extreme imbalances become monuments for exploitation by aware opponents.",
      },
      {
        id: 'c',
        text: "It causes Hero's value hands to lose their expected value because the pot size increases.",
        explanation:
          'Value hands actually benefit from a wider perceived range; the risk is purely the vulnerability of the bluffing portion.',
      },
      {
        id: 'd',
        text: "It reduces Hero's 'Fold to 3-Bet' statistic, making them look like a fish.",
        explanation:
          "While it changes Hero's stats, the primary concern is the mathematical exploitability of the strategy by regs.",
      },
    ],
    correctOptionId: 'b',
    explanation:
      "Overbluffing creates an exploitable imbalance — opponents adjust by underfolding or 4-betting more, triggering an 'adjustment spiral' that erodes Hero's edge.",
    chapterReference: 'Chapter 10 — Risks of Overbluffing',
  },
]
