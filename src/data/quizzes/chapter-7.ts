import type { QuizQuestion } from '@/types'

export const chapter7Questions: QuizQuestion[] = [
  {
    id: 'q-7-001',
    chapterId: 7,
    conceptIds: ['calling', 'equity'],
    type: 'multiple-choice',
    prompt:
      "Which of the following best defines an 'End of Action Spot' according to the text?",
    options: [
      {
        id: 'a',
        text: 'A situation where Hero faces a bet or raise and calling will be the final action taken in the hand.',
        explanation:
          'This definition matches the source, emphasizing that calling ends the betting sequence for that street or the entire hand, such as facing an all-in or a river bet.',
      },
      {
        id: 'b',
        text: 'Any pre-flop situation where a player raises and the action returns to the original folder.',
        explanation:
          'While pre-flop all-ins can be End of Action spots, the general definition requires that Hero\'s call would conclude all betting rounds.',
      },
      {
        id: 'c',
        text: 'A spot where Hero has the nuts and is deciding the optimal sizing for a value bet.',
        explanation:
          'The term describes a defensive decision-making process when facing pressure, rather than an offensive value-betting scenario.',
      },
      {
        id: 'd',
        text: 'A situation where Hero is the aggressor and must decide whether to continuation bet the river.',
        explanation:
          'An End of Action Spot specifically refers to when Hero is facing a bet or raise, not when they are the one initiating the action.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'An End of Action Spot is when Hero faces a bet or raise and calling would be the final action — such as an all-in or a river bet.',
    chapterReference: 'Chapter 7 — End of Action Spots',
  },
  {
    id: 'q-7-002',
    chapterId: 7,
    conceptIds: ['equity'],
    type: 'multiple-choice',
    prompt:
      'What is the correct mathematical formula for calculating Required Equity (RE) in an End of Action spot?',
    options: [
      {
        id: 'a',
        text: 'RE = (ATC+TP) / ATC',
        explanation:
          'This formula would result in a number greater than 1, which is impossible for a probability or percentage requirement.',
      },
      {
        id: 'b',
        text: 'RE = TP / (ATC+TP)',
        explanation:
          "This would calculate the frequency with which the opponent must be bluffing for Hero to break even, which is not the same as required equity.",
      },
      {
        id: 'c',
        text: 'RE = ATC / (ATC+TP)',
        explanation:
          'The text defines RE as the ratio of the amount Hero must invest to the total pot size after Hero has called.',
      },
      {
        id: 'd',
        text: 'RE = ATC / TP',
        explanation:
          'This formula forgets to include the Amount To Call in the denominator, which is a common pitfall mentioned in the text.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      'Required Equity = ATC / (ATC + TP), which gives the ratio of Hero\'s investment to the total pot after calling.',
    chapterReference: 'Chapter 7 — Required Equity Formula',
  },
  {
    id: 'q-7-003',
    chapterId: 7,
    conceptIds: ['equity'],
    type: 'multiple-choice',
    prompt:
      "If Villain bets half the size of the pot, what is the 'Milestone' amount of equity Hero roughly needs to call?",
    options: [
      {
        id: 'a',
        text: '20%',
        explanation:
          '20% equity is the milestone for facing a 1/3 pot sized bet.',
      },
      {
        id: 'b',
        text: '50%',
        explanation:
          '50% equity is required when Villain bets into an effectively empty pot or in specific high-investment all-in scenarios.',
      },
      {
        id: 'c',
        text: '33%',
        explanation:
          '33% equity is the milestone required when facing a full pot-sized bet.',
      },
      {
        id: 'd',
        text: '25%',
        explanation:
          'The milestone table indicates that a 1/2 pot bet corresponds to a 25% required equity target.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'Facing a 1/2 pot bet, Hero needs approximately 25% equity to call profitably.',
    chapterReference: 'Chapter 7 — Equity Milestones',
  },
  {
    id: 'q-7-004',
    chapterId: 7,
    conceptIds: ['equity'],
    type: 'multiple-choice',
    prompt:
      "According to the two-part thought process, what should be the very first thing on Hero's mind when facing an End of Action bet?",
    options: [
      {
        id: 'a',
        text: "Determining if the Villain is a 'Reg' or a 'Fish'.",
        explanation:
          'While player type is important, the text states the mathematical requirement should be established before analyzing the opponent.',
      },
      {
        id: 'b',
        text: 'Estimating how often the Villain is bluffing.',
        explanation:
          "Estimating bluffs is part of assessing 'Actual Equity', which the text designates as the second step.",
      },
      {
        id: 'c',
        text: 'Calculating or estimating the required equity (RE).',
        explanation:
          'The manual states that gauging the required equity is the absolute staple of the situation and should be the first consideration.',
      },
      {
        id: 'd',
        text: "Checking if Hero's hand blocks the Villain's value range.",
        explanation:
          "Blocker analysis is a more advanced part of assessing 'Actual Equity', not the primary first step.",
      },
    ],
    correctOptionId: 'c',
    explanation:
      'The first step is always calculating Required Equity — knowing the mathematical threshold before analyzing opponent tendencies.',
    chapterReference: 'Chapter 7 — Two-Part Thought Process',
  },
  {
    id: 'q-7-005',
    chapterId: 7,
    conceptIds: ['c-betting'],
    type: 'multiple-choice',
    prompt:
      "When interpreting HUD stats, what does a 'CBet Flop' value of 45% suggest about a player?",
    options: [
      {
        id: 'a',
        text: 'They are very aggressive and bluffing too much.',
        explanation:
          'Values above 75% are categorized as very high/aggressive; 45% is on the lower end.',
      },
      {
        id: 'b',
        text: 'They play straightforwardly and mainly bet for value.',
        explanation:
          "The text classifies the 0%-50% range as 'Very Low', indicating a value-oriented, straightforward strategy.",
      },
      {
        id: 'c',
        text: 'They likely select their light c-bets very well.',
        explanation:
          "This description is reserved for players in the 'Average' range of 60%-65%.",
      },
      {
        id: 'd',
        text: 'The sample size is too small to make any determination.',
        explanation:
          'While reliability depends on hand count, the percentage itself has a specific interpretation within the provided tiers.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'A CBet Flop of 45% falls in the Very Low range (0-50%), indicating a straightforward, value-oriented c-betting strategy.',
    chapterReference: 'Chapter 7 — HUD Stat Interpretation',
  },
  {
    id: 'q-7-006',
    chapterId: 7,
    conceptIds: ['equity'],
    type: 'multiple-choice',
    prompt:
      "What is the 'common mathematical mistake' mentioned in the text regarding equity calculations?",
    options: [
      {
        id: 'a',
        text: 'Using percentages instead of ratios for quick mental math.',
        explanation:
          'The text actually encourages using percentage milestones for in-game decision making.',
      },
      {
        id: 'b',
        text: "Forgetting to subtract the Villain's bet from the total pot.",
        explanation:
          "You must add the Villain's bet to the pot, not subtract it, to find the TP variable.",
      },
      {
        id: 'c',
        text: 'Failing to account for the rake taken by the house.',
        explanation:
          'While rake matters, the text highlights a more fundamental error in the division process.',
      },
      {
        id: 'd',
        text: 'Dividing the amount to call (ATC) into the current pot (TP) instead of (ATC + TP).',
        explanation:
          'The text explicitly warns against dividing into the pot as it was before the bet, rather than the total pot Hero stands to win.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'The common mistake is dividing ATC by TP alone instead of (ATC + TP). Hero must include their own call in the denominator.',
    chapterReference: 'Chapter 7 — Common Equity Mistakes',
  },
  {
    id: 'q-7-007',
    chapterId: 7,
    conceptIds: ['hand-reading'],
    type: 'multiple-choice',
    prompt:
      "In the context of the 'Three Specificities of Read', which is described as the most 'Vague'?",
    options: [
      {
        id: 'a',
        text: 'Player Type Read',
        explanation:
          "Player Type Reads are intermediate, applying to categories like 'Reg' or 'Fish'.",
      },
      {
        id: 'b',
        text: 'HUD Statistics',
        explanation:
          'HUD stats are a tool used to form Player Reads, which are precise, not vague.',
      },
      {
        id: 'c',
        text: 'Population Read',
        explanation:
          'The diagram and text define Population Reads as the most vague because they concern general tendencies of the entire player pool.',
      },
      {
        id: 'd',
        text: 'Player Read',
        explanation:
          "Player Reads are the most 'Precise' because they concern specific observations of a single opponent.",
      },
    ],
    correctOptionId: 'c',
    explanation:
      'Population Reads are the most vague — they apply general tendencies of the entire player pool rather than specific opponent data.',
    chapterReference: 'Chapter 7 — Three Specificities of Read',
  },
  {
    id: 'q-7-008',
    chapterId: 7,
    conceptIds: ['hand-reading'],
    type: 'multiple-choice',
    prompt:
      "What does a high 'WWSF' (Won When Saw Flop) stat (e.g., 54%) typically indicate about a player?",
    options: [
      {
        id: 'a',
        text: "The player is a 'Passive Fish' who calls too much.",
        explanation:
          "Passive players usually have lower WWSF stats because they don't fight to win pots without a strong hand.",
      },
      {
        id: 'b',
        text: 'The player likely bluffs too much and refuses to give up on pots.',
        explanation:
          "The text defines 52%-55% as 'High', suggesting the player fights for many pots and uses high aggression.",
      },
      {
        id: 'c',
        text: 'The player has been running unusually good in their last 100 hands.',
        explanation:
          'WWSF is a general indicator of aggression and strategy, though it requires a decent sample size to be reliable.',
      },
      {
        id: 'd',
        text: 'The player is extremely tight and only plays the nuts.',
        explanation:
          'A low WWSF (0%-37%) indicates a player who is extremely weak or tight post-flop.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'A high WWSF (54%) indicates a player who fights for many pots aggressively and is likely over-bluffing.',
    chapterReference: 'Chapter 7 — WWSF Stat Interpretation',
  },
  {
    id: 'q-7-009',
    chapterId: 7,
    conceptIds: ['hand-reading', 'calling'],
    type: 'multiple-choice',
    prompt:
      "If Villain's range is considered 'airless' on the river, how does this affect Hero's decision with a marginal hand?",
    options: [
      {
        id: 'a',
        text: "It suggests that Hero should raise to put the 'air' back in their range.",
        explanation:
          "Raising against an airless range usually results in getting called only by hands that beat Hero.",
      },
      {
        id: 'b',
        text: 'It makes calling much more attractive because Villain is polarized.',
        explanation:
          'Polarization implies both nuts and bluffs (air); airless means bluffs are absent.',
      },
      {
        id: 'c',
        text: 'It indicates that Villain is likely over-bluffing with thin value.',
        explanation:
          'An airless range by definition lacks bluffs, meaning the player is not over-bluffing.',
      },
      {
        id: 'd',
        text: 'It makes folding a much easier and safer choice.',
        explanation:
          'The text states that if Villain cannot have air, they are either checking for showdown or betting for value, making a bluff-catch highly unlikely to succeed.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'An airless range means Villain has no bluffs — they are either checking for showdown or betting value. Folding marginal hands becomes the clear choice.',
    chapterReference: 'Chapter 7 — Airless Ranges',
  },
  {
    id: 'q-7-010',
    chapterId: 7,
    conceptIds: ['calling', 'hand-reading'],
    type: 'multiple-choice',
    prompt:
      'Facing a near-pot sized bet on the river in Hand 51, why did Hero decide to fold 99 on a 6-6-3-4-2 board with 4 clubs?',
    options: [
      {
        id: 'a',
        text: "The Villain was a 'Passive Fish' unlikely to turn showdown value into a bluff.",
        explanation:
          'The text highlights that passive players rarely bluff with hands that have showdown value (like overpairs without a club) after the flush completes.',
      },
      {
        id: 'b',
        text: "Hero misread the board and didn't realize they had a flush.",
        explanation:
          'Hero correctly identified they had a 9-high flush but realized it was essentially a bluff-catcher in that specific spot.',
      },
      {
        id: 'c',
        text: 'Hero calculated that they needed 50% equity and only had 40%.',
        explanation:
          'Hero needed roughly 33% equity, but estimated their actual equity was close to 0% against this specific player type.',
      },
      {
        id: 'd',
        text: 'Hero only had middle pair and feared a higher pair like JJ.',
        explanation:
          'The board runout made the flush the primary concern, making Hero\'s pair essentially a bluff-catcher.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Hero folded because the Passive Fish would not bluff with showdown value hands after the flush completed — their betting range was airless.',
    chapterReference: 'Chapter 7 — Hand 51 Analysis',
  },
  {
    id: 'q-7-011',
    chapterId: 7,
    conceptIds: ['calling', 'hand-reading'],
    type: 'multiple-choice',
    prompt:
      "In Hand 52, why was Hero's call with middle pair (98 on J-9-5-3-3) considered 'logical' rather than 'heroic'?",
    options: [
      {
        id: 'a',
        text: "Because the Villain's overbet line made very little sense for value.",
        explanation:
          'The text explains that the aggressive Villain would have bet most flushes on the turn; checking turn then overbetting river is a line dominated by bluffs.',
      },
      {
        id: 'b',
        text: "Because Hero had the mathematical nuts and couldn't fold.",
        explanation:
          'Hero had middle pair, which is far from the nuts.',
      },
      {
        id: 'c',
        text: "Because Hero was in position and could see Villain's cards.",
        explanation:
          "Position is important, but Hero certainly could not see the Villain's cards.",
      },
      {
        id: 'd',
        text: 'Because Hero needed only 10% equity to call the overbet.',
        explanation:
          'Hero actually needed about 36% equity, which is higher than the requirement for a standard pot-sized bet.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      "The call was logical because Villain's line (check turn, overbet river) made no sense for value — an aggressive player would bet flushes on the turn, so this line was bluff-heavy.",
    chapterReference: 'Chapter 7 — Hand 52 Analysis',
  },
  {
    id: 'q-7-012',
    chapterId: 7,
    conceptIds: ['equity'],
    type: 'multiple-choice',
    prompt:
      "What is 'Amount To Call' (ATC) as defined in the context of the required equity formula?",
    options: [
      {
        id: 'a',
        text: 'The size of the bet Hero is currently facing but has not yet paid.',
        explanation:
          'The text specifies ATC as the bet size we are facing but have not yet invested.',
      },
      {
        id: 'b',
        text: 'The maximum amount Hero is willing to lose in the hand.',
        explanation:
          'This is a bankroll or psychological limit, not a mathematical variable for equity calculations.',
      },
      {
        id: 'c',
        text: 'The total amount currently in the pot before any bets are made.',
        explanation:
          'This describes the pot, not the specific cost to continue.',
      },
      {
        id: 'd',
        text: 'The amount Hero has already invested in the pot in previous rounds.',
        explanation:
          "Past investments are 'sunk costs' and do not factor into the ATC variable for the current decision.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Amount To Call (ATC) is the bet size Hero is currently facing but has not yet paid — the cost to continue in the hand.',
    chapterReference: 'Chapter 7 — ATC Definition',
  },
  {
    id: 'q-7-013',
    chapterId: 7,
    conceptIds: ['equity', 'calling'],
    type: 'multiple-choice',
    prompt:
      "In 'Hand 53', why does Hero need approximately 49% equity to call a pre-flop all-in shove?",
    options: [
      {
        id: 'a',
        text: 'Because Hero is calling 36BB into a total pot of 73.5BB.',
        explanation:
          'Using the formula 36/(36+37.5), the resulting RE is 49%, as Hero is effectively betting against a single opponent for the whole pot.',
      },
      {
        id: 'b',
        text: 'Because the pot contains significant dead money from multiple callers.',
        explanation:
          "The text notes that there is only 1.5BB of dead money, which is described as making 'little difference'.",
      },
      {
        id: 'c',
        text: 'Because the rake at most casinos is exactly 1%.',
        explanation:
          'Rake might adjust the needed equity slightly upward, but the 49% figure comes from the pot odds calculation.',
      },
      {
        id: 'd',
        text: "Because Villain is a 'Passive Fish' and Hero must be ahead of their range.",
        explanation:
          "The requirement is based on the math of the pot, regardless of the player type (though player type helps determine 'Actual Equity').",
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Hero calls 36BB into a total pot of 73.5BB. RE = 36 / (36 + 37.5) = 49%. The math determines the threshold regardless of opponent type.',
    chapterReference: 'Chapter 7 — Hand 53 Analysis',
  },
  {
    id: 'q-7-014',
    chapterId: 7,
    conceptIds: ['hand-reading'],
    type: 'multiple-choice',
    prompt:
      'Which HUD stat is described as taking the longest time to converge (requiring the most hands for reliability)?',
    options: [
      {
        id: 'a',
        text: 'VPIP/PFR',
        explanation:
          'These pre-flop stats converge the fastest as they apply to every hand dealt.',
      },
      {
        id: 'b',
        text: 'CBet Flop',
        explanation:
          'CBet Flop converges relatively quickly as players have many opportunities to bet on the first post-flop street.',
      },
      {
        id: 'c',
        text: 'CBet Turn',
        explanation:
          'While it takes longer than CBet Flop, it occurs more frequently than river opportunities.',
      },
      {
        id: 'd',
        text: 'CBet River',
        explanation:
          'The text explicitly states that CBet River takes even longer to converge than CBet Turn because the situation occurs much less frequently.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'CBet River takes the longest to converge because the situation (reaching the river as the pre-flop aggressor) occurs much less frequently than flop or turn c-bet spots.',
    chapterReference: 'Chapter 7 — HUD Stat Convergence',
  },
  {
    id: 'q-7-015',
    chapterId: 7,
    conceptIds: ['hand-reading', 'calling'],
    type: 'multiple-choice',
    prompt:
      "If an aggressive player checks back the turn, 'capping' their range, how does this affect Hero's decision facing a river raise?",
    options: [
      {
        id: 'a',
        text: 'Hero should always re-raise to exploit the capped range.',
        explanation:
          'While Hero can call more lightly, a re-raise might be unnecessary if Hero is just looking to catch a bluff.',
      },
      {
        id: 'b',
        text: "Hero can feel better about calling lightly because the Villain's line lacks credible value hands.",
        explanation:
          'The text notes that if an aggressive player skips a value-betting street, their range is capped to weak hands, making a later big bet more likely to be a bluff.',
      },
      {
        id: 'c',
        text: 'It has no impact because any river bet represents strength.',
        explanation:
          'Hand reading requires analyzing the consistency of the line across all streets; a capped range changes the math of the river.',
      },
      {
        id: 'd',
        text: 'Hero should fold immediately as a turn check always means the nuts.',
        explanation:
          'Passive fish might slowplay, but aggressive players usually bet their strong hands, making a check indicative of weakness.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      "When an aggressive player checks back the turn, their range is capped — they've excluded strong value hands. A big river bet is therefore more likely to be a bluff, making lighter calls profitable.",
    chapterReference: 'Chapter 7 — Capped Ranges',
  },
]
