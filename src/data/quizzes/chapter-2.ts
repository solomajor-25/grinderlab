import type { QuizQuestion } from '@/types'

export const chapter2Questions: QuizQuestion[] = [
  {
    id: 'q-2-001',
    chapterId: 2,
    conceptIds: ['hand-selection'],
    type: 'multiple-choice',
    prompt:
      'According to the source material, which attribute is considered the most important when rating a starting hand for a 100BB deep cash game?',
    options: [
      {
        id: 'a',
        text: 'Good Pair Potential',
        explanation:
          'Strong one-pair hands occur frequently and win a large percentage of the time, making this the dominant factor for most stack sizes.',
      },
      {
        id: 'b',
        text: 'Nut Potential',
        explanation:
          "While significant for winning huge pots, hands that make the 'nuts' occur much less frequently than hands that make strong pairs.",
      },
      {
        id: 'c',
        text: 'Versatility',
        explanation:
          'Versatility increases the number of favorable boards but is secondary to the raw strength of frequently making best-pair hands.',
      },
      {
        id: 'd',
        text: 'Post-Flop Fold Equity',
        explanation:
          'This is a situational factor related to opponent tendencies rather than an inherent attribute of the starting hand itself.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Good Pair Potential (GPP) is the most important attribute at 100BB because strong one-pair hands occur frequently and win the majority of pots at this stack depth.',
    chapterReference: 'Chapter 2 — Starting Hand Attributes',
  },
  {
    id: 'q-2-002',
    chapterId: 2,
    conceptIds: ['position'],
    type: 'multiple-choice',
    prompt:
      'If you are playing at a 4-handed table, what is the position of the first player to act before the flop?',
    options: [
      {
        id: 'a',
        text: 'The Cut-Off (CO)',
        explanation:
          'Positions are always defined in relation to the button; the seat before the button is the CO regardless of how many players are at the table.',
      },
      {
        id: 'b',
        text: 'The Hi-Jack (HJ)',
        explanation:
          'The HJ is two seats before the button, which would be the seat following the first actor in a 4-handed game.',
      },
      {
        id: 'c',
        text: 'Under The Gun (UTG)',
        explanation:
          'UTG is defined specifically as three seats before the button, which does not exist on a table with only four players.',
      },
      {
        id: 'd',
        text: 'The Button (BU)',
        explanation:
          'The button is the last position to act before the blinds and acts last on every post-flop street.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'At a 4-handed table, positions are defined relative to the button. The CO is the seat directly before the button and is the first to act preflop.',
    chapterReference: 'Chapter 2 — Table Positions',
  },
  {
    id: 'q-2-003',
    chapterId: 2,
    conceptIds: ['open-raising', 'position'],
    type: 'multiple-choice',
    prompt:
      'What is the primary reason for opening a pot from Under The Gun (UTG) in a 6-max game?',
    options: [
      {
        id: 'a',
        text: 'To build a pot for value and thin the field',
        explanation:
          'With five opponents left to act, the primary goal is to extract value from a strong range and reduce the number of players seeing the flop.',
      },
      {
        id: 'b',
        text: 'To steal the blinds and antes',
        explanation:
          "UTG is not typically a 'steal' spot because the probability of all five remaining opponents folding is relatively low compared to later positions.",
      },
      {
        id: 'c',
        text: 'To implement a wide semi-bluffing strategy',
        explanation:
          'Opening a wide range UTG makes Hero vulnerable to being dominated or facing frequent 3-bets from players in position.',
      },
      {
        id: 'd',
        text: 'To capitalize on high fold equity',
        explanation:
          'Fold equity is at its lowest in early position because of the number of players yet to act.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'From UTG with five opponents behind, the goal is value-oriented: build a pot with strong hands and thin the field to reduce multiway complexity.',
    chapterReference: 'Chapter 2 — UTG Opening Strategy',
  },
  {
    id: 'q-2-004',
    chapterId: 2,
    conceptIds: ['open-raising', 'position'],
    type: 'multiple-choice',
    prompt:
      'Calculate the combined probability that all remaining opponents fold to an UTG open if each opponent plays a 15% range (meaning they fold 85% of the time).',
    options: [
      {
        id: 'a',
        text: 'Approximately 44.4%',
        explanation:
          'The combined probability is calculated as 0.85 \u00d7 0.85 \u00d7 0.85 \u00d7 0.85 \u00d7 0.85, which equals roughly 0.4437.',
      },
      {
        id: 'b',
        text: 'Approximately 25%',
        explanation:
          'This is significantly lower than the result of multiplying five high-probability independent events.',
      },
      {
        id: 'c',
        text: 'Approximately 52.7%',
        explanation:
          'This value represents the probability if opponents fold 88% of the time, not 85%.',
      },
      {
        id: 'd',
        text: 'Approximately 75%',
        explanation:
          'This would imply opponents are folding at a much higher individual frequency than the 85% specified.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'With five opponents each folding 85% independently, the chance all fold is 0.85^5 \u2248 44.4%.',
    chapterReference: 'Chapter 2 — Fold Probability Calculations',
  },
  {
    id: 'q-2-005',
    chapterId: 2,
    conceptIds: ['hand-selection'],
    type: 'multiple-choice',
    prompt:
      "In the context of HUD statistics, what does a large gap between a player's VPIP and PFR (e.g., 45/11) typically indicate?",
    options: [
      {
        id: 'a',
        text: "A 'Nit' who folds too much",
        explanation:
          'Nits typically have low VPIP and PFR numbers that are close together, such as 12/10.',
      },
      {
        id: 'b',
        text: 'A weak, passive player',
        explanation:
          'A large disparity suggests the player calls much more often than they raise, which is a hallmark of passive play.',
      },
      {
        id: 'c',
        text: "An aggressive 'Reg'",
        explanation:
          'Regulars strive for a small gap between VPIP and PFR to remain aggressive and difficult to play against.',
      },
      {
        id: 'd',
        text: "An 'Aggro Fish'",
        explanation:
          'Aggro Fish typically have high numbers for both VPIP and PFR, such as 41/36.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'A large VPIP-PFR gap (e.g. 45/11) means the player calls far more than they raise, which is the defining trait of a weak, passive player.',
    chapterReference: 'Chapter 2 — HUD Stats and Player Types',
  },
  {
    id: 'q-2-006',
    chapterId: 2,
    conceptIds: ['hand-selection', 'open-raising'],
    type: 'multiple-choice',
    prompt:
      'Which hand is cited as a more profitable UTG open in a 100BB cash game than ATo, and for what primary reason?',
    options: [
      {
        id: 'a',
        text: '22, due to set-mining value',
        explanation:
          'Small pairs like 22 are usually dynamic opens against fish and not standard UTG opens due to poor pair potential on most boards.',
      },
      {
        id: 'b',
        text: 'T9s, due to higher nut potential and versatility',
        explanation:
          'While ATo has higher raw high-card value, T9s performs better post-flop because it makes unique pairs and strong draws more effectively.',
      },
      {
        id: 'c',
        text: 'KJo, due to better blocker effects',
        explanation:
          "KJo suffers from similar 'domination' issues as ATo and is generally excluded from tight UTG ranges.",
      },
      {
        id: 'd',
        text: 'A2s, due to nut flush potential',
        explanation:
          'Low suited aces are dynamic additions for hunting fish rather than standard UTG value opens.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'T9s outperforms ATo from UTG because it makes unique pairs, strong draws, and has superior nut potential and versatility post-flop.',
    chapterReference: 'Chapter 2 — Hand Comparison: T9s vs ATo',
  },
  {
    id: 'q-2-007',
    chapterId: 2,
    conceptIds: ['open-raising', 'stealing'],
    type: 'multiple-choice',
    prompt:
      'What is the recommended default open-sizing for the Cut-Off (CO) position?',
    options: [
      {
        id: 'a',
        text: '3x',
        explanation:
          'While used in earlier positions to thin the field, this size is less optimal for pure steal attempts in the CO.',
      },
      {
        id: 'b',
        text: '4x',
        explanation:
          "This size is generally only used as a dynamic adjustment against weak players (Fish) who call too wide.",
      },
      {
        id: 'c',
        text: '2.5x',
        explanation:
          'As the strategy shifts toward stealing, a smaller size provides a better risk-to-reward ratio for taking down the blinds.',
      },
      {
        id: 'd',
        text: '2x',
        explanation:
          'A 2x open is typically reserved for the Button, where Hero is guaranteed position post-flop.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      'The CO default is 2.5x because the strategy tilts toward stealing and a smaller size offers better risk-to-reward.',
    chapterReference: 'Chapter 2 — CO Opening Sizing',
  },
  {
    id: 'q-2-008',
    chapterId: 2,
    conceptIds: ['stealing', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "If the Button (BU) is a 'Nit' who rarely flats or 3-bets, how should the Hero in the Cut-Off (CO) adjust their strategy?",
    options: [
      {
        id: 'a',
        text: 'Increase sizing to 4x to force folds',
        explanation:
          'Against a Nit who is already folding, increasing size only worsens the risk/reward ratio unnecessarily.',
      },
      {
        id: 'b',
        text: "Treat the CO as a 'pseudo-Button' and open a much wider range",
        explanation:
          'If the player in position (BU) folds frequently, the CO effectively gains the benefits of the Button position more often.',
      },
      {
        id: 'c',
        text: "Switch to a 'Limping' strategy",
        explanation:
          'Limping is not recommended as a default strategy for opening the pot in the Grinder\'s Manual.',
      },
      {
        id: 'd',
        text: 'Tighten the CO range to avoid being trapped',
        explanation:
          'Nits are the least likely players to trap; their tightness provides an opportunity to steal more frequently.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'A nitty BU effectively gives the CO positional advantage, so Hero should widen their opening range to exploit the extra fold equity.',
    chapterReference: 'Chapter 2 — Exploiting Tight Opponents',
  },
  {
    id: 'q-2-009',
    chapterId: 2,
    conceptIds: ['stealing', 'open-raising'],
    type: 'multiple-choice',
    prompt:
      'Using the formula RFE = R/(R + PG), calculate the Required Fold Equity for a 3x steal from the Small Blind.',
    options: [
      {
        id: 'a',
        text: '62.5%',
        explanation:
          'Hero risks 2.5 additional BBs (since 0.5 is already posted) to win 1.5 BBs (0.5 SB + 1.0 BB). 2.5/(2.5 + 1.5) = 2.5/4.0 = 0.625.',
      },
      {
        id: 'b',
        text: '50%',
        explanation:
          'This would only be true if the risk and potential gain were equal.',
      },
      {
        id: 'c',
        text: '75%',
        explanation:
          'This would imply a much larger risk relative to the potential gain.',
      },
      {
        id: 'd',
        text: '57%',
        explanation:
          'This is the RFE for a 2.5x open, not a 3x open.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'From the SB, a 3x open risks 2.5BB extra to win 1.5BB in the pot. RFE = 2.5 / (2.5 + 1.5) = 62.5%.',
    chapterReference: 'Chapter 2 — Required Fold Equity',
  },
  {
    id: 'q-2-010',
    chapterId: 2,
    conceptIds: ['open-raising', 'stealing'],
    type: 'multiple-choice',
    prompt:
      'Why does a Hero need less fold equity than the calculated RFE suggests to make an open profitable in practice?',
    options: [
      {
        id: 'a',
        text: 'Because RFE ignores post-flop profit and equity realization',
        explanation:
          'Even if the opponent calls, Hero can still win by making a hand, outplaying the opponent, or utilizing post-flop fold equity.',
      },
      {
        id: 'b',
        text: 'Because the Big Blind is forced to fold 50% of the time',
        explanation:
          'The Big Blind is never mathematically forced to fold; their range depends entirely on their strategy.',
      },
      {
        id: 'c',
        text: 'Because most players 3-bet too much',
        explanation:
          'Excessive 3-betting would actually increase the amount of fold equity Hero requires to open light.',
      },
      {
        id: 'd',
        text: 'Because the Small Blind always acts last post-flop',
        explanation:
          'The Small Blind is actually out of position for the rest of the hand against the Big Blind.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'RFE only measures the break-even point for an immediate steal. In practice, Hero also profits when called by making hands, bluffing post-flop, and realizing equity.',
    chapterReference: 'Chapter 2 — RFE in Practice',
  },
  {
    id: 'q-2-011',
    chapterId: 2,
    conceptIds: ['stealing'],
    type: 'multiple-choice',
    prompt:
      "The 'Fold to F Cbet' stat helps Hero decide to steal wider pre-flop. A value of 70% for this stat is interpreted as:",
    options: [
      {
        id: 'a',
        text: 'Average - the player has a balanced defense',
        explanation:
          'Average values typically fall between 45-55%.',
      },
      {
        id: 'b',
        text: 'Extreme - the player is regularly folding strong hands on the flop',
        explanation:
          "A 70%+ fold rate indicates a player who is overly 'fit-or-fold' and can be exploited by frequent continuation bets.",
      },
      {
        id: 'c',
        text: 'Very Low - the player refuses to fold even bad holdings',
        explanation:
          'Low values (e.g., 0-30%) indicate a player who calls or raises too much post-flop.',
      },
      {
        id: 'd',
        text: 'Low - the player is very call and raise happy',
        explanation:
          'Low fold rates mean the player is continuing with a wide range, not folding.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      "A Fold to F Cbet of 70% is extreme and signals a fit-or-fold player who can be exploited with frequent c-bets.",
    chapterReference: 'Chapter 2 — HUD Stats for Stealing',
  },
  {
    id: 'q-2-012',
    chapterId: 2,
    conceptIds: ['stealing', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      'When considering Factor 4 (Awareness) in steal situations, why might Hero fold a vacuum +EV hand like 82o on the Button?',
    options: [
      {
        id: 'a',
        text: 'Because the RFE is higher for weak hands',
        explanation:
          'RFE is a mathematical constant based on sizing; hand strength determines how much we can deviate from it.',
      },
      {
        id: 'b',
        text: 'Because the pot odds are poor for the Button',
        explanation:
          'The Button has the best positional advantage and does not face pot odds when deciding to open an unopened pot.',
      },
      {
        id: 'c',
        text: 'Because 82o has too much nut potential',
        explanation:
          '82o has virtually no nut potential and is a pure steal hand.',
      },
      {
        id: 'd',
        text: 'To protect future fold equity against thinking players',
        explanation:
          'Opening 100% of hands against aware players will cause them to adjust by calling and 3-betting more, making future opens less profitable.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'Against thinking opponents, opening 100% erodes future fold equity. Folding marginal hands preserves credibility for future steals.',
    chapterReference: 'Chapter 2 — Awareness Factor in Stealing',
  },
  {
    id: 'q-2-013',
    chapterId: 2,
    conceptIds: ['position', 'open-raising'],
    type: 'multiple-choice',
    prompt:
      'What is the primary difference in opening from the Small Blind (SB) compared to the Button (BU)?',
    options: [
      {
        id: 'a',
        text: 'The SB has more opponents to fold through',
        explanation:
          'The SB only has one opponent (the BB), whereas the BU has two (SB and BB).',
      },
      {
        id: 'b',
        text: 'The SB should use a 2x open size as default',
        explanation:
          'The manual recommends 2.5x for SB to discourage the BB from defending too wide in position.',
      },
      {
        id: 'c',
        text: 'The SB has higher fold equity naturally',
        explanation:
          'While there is only one player to fold, that player is in position and therefore more incentivized to defend.',
      },
      {
        id: 'd',
        text: 'The SB will be out of position for the duration of the hand',
        explanation:
          'The Big Blind has position on the Small Blind on every street post-flop, making it harder for the SB to realize equity.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'The key disadvantage of the SB is being out of position against the BB for every post-flop street, making equity realization harder.',
    chapterReference: 'Chapter 2 — SB vs BU Opening',
  },
  {
    id: 'q-2-014',
    chapterId: 2,
    conceptIds: ['hand-selection'],
    type: 'multiple-choice',
    prompt:
      'If the effective stack sizes were to become much shallower (e.g., 20BB), how would the importance of Good Pair Potential (GPP) change?',
    options: [
      {
        id: 'a',
        text: 'It becomes equal to Versatility',
        explanation:
          'Versatility is less useful when there is less room for post-flop maneuvering due to short stacks.',
      },
      {
        id: 'b',
        text: 'It becomes a totally dominating factor',
        explanation:
          'With shallow stacks, a good pair is often sufficient to commit all the money, making nut potential less relevant.',
      },
      {
        id: 'c',
        text: 'It becomes less important than Nut Potential',
        explanation:
          'Nut potential (like hitting a set) is more important with deep stacks where you need the best hand to win 100BB+.',
      },
      {
        id: 'd',
        text: 'It remains exactly as important as in 100BB games',
        explanation:
          'Attribute importance shifts significantly based on the stack-to-pot ratio.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'At shallow stacks (20BB), GPP becomes totally dominant because a strong pair is often enough to commit your entire stack.',
    chapterReference: 'Chapter 2 — Stack Depth and Hand Attributes',
  },
  {
    id: 'q-2-015',
    chapterId: 2,
    conceptIds: ['stealing', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "Which of the following describes a 'Reg' who folds too much from the blinds and can be exploited by min-opens?",
    options: [
      {
        id: 'a',
        text: 'Passive Whale',
        explanation:
          'Whales typically call a very high percentage of hands (VPIP) and rarely fold pre-flop.',
      },
      {
        id: 'b',
        text: 'Aggro Fish',
        explanation:
          'Aggro Fish are more likely to raise or call wide than to fold frequently.',
      },
      {
        id: 'c',
        text: 'Standard Reg',
        explanation:
          'A standard reg typically defends at a frequency that makes 2x steals only marginally profitable.',
      },
      {
        id: 'd',
        text: 'Semi-Nit',
        explanation:
          "Semi-nits or Nits have high 'Fold vs Open' stats and do not defend their blinds aggressively enough.",
      },
    ],
    correctOptionId: 'd',
    explanation:
      "Semi-Nits have excessively high fold-to-open stats from the blinds, making them profitable targets for min-open steals.",
    chapterReference: 'Chapter 2 — Exploiting Blind Defenders',
  },
]
