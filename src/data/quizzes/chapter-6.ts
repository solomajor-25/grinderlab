import type { QuizQuestion } from '@/types'

export const chapter6Questions: QuizQuestion[] = [
  {
    id: 'q-6-001',
    chapterId: 6,
    conceptIds: ['calling', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "According to the 'Gap Concept' presented in the text, how should a player's calling range compare to their opening range from the same position?",
    options: [
      {
        id: 'a',
        text: 'The calling range should be stronger than the range the player would use to open.',
        explanation:
          'Since the opener has already narrowed their range by raising, the caller needs a stronger selection of hands to compete effectively without the initiative.',
      },
      {
        id: 'b',
        text: 'The calling range should be wider to take advantage of pot odds.',
        explanation:
          'While pot odds are important, calling an open requires a range that can stand up to a range that has already shown strength by opening.',
      },
      {
        id: 'c',
        text: 'The ranges should be identical to maintain a balanced strategy.',
        explanation:
          'This ignores the fact that the pre-flop raiser has the initiative and an uncapped range, putting the caller at a disadvantage.',
      },
      {
        id: 'd',
        text: 'The calling range should be composed primarily of speculative hands like suited connectors.',
        explanation:
          'While suited connectors are part of a calling range, the Gap Concept specifically addresses the overall strength required to face an open.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'The Gap Concept states that a player needs a stronger hand to call an open than to open themselves, since the raiser has already shown strength and holds the initiative.',
    chapterReference: 'Chapter 6 — The Gap Concept',
  },
  {
    id: 'q-6-002',
    chapterId: 6,
    conceptIds: ['3-betting'],
    type: 'multiple-choice',
    prompt:
      "What is the specific definition of a 'Squeeze' in the context of pre-flop play?",
    options: [
      {
        id: 'a',
        text: 'A 4-bet made to counter a 3-bet bluff.',
        explanation:
          'This is referred to as a cold 4-bet or a 4-bet bluff, occurring later in the pre-flop betting sequence.',
      },
      {
        id: 'b',
        text: "A large opening raise designed to 'squeeze' the blinds out of the pot.",
        explanation:
          "This is simply an aggressive open-raise or 'steal' attempt, not a squeeze.",
      },
      {
        id: 'c',
        text: 'A 3-bet made against a single open-raiser to force a fold.',
        explanation:
          'This describes a standard 3-bet; a squeeze specifically involves more than one opponent already in the pot.',
      },
      {
        id: 'd',
        text: 'A 3-bet made after one or more players have already called an initial open.',
        explanation:
          "Squeezing leverages the fact that callers often have 'capped' ranges, making them more likely to fold to significant aggression.",
      },
    ],
    correctOptionId: 'd',
    explanation:
      'A squeeze is a 3-bet made when one or more players have already called an open, exploiting the fact that callers have capped ranges and are likely to fold.',
    chapterReference: 'Chapter 6 — The Squeeze',
  },
  {
    id: 'q-6-003',
    chapterId: 6,
    conceptIds: ['3-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "Why might a hand like AQo be a better 'call' than a '3-bet' against a tight UTG opening range?",
    options: [
      {
        id: 'a',
        text: "3-betting AQo is always a mistake regardless of the opponent's position.",
        explanation:
          'The text notes that vs. wider ranges (like the Button), AQo may become a clear value 3-bet.',
      },
      {
        id: 'b',
        text: "Because it doesn't have enough equity to win at showdown.",
        explanation:
          'AQo has significant showdown value, but its value changes based on the range it is facing.',
      },
      {
        id: 'c',
        text: '3-betting may fold out all the hands Hero dominates and only get called by hands that crush Hero.',
        explanation:
          'If Villain only continues with [AK, QQ+], AQo turns from a value-heavy calling hand into a low-equity bluff.',
      },
      {
        id: 'd',
        text: 'Calling is preferred to keep the pot small for pot control.',
        explanation:
          "While pot control is a concept, the primary reason here is the composition of Villain's continuing range versus their opening range.",
      },
    ],
    correctOptionId: 'c',
    explanation:
      'Against a tight UTG range, 3-betting AQo folds out dominated hands and only gets action from hands that crush it (AK, QQ+), making a flat call superior.',
    chapterReference: 'Chapter 6 — Calling vs 3-Betting',
  },
  {
    id: 'q-6-004',
    chapterId: 6,
    conceptIds: ['calling'],
    type: 'multiple-choice',
    prompt:
      "What does the term 'Reverse Implied Odds' refer to in the source material?",
    options: [
      {
        id: 'a',
        text: 'Winning a small pot now versus a large pot later.',
        explanation:
          'This is a vague description of pot control rather than a specific odds calculation.',
      },
      {
        id: 'b',
        text: 'Situations where Hero stands to lose the pot and subsequent bets even when he connects well with the flop.',
        explanation:
          'This typically occurs with dominated hands, like KJo on a K-high flop against AK.',
      },
      {
        id: 'c',
        text: 'The potential to win a large pot if Hero hits an unlikely draw.',
        explanation:
          'This describes standard implied odds, not reverse implied odds.',
      },
      {
        id: 'd',
        text: 'The odds of Villain folding to a continuation bet after Hero has called pre-flop.',
        explanation:
          'Reverse implied odds concern the money lost when hands are made, not fold equity.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Reverse implied odds describe situations where Hero loses additional bets even when connecting with the board, typically due to domination (e.g., KJ vs AK on a K-high flop).',
    chapterReference: 'Chapter 6 — Reverse Implied Odds',
  },
  {
    id: 'q-6-005',
    chapterId: 6,
    conceptIds: ['calling'],
    type: 'multiple-choice',
    prompt:
      "According to the 'Set Mining Rule,' how much does Hero need to expect to make on average when he flops a set for the call to be profitable?",
    options: [
      {
        id: 'a',
        text: '5\u00d7 his pre-flop investment.',
        explanation:
          'Given that a set only flops about 1/9 of the time, 5\u00d7 would not cover the losses from the other 8 times.',
      },
      {
        id: 'b',
        text: '20\u00d7 his pre-flop investment.',
        explanation:
          "While more is better, the 'rule' established in the text as a baseline for profitability is lower.",
      },
      {
        id: 'c',
        text: '10\u00d7 his pre-flop investment.',
        explanation:
          "Rounding the 1/9 frequency to 1/10 provides a safe margin for profit, rake, and rare 'set-over-set' losses.",
      },
      {
        id: 'd',
        text: '100\u00d7 his pre-flop investment.',
        explanation:
          'This would require winning an entire stack every time you hit a set, which is unrealistic.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      'The Set Mining Rule requires Hero to expect 10\u00d7 their pre-flop investment when flopping a set, providing a safe margin given the ~1/9 flop frequency.',
    chapterReference: 'Chapter 6 — The Set Mining Rule',
  },
  {
    id: 'q-6-006',
    chapterId: 6,
    conceptIds: ['calling'],
    type: 'multiple-choice',
    prompt:
      'What is the calculated probability of flopping a set (or quads) when holding a pocket pair?',
    options: [
      {
        id: 'a',
        text: '8.5%',
        explanation:
          'This is too low; the math of combined negative probability results in a higher percentage.',
      },
      {
        id: 'b',
        text: '15.2%',
        explanation:
          'This is higher than the actual mathematical probability for three flop cards.',
      },
      {
        id: 'c',
        text: '11.8%',
        explanation:
          'Calculated by subtracting the chance of not hitting a set on three cards (88.2%) from 100%.',
      },
      {
        id: 'd',
        text: '22.4%',
        explanation:
          'This is roughly the probability of hitting a set by the river, not just on the flop.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      'The probability of flopping a set or quads with a pocket pair is 11.8%, calculated from the complement of missing on all three flop cards.',
    chapterReference: 'Chapter 6 — Set Mining Mathematics',
  },
  {
    id: 'q-6-007',
    chapterId: 6,
    conceptIds: ['calling', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "Which of the following describes the 'Small Pocket Pair Curse'?",
    options: [
      {
        id: 'a',
        text: 'When a small pair misses the flop, it only has two outs to improve, but when ahead, the opponent usually has at least six outs against it.',
        explanation:
          'This asymmetry makes small pairs difficult to play post-flop without hitting a set, as they are easily outdrawn or already beaten.',
      },
      {
        id: 'b',
        text: 'Small pairs are more likely to be folded to a squeeze than larger pairs.',
        explanation:
          "While true, this is a pre-flop positional disadvantage, not the specific 'curse' related to post-flop outs.",
      },
      {
        id: 'c',
        text: 'The inability to ever win a pot without reaching showdown.',
        explanation:
          "This is a general lack of fold equity, not the specific definition provided for the 'curse'.",
      },
      {
        id: 'd',
        text: "Small pairs are more frequently dominated by the 'set-over-set' scenario.",
        explanation:
          "The text mentions this risk for very low pairs (22-55), but the 'curse' refers specifically to the math of outs.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      'The Small Pocket Pair Curse is the asymmetry where small pairs have only 2 outs when behind but face opponents with 6+ outs even when ahead.',
    chapterReference: 'Chapter 6 — The Small Pocket Pair Curse',
  },
  {
    id: 'q-6-008',
    chapterId: 6,
    conceptIds: ['calling', 'position'],
    type: 'multiple-choice',
    prompt:
      'Why is calling an open from the Small Blind (SB) considered less desirable than calling from the Big Blind (BB)?',
    options: [
      {
        id: 'a',
        text: 'The SB is not closing the action and is susceptible to being squeezed by the BB.',
        explanation:
          'Not closing the pre-flop action means Hero may have to fold their equity to a 3-bet before ever seeing a flop.',
      },
      {
        id: 'b',
        text: 'The SB is required to 3-bet 100% of their playable range by default.',
        explanation:
          'The text recommends a 3-bet or fold strategy in many SB spots, but only as a tactical choice to mitigate disadvantages, not as an absolute rule.',
      },
      {
        id: 'c',
        text: 'The SB gets better pot odds because they have already invested 0.5 BB.',
        explanation:
          'Investing only 0.5 BB actually results in worse pot odds when facing an open compared to the 1 BB invested by the BB.',
      },
      {
        id: 'd',
        text: 'The SB has more equity against late position opens than the BB.',
        explanation:
          "Position and equity don't favor the SB; in fact, the SB is out of position to everyone post-flop.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      "Calling from the SB is weaker than from the BB because the SB doesn't close the action — the BB can still squeeze, forcing Hero to fold their equity before seeing a flop.",
    chapterReference: 'Chapter 6 — SB Calling Disadvantages',
  },
  {
    id: 'q-6-009',
    chapterId: 6,
    conceptIds: ['calling'],
    type: 'multiple-choice',
    prompt:
      'When Hero is in the Big Blind facing a 3\u00d7 open from the Button, what are his pot odds (assuming no other players called)?',
    options: [
      {
        id: 'a',
        text: '2.25 : 1',
        explanation:
          'Hero calls 2 BB (since 1 BB is already posted) to win a 4.5 BB pot (3 from UTG + 0.5 from SB + 1 from BB).',
      },
      {
        id: 'b',
        text: '5 : 1',
        explanation:
          'These odds are much higher than standard pre-flop scenarios without multiple callers.',
      },
      {
        id: 'c',
        text: '1.5 : 1',
        explanation:
          'This would be the odds if Hero were in an early position and had to call 3 BB into a 4.5 BB pot.',
      },
      {
        id: 'd',
        text: '3 : 1',
        explanation:
          'These are the odds for the BB facing a 2\u00d7 (min-raise) open, not a 3\u00d7 open.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Facing a 3\u00d7 open from the BB, Hero calls 2BB into a 4.5BB pot (3 + 0.5 + 1), giving pot odds of 2.25 : 1.',
    chapterReference: 'Chapter 6 — BB Pot Odds',
  },
  {
    id: 'q-6-010',
    chapterId: 6,
    conceptIds: ['calling', 'position'],
    type: 'multiple-choice',
    prompt:
      "What does the author suggest about the 'adversarial' spot of being on the Button facing a Cutoff (CO) open?",
    options: [
      {
        id: 'a',
        text: 'Hero should always 3-bet to take advantage of position immediately.',
        explanation:
          "While 3-betting is an option, the author specifically highlights this as a spot where many hands are profitable to 'flat' (call).",
      },
      {
        id: 'b',
        text: 'Hero should only play pocket pairs for set mining value.',
        explanation:
          'Set mining decreases in value against weak ranges because the opponent is less likely to have a strong hand to pay you off.',
      },
      {
        id: 'c',
        text: 'Hero should flat a much wider range of Broadway hands and suited connectors.',
        explanation:
          "Because the CO opening range is weak, Hero's hands suffer less from reverse implied odds and can frequently be in 'decent shape'.",
      },
      {
        id: 'd',
        text: 'Hero should tighten up significantly because the CO range is strong.',
        explanation:
          "The CO has a relatively wide 'steal' range, which actually encourages Hero to defend more widely.",
      },
    ],
    correctOptionId: 'c',
    explanation:
      "On the Button vs a CO open, Hero should flat a wide range of Broadways and suited connectors since the CO's weak steal range reduces reverse implied odds.",
    chapterReference: 'Chapter 6 — BU vs CO Flatting',
  },
  {
    id: 'q-6-011',
    chapterId: 6,
    conceptIds: ['calling'],
    type: 'multiple-choice',
    prompt:
      "Under 'Reason 3 - Playing with Weaker Players', how does the presence of a 'Fish' in the blinds affect Hero's calling strategy on the Button?",
    options: [
      {
        id: 'a',
        text: 'It forces Hero to fold marginal hands to avoid multi-way pots.',
        explanation:
          'Multi-way pots with weak players are actually an incentive to play more hands due to increased implied odds.',
      },
      {
        id: 'b',
        text: 'It makes 3-betting the only viable option to isolate the Fish.',
        explanation:
          "While isolation is a strategy, the text argues that the 'presence' of fish is a valid reason to 'call' and keep them in the pot.",
      },
      {
        id: 'c',
        text: 'It decreases the implied odds because the Fish is likely to be short-stacked.',
        explanation:
          'While stack size matters, the general presence of a weak player improves the expected value of speculative hands.',
      },
      {
        id: 'd',
        text: 'It provides extra implied odds because weaker players make more post-flop blunders and pay off value bets.',
        explanation:
          'Hero can call hands like 87s more profitably because they can extract more value when they hit and lose less when they miss against straightforward players.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'A Fish in the blinds provides extra implied odds — they make more post-flop mistakes and pay off value bets, making speculative calls on the Button more profitable.',
    chapterReference: 'Chapter 6 — Playing with Weaker Players',
  },
  {
    id: 'q-6-012',
    chapterId: 6,
    conceptIds: ['3-betting', 'position'],
    type: 'multiple-choice',
    prompt:
      "Why does the author recommend a '3-bet or fold' strategy from the Small Blind (SB) in most standard situations against late position opens?",
    options: [
      {
        id: 'a',
        text: 'Because the SB range is naturally the strongest at the table.',
        explanation:
          "The SB's range is just the hand they are dealt; 'strength' is a function of selection, not the seat itself.",
      },
      {
        id: 'b',
        text: 'To prevent the Button from ever seeing a flop with speculative hands.',
        explanation:
          "While this is a result, the 'why' is rooted in the SB's own structural disadvantages (position and action).",
      },
      {
        id: 'c',
        text: 'To mitigate the disadvantage of being out of position and not closing the action.',
        explanation:
          '3-betting takes the initiative and forces opponents to fold their equity, whereas calling leads to difficult post-flop spots and potential squeezes.',
      },
      {
        id: 'd',
        text: 'To maximize the pot odds for the Big Blind to join the pot.',
        explanation:
          'The goal is to win the pot or narrow the field, not to encourage the BB to call.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      "The SB's 3-bet or fold strategy mitigates being OOP and not closing the action. 3-betting seizes initiative and forces folds, avoiding difficult post-flop spots and squeeze risk.",
    chapterReference: 'Chapter 6 — SB 3-Bet or Fold Strategy',
  },
]
