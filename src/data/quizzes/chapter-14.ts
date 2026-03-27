import type { QuizQuestion } from '@/types'

export const chapter14Questions: QuizQuestion[] = [
  {
    id: 'q-14-001',
    chapterId: 14,
    conceptIds: ['hand-selection', 'general-strategy'],
    type: 'multiple-choice',
    prompt:
      'When effective stack depths increase from 100BB to 250BB, which type of hands see the most significant increase in value for calling pre-flop opens?',
    options: [
      {
        id: 'a',
        text: 'Any two cards from the button due to positional advantage.',
        explanation:
          "While position is magnified, hand strength still matters; playing 'any two cards' deep would involve too many hands with zero nut potential.",
      },
      {
        id: 'b',
        text: 'Suited aces, pocket pairs, and suited connectors.',
        explanation:
          "Deep stacks increase implied odds, making hands with high 'nut potential' (NP) much more profitable as the potential reward for hitting the nuts is larger.",
      },
      {
        id: 'c',
        text: 'Weak offsuit connectors like 65o.',
        explanation:
          'The material states that even 200BB deep, we would still need to be against a particularly horrible player to call a hand as poor as 65o.',
      },
      {
        id: 'd',
        text: 'Offsuit broadways and high cards like AQo and KJo.',
        explanation:
          'These hands often suffer from reverse implied odds when deep, as they frequently make second-best hands that can lose very large pots.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Deep stacks increase implied odds massively, making hands with high nut potential — suited aces, pocket pairs, suited connectors — far more valuable.',
    chapterReference: 'Chapter 14 — Deep Stack Hand Selection',
  },
  {
    id: 'q-14-002',
    chapterId: 14,
    conceptIds: ['3-betting', 'position'],
    type: 'multiple-choice',
    prompt:
      'Why is Hero advised to call rather than 3-bet for value with QQ from the Big Blind against a 250BB CO open?',
    options: [
      {
        id: 'a',
        text: 'Because QQ is a weak hand when stacks are deeper than 150BB.',
        explanation:
          "QQ is still a very strong hand, but its strategic function changes from a 'shoving' hand to one that requires careful pot control.",
      },
      {
        id: 'b',
        text: 'To control the pot size and prevent the Villain from leveraging a magnified positional advantage.',
        explanation:
          'Deep stacks magnify the positional disadvantage of being out of position (OOP); keeping the pot small prevents the Villain from threatening the full 200BB+ stack with non-nutted hands.',
      },
      {
        id: 'c',
        text: 'Because calling allows the Big Blind to see the flop for the cheapest possible price.',
        explanation:
          'Though calling is cheaper, the decision is based on mitigating the risks associated with stack depth and position rather than simple cost-saving.',
      },
      {
        id: 'd',
        text: 'To encourage the Villain to bluff with a wider range on later streets.',
        explanation:
          'While true in some contexts, the primary reason given is to avoid the high reverse implied odds of playing a bloated pot OOP.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'At 250BB deep OOP, 3-betting QQ bloats the pot and magnifies positional disadvantage. Calling controls pot size and prevents Villain from leveraging position with the full stack.',
    chapterReference: 'Chapter 14 — Deep Stack 3-Betting OOP',
  },
  {
    id: 'q-14-003',
    chapterId: 14,
    conceptIds: ['general-strategy'],
    type: 'multiple-choice',
    prompt:
      "What is the primary adjustment recommended when an 'annoying' short stack (10-20BB) is waiting to act behind you?",
    options: [
      {
        id: 'a',
        text: 'Open to a smaller sizing, such as 2BB, with your entire range.',
        explanation:
          'Opening smaller saves money those times you are forced to fold to a shove, and short stacks have naturally negated implied odds anyway.',
      },
      {
        id: 'b',
        text: 'Limp into the pot to see a flop cheaply.',
        explanation:
          "Limping is generally not recommended in the strategic framework provided; it cedes initiative and doesn't accomplish the goal of maximizing EV.",
      },
      {
        id: 'c',
        text: 'Open larger to 4BB or 5BB to discourage them from shoving.',
        explanation:
          'Increasing your sizing makes it even more profitable for the short stack to shove over you as a bluff or for value.',
      },
      {
        id: 'd',
        text: 'Tighten your opening range significantly to only include hands that can call a shove.',
        explanation:
          'This is only necessary if the short stack is known to be shoving an extremely wide range; otherwise, we just want to lose less when they do shove.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Against short stacks behind, open smaller (2BB) to save money when forced to fold to a shove. Short stacks negate implied odds anyway.',
    chapterReference: 'Chapter 14 — Short Stack Adjustments',
  },
  {
    id: 'q-14-004',
    chapterId: 14,
    conceptIds: ['3-betting'],
    type: 'multiple-choice',
    prompt:
      'When facing a 3-bet with a 40BB effective stack, why does 4-betting to a small size (e.g., 14BB) often lead to errors?',
    options: [
      {
        id: 'a',
        text: 'It effectively commits Hero to the pot while allowing Villain to realize equity cheaply.',
        explanation:
          'At this stack depth, a 4-bet is virtually an all-in; shoving instead allows Hero to realize their own equity and maximizes fold equity.',
      },
      {
        id: 'b',
        text: 'It is better to flat the 3-bet to utilize a skill advantage post-flop.',
        explanation:
          'Calling 40BB deep offers very poor implied odds, making it a less favorable strategy than shoving or folding.',
      },
      {
        id: 'c',
        text: 'It gives the Villain the correct odds to call with any suited connector.',
        explanation:
          "While they might have odds, the primary problem is that Hero loses the ability to 4-bet/fold as a bluff, as the sizing creates pot commitment.",
      },
      {
        id: 'd',
        text: "Villain can easily 5-bet shove over the small 4-bet.",
        explanation:
          "Because Hero is already committed by the small 4-bet, Villain's 5-bet shove doesn't create a new tactical problem; the error is in the initial 4-bet sizing.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      'At 40BB, a small 4-bet commits Hero to the pot while letting Villain realize equity cheaply. Shoving is superior — it maximizes fold equity and realizes Hero\'s own equity.',
    chapterReference: 'Chapter 14 — 40BB 4-Bet Sizing',
  },
  {
    id: 'q-14-005',
    chapterId: 14,
    conceptIds: ['3-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "In the context of 'Awkward Stacks' (60-80BB), why is shoving AKo over a 3-bet often superior to a small 4-bet against an aggressive fish?",
    options: [
      {
        id: 'a',
        text: 'It allows Hero to bluff with a wider range of hands.',
        explanation:
          'While shoving does allow for bluffs, the specific logic for AKo here is value-driven and equity protection against fish.',
      },
      {
        id: 'b',
        text: 'Because AKo is too weak to play post-flop in a 4-bet pot.',
        explanation:
          'AKo is strong post-flop, but shoving simplifies the game tree and exploits the fact that fish often call shoves too wide pre-flop.',
      },
      {
        id: 'c',
        text: "It prevents the Villain from set mining profitably and protects Hero's equity.",
        explanation:
          'A small 4-bet allows a fish to take a flop with hands like 66 or QJs, whereas a shove forces them to either fold their equity or call off in a dominated spot.',
      },
      {
        id: 'd',
        text: "It maximizes fold equity against the Villain's nutted range.",
        explanation:
          "We don't expect a fish to fold their nuts to a shove; we shove to get called by worse and prevent them from out-drawing us.",
      },
    ],
    correctOptionId: 'c',
    explanation:
      "Shoving AKo at awkward stacks prevents fish from set mining profitably with small pairs. It protects Hero's equity by denying Villain a cheap flop.",
    chapterReference: 'Chapter 14 — Awkward Stack Shoves',
  },
  {
    id: 'q-14-006',
    chapterId: 14,
    conceptIds: ['hand-selection', 'general-strategy'],
    type: 'multiple-choice',
    prompt:
      "Why is the A\u2660 blocker considered a 'magical weapon' when playing 270BB deep in position on a flop like J\u2660 8\u2660 7\u2663?",
    options: [
      {
        id: 'a',
        text: 'It guarantees that Villain will fold all overpairs to a flop raise.',
        explanation:
          'Blockers affect range composition and bluffing viability but do not guarantee immediate folds from strong one-pair hands.',
      },
      {
        id: 'b',
        text: 'It gives Hero the best possible draw to the nuts.',
        explanation:
          "While Hero has the draw, the primary strategic benefit discussed is the 'blocker' effect which enables more effective multi-street bluffing.",
      },
      {
        id: 'c',
        text: 'It ensures Hero will win the pot 100% of the time if a spade falls.',
        explanation:
          'Hero only has one spade; they still need to hit a second spade to actually make the flush, and the Villain could have a straight or full house.',
      },
      {
        id: 'd',
        text: 'It prevents the Villain from turning the absolute nuts (the nut flush).',
        explanation:
          'Blocking the nut flush allows Hero to apply massive pressure on spade turns, knowing the Villain can never have the unbeatable hand.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'The A\u2660 blocker prevents Villain from ever having the nut flush, allowing Hero to apply massive pressure on spade turns with impunity.',
    chapterReference: 'Chapter 14 — Deep Stack Blocker Play',
  },
  {
    id: 'q-14-007',
    chapterId: 14,
    conceptIds: ['general-strategy'],
    type: 'multiple-choice',
    prompt:
      "If a player has an 8.5% chance to turn the nuts and must call an 8BB bet into a 22BB pot, approximately how much total money (pot + villain's stack) must they stand to gain to make the call profitable?",
    options: [
      {
        id: 'a',
        text: '10 times the current pot size (220BB).',
        explanation:
          'The calculation for implied odds is based on the investment (the call amount), not the current pot size.',
      },
      {
        id: 'b',
        text: 'Approximately 12 times their investment (96BB).',
        explanation:
          'A 8.5% chance is roughly 1/12; therefore, the total payout must be 12 times the call amount to break even on pure implied odds.',
      },
      {
        id: 'c',
        text: 'Half of the effective stack depth.',
        explanation:
          'While the target might be half a stack, the break-even point is a mathematical calculation of probability versus potential reward.',
      },
      {
        id: 'd',
        text: 'Exactly the size of the current pot (30BB).',
        explanation:
          'This would only be true if the chance to hit was 1/3.75 (roughly 26.7%); 8.5% requires a much larger payout.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'With an 8.5% chance (\u22481/12), the total payout must be 12\u00d7 the call amount = 12 \u00d7 8BB = 96BB to break even on implied odds.',
    chapterReference: 'Chapter 14 — Deep Stack Implied Odds',
  },
  {
    id: 'q-14-008',
    chapterId: 14,
    conceptIds: ['position', 'general-strategy'],
    type: 'multiple-choice',
    prompt:
      'When playing deep (250BB+) out of position, why is it often recommended to forego a raising range on the flop with hands like bottom set?',
    options: [
      {
        id: 'a',
        text: "Because bottom set is likely behind the Villain's range on a wet board.",
        explanation:
          'Bottom set is almost always ahead on the flop; the issue is how that lead translates over three streets of massive bets when OOP.',
      },
      {
        id: 'b',
        text: 'To hide the strength of your hand and induce a river bluff.',
        explanation:
          'While inducing bluffs is a side effect, the primary motivation is defensive pot control to mitigate the positional disadvantage.',
      },
      {
        id: 'c',
        text: 'Building a massive pot OOP with vulnerable hands increases reverse implied odds.',
        explanation:
          'Deep stacks magnify positional disadvantage; bloating the pot OOP makes it impossible to control the size later, making hands like sets feel like bluff catchers on certain runouts.',
      },
      {
        id: 'd',
        text: 'Because the Villain will always fold to a raise at this stack depth.',
        explanation:
          'Villains with deep stacks are actually more likely to call raises with draws and implied-odds hands.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      'Deep stacks magnify OOP disadvantage. Raising the flop with bottom set bloats the pot, making it impossible to control sizing later and creating massive reverse implied odds.',
    chapterReference: 'Chapter 14 — Deep Stack OOP Strategy',
  },
  {
    id: 'q-14-009',
    chapterId: 14,
    conceptIds: ['general-strategy'],
    type: 'multiple-choice',
    prompt:
      "In a shallow 4-bet pot (40BB effective) on a board like A\u2660 6\u2665 4\u2666, why is there 'room to check' on the flop?",
    options: [
      {
        id: 'a',
        text: 'The low Stack-to-Pot Ratio (SPR) means stacks can easily be committed over only two streets.',
        explanation:
          'With less money behind, there is no urgency to build the pot immediately; value can be extracted on the turn and river while allowing Hero to check back some streets.',
      },
      {
        id: 'b',
        text: 'Hero\'s range is so strong that the Villain is guaranteed to fold to any bet.',
        explanation:
          'While Hero has range advantage, checking is about pot geometry and extraction, not assuming the Villain will always fold.',
      },
      {
        id: 'c',
        text: "To avoid being check-raised by the Villain's nutted hands.",
        explanation:
          "In a 4-bet pot, the Villain rarely has a 'nutted' range that crushes an Ace-high board, especially when Hero holds AK or AA.",
      },
      {
        id: 'd',
        text: 'Checking is the only way to induce a bluff from a tight-passive player.',
        explanation:
          'Checking can induce bluffs, but the technical reason for the \'room to check\' is the mathematical flexibility provided by the low SPR.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'At low SPR in a 4-bet pot, stacks can be committed over just two streets. No urgency to bet the flop — Hero can extract value on turn and river.',
    chapterReference: 'Chapter 14 — Shallow 4-Bet Pot Strategy',
  },
  {
    id: 'q-14-010',
    chapterId: 14,
    conceptIds: ['hand-selection', 'fold-equity'],
    type: 'multiple-choice',
    prompt:
      "When an aggressive fish with 18BB calls Hero's pre-flop raise and Hero's flop C-bet on T\u2663 5\u2660 4\u2660, why is shoving the K\u2665 turn with A\u2660 2\u2660 recommended?",
    options: [
      {
        id: 'a',
        text: 'Hero is forced to shove because they are now pot-committed.',
        explanation:
          "Being pot-committed means Hero shouldn't fold, but it doesn't automatically mean shoving is better than checking unless fold equity exists.",
      },
      {
        id: 'b',
        text: 'Hero has significant equity and may generate enough fold equity to make the shove +EV.',
        explanation:
          "Against a short-stacked aggro fish, Hero's combo draw has high equity; shoving realizes that equity and adds a chance to win the pot immediately.",
      },
      {
        id: 'c',
        text: 'To prevent the Villain from betting first and forcing Hero to fold.',
        explanation:
          'As Hero has the lead, they control the action; the shove is a proactive move to maximize the EV of the draw.',
      },
      {
        id: 'd',
        text: "The K\u2665 is the perfect card to bluff because it is a 'scare card'.",
        explanation:
          "While it is a scare card, the logic is based on the mathematical combination of fold equity and Hero's high raw equity (approx 34%).",
      },
    ],
    correctOptionId: 'b',
    explanation:
      "Hero's combo draw has ~34% equity plus fold equity from the shove. Against a short-stacked aggro fish, shoving realizes that equity and adds immediate win potential.",
    chapterReference: 'Chapter 14 — Short Stack Combo Draw Shove',
  },
]
