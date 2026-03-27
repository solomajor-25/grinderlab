import type { QuizQuestion } from '@/types'

export const chapter8Questions: QuizQuestion[] = [
  {
    id: 'q-8-001',
    chapterId: 8,
    conceptIds: ['calling', 'equity'],
    type: 'multiple-choice',
    prompt:
      'According to the text, what defines an "Open Action Spot"?',
    options: [
      {
        id: 'a',
        text: 'Any pot where Hero is the pre-flop aggressor and maintains the initiative on the flop.',
        explanation:
          'While many such spots are open action, the definition is based on the facing of a bet and the potential for subsequent action, not just being the aggressor.',
      },
      {
        id: 'b',
        text: 'A spot where the cards are immediately flipped over after the current bet is called.',
        explanation:
          'This describes an end of action spot where the outcome is decided solely by raw equity at showdown.',
      },
      {
        id: 'c',
        text: 'A situation where Hero faces a bet and if he calls, further actions such as checks, bets, or raises are possible on this or future streets.',
        explanation:
          'The defining characteristic of an open action spot is the potential for future betting and strategic maneuvering after a call.',
      },
      {
        id: 'd',
        text: 'A situation where Hero faces a bet and calling would end the betting on the current street.',
        explanation:
          "This describes an 'end of action spot', whereas an open action spot implies the hand is not yet finished.",
      },
    ],
    correctOptionId: 'c',
    explanation:
      'An Open Action Spot is defined by the potential for future betting after a call — further checks, bets, or raises are possible on this or future streets.',
    chapterReference: 'Chapter 8 — Open Action Spots',
  },
  {
    id: 'q-8-002',
    chapterId: 8,
    conceptIds: ['equity'],
    type: 'multiple-choice',
    prompt:
      'What is the concept of "Ghost Equity" as explained in Chapter 8?',
    options: [
      {
        id: 'a',
        text: "Equity that Hero has against a range of hands that is guaranteed to reach a showdown.",
        explanation:
          'Ghost equity is specifically equity that is *not* guaranteed to reach showdown.',
      },
      {
        id: 'b',
        text: 'Equity that Hero possesses on an earlier street but cannot fully realize because he may be forced to fold on later streets.',
        explanation:
          "Ghost equity represents the portion of your hand's winning probability that 'vanishes' because you are forced to fold before showdown.",
      },
      {
        id: 'c',
        text: 'The equity of a draw that has no chance of winning at showdown if it fails to improve.',
        explanation:
          'While draws have equity, ghost equity refers to the inability to realize that equity due to the threat of future betting.',
      },
      {
        id: 'd',
        text: "Equity that is calculated solely based on the cards in the deck, ignoring the opponent's betting range.",
        explanation:
          "Equity calculation always considers the opponent's range; 'ghost' refers to the practical realization of that equity.",
      },
    ],
    correctOptionId: 'b',
    explanation:
      "Ghost Equity is equity that exists on an earlier street but can't be fully realized because Hero may be forced to fold on later streets due to future aggression.",
    chapterReference: 'Chapter 8 — Ghost Equity',
  },
  {
    id: 'q-8-003',
    chapterId: 8,
    conceptIds: ['calling', 'fold-equity'],
    type: 'multiple-choice',
    prompt:
      'In the context of non-made-hands, how does the text differentiate "Floating" from "Chasing"?',
    options: [
      {
        id: 'a',
        text: 'Floating relies on future fold equity to be profitable, whereas chasing relies on pot odds and implied odds.',
        explanation:
          'Floating is a strategic call intended to take the pot away later, while chasing is a mathematical call based on the price and potential payout of hitting a draw.',
      },
      {
        id: 'b',
        text: 'Floating is calling with a draw, while chasing is calling with a weak pair.',
        explanation:
          'Both terms refer to calling with non-made-hands; the distinction lies in the strategic motivation.',
      },
      {
        id: 'c',
        text: 'Floating is done out of position, while chasing is done in position.',
        explanation:
          'While position affects the viability of these plays, it does not define the fundamental difference between them.',
      },
      {
        id: 'd',
        text: "Chasing is always an error made by 'Fish', while floating is an expert play made by 'Regs'.",
        explanation:
          "The author clarifies that 'chasing' is used here to describe a specific +EV motive, not the stereotypical fishy mistake.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Floating relies on future fold equity (taking the pot away later), while chasing relies on pot odds and implied odds (hitting a draw profitably).',
    chapterReference: 'Chapter 8 — Floating vs Chasing',
  },
  {
    id: 'q-8-004',
    chapterId: 8,
    conceptIds: ['general-strategy'],
    type: 'multiple-choice',
    prompt:
      'Which of the following describes a "Balanced Strategy"?',
    options: [
      {
        id: 'a',
        text: "A strategy used exclusively against 'Fish' to ensure Hero does not lose too much money.",
        explanation:
          "Against 'Fish', the author recommends exploitative play rather than balance, as they are unlikely to exploit Hero's imbalances.",
      },
      {
        id: 'b',
        text: "A strategy designed to maximize profit by targeting specific weaknesses in an opponent's play.",
        explanation:
          'This describes an exploitative strategy, which intentionally creates imbalances to punish an opponent.',
      },
      {
        id: 'c',
        text: 'A strategy that involves betting the exact same amount as the opponent in every street.',
        explanation:
          'Balance refers to range construction and frequency, not matching bet sizes.',
      },
      {
        id: 'd',
        text: "A solid strategy where Hero's range is not heavily weighted toward either strong or weak hands, making it difficult for opponents to exploit.",
        explanation:
          'Balance aims for a range composition that prevents an observant opponent from finding a clear counter-strategy.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      "A balanced strategy constructs ranges that aren't heavily weighted toward strong or weak hands, preventing opponents from finding clear counter-strategies.",
    chapterReference: 'Chapter 8 — Balanced Strategy',
  },
  {
    id: 'q-8-005',
    chapterId: 8,
    conceptIds: ['board-texture'],
    type: 'multiple-choice',
    prompt:
      'What is meant by "Range Advantage" in a post-flop scenario?',
    options: [
      {
        id: 'a',
        text: 'When a player has a wider variety of suits in their starting hand range.',
        explanation:
          'Range strength is about equity and nutty potential on the board, not just pre-flop variety.',
      },
      {
        id: 'b',
        text: "When a player's range of possible hands contains more strong hands (like sets or overpairs) than their opponent's range.",
        explanation:
          'Range advantage refers to whose overall distribution of hands is stronger on a specific board texture.',
      },
      {
        id: 'c',
        text: 'When a player has more total chips in their stack than their opponent.',
        explanation:
          'This is a stack advantage, not a range advantage.',
      },
      {
        id: 'd',
        text: 'When a player has the button and will be the last to act on every post-flop street.',
        explanation:
          'This is positional advantage, which is distinct from range advantage.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      "Range advantage means one player's distribution of possible hands contains more strong hands (sets, overpairs, etc.) than their opponent's on a given board.",
    chapterReference: 'Chapter 8 — Range Advantage',
  },
  {
    id: 'q-8-006',
    chapterId: 8,
    conceptIds: ['value-betting', 'board-texture'],
    type: 'multiple-choice',
    prompt:
      'Why is "Urgency of Value" an important factor in deciding whether to have a raising range on the flop?',
    options: [
      {
        id: 'a',
        text: "On wet textures, many turn cards can kill the action or hurt Hero's equity, so building the pot early is vital.",
        explanation:
          'When many turn cards make the board scarier or complete draws, Hero should prioritize getting money in while his hand is clearly best.',
      },
      {
        id: 'b',
        text: 'It is always better to raise for value as soon as possible, regardless of the board texture.',
        explanation:
          "Slowplaying or calling can often be superior on dry boards to keep the opponent's bluffs in the pot.",
      },
      {
        id: 'c',
        text: 'On dry boards, Hero needs to raise immediately to prevent Villain from hitting a lucky card.',
        explanation:
          'Dry boards generally have low urgency of value because few turn cards drastically change hand rankings.',
      },
      {
        id: 'd',
        text: 'It helps Hero decide whether to bluff-raise or float a bet.',
        explanation:
          'Urgency of value specifically pertains to value hands, though it influences how Hero balances his raising range with bluffs.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      "On wet boards, many turn cards can kill action or hurt Hero's equity. Urgency of value means building the pot early while Hero's hand is clearly best.",
    chapterReference: 'Chapter 8 — Urgency of Value',
  },
  {
    id: 'q-8-007',
    chapterId: 8,
    conceptIds: ['general-strategy'],
    type: 'multiple-choice',
    prompt:
      'According to the text, what is a "Pyramidal Strategy"?',
    options: [
      {
        id: 'a',
        text: "A strategy where Hero's range of actions shrinks proportionately from pre-flop through to the river to maintain balance.",
        explanation:
          "By narrowing the range street-by-street, Hero ensures he isn't defending too much or too little at any given stage.",
      },
      {
        id: 'b',
        text: "A way of organizing poker notes to identify different types of 'Fish'.",
        explanation:
          'This term refers specifically to range construction and strategic frequency.',
      },
      {
        id: 'c',
        text: 'A betting strategy where Hero increases his bet size on every street.',
        explanation:
          'This describes a geometric sizing approach, not a pyramidal range strategy.',
      },
      {
        id: 'd',
        text: 'A strategy that prioritizes winning small pots frequently over winning large pots occasionally.',
        explanation:
          'A pyramidal strategy is about defending the appropriate frequency of hands to remain unexploitable.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      "A Pyramidal Strategy narrows Hero's range proportionately from pre-flop to river, ensuring balanced defense at every stage of the hand.",
    chapterReference: 'Chapter 8 — Pyramidal Strategy',
  },
  {
    id: 'q-8-008',
    chapterId: 8,
    conceptIds: ['fold-equity', 'hand-reading'],
    type: 'multiple-choice',
    prompt:
      "In Hand 65 (T9o on 7-6-2), why does the author suggest an exploitative raise against the 'Weak Reg'?",
    options: [
      {
        id: 'a',
        text: 'Because Hero has significant showdown value with 10-high.',
        explanation:
          'Hero has zero showdown value, which is why turning the hand into a bluff is attractive.',
      },
      {
        id: 'b',
        text: 'Because Hero has flopped the stone-cold nuts and wants to build a pot.',
        explanation:
          'Hero has air with some back-door potential, not a made hand.',
      },
      {
        id: 'c',
        text: 'Because it is important to be balanced against all regular players, regardless of their specific tendencies.',
        explanation:
          'The author explicitly states that Hero should forgo balance in favor of an exploitative plan when a clear weakness is identified.',
      },
      {
        id: 'd',
        text: "Because the Villain is expected to 'overfold' in the face of aggression, failing to protect his wide c-betting range.",
        explanation:
          "The raise exploits the Villain's tendency to fold too often, making a bluff-heavy raising strategy highly profitable.",
      },
    ],
    correctOptionId: 'd',
    explanation:
      "The exploitative raise targets the Weak Reg's tendency to overfold against aggression, failing to protect their wide c-betting range.",
    chapterReference: 'Chapter 8 — Hand 65 Analysis',
  },
  {
    id: 'q-8-009',
    chapterId: 8,
    conceptIds: ['fold-equity', 'calling'],
    type: 'multiple-choice',
    prompt:
      'What is the relationship between Implied Odds and Future Fold Equity for non-made-hands?',
    options: [
      {
        id: 'a',
        text: 'They both increase as Hero moves further out of position.',
        explanation:
          'Position generally improves both, but they still remain inversely linked relative to the opponent\'s profile.',
      },
      {
        id: 'b',
        text: 'They are unrelated concepts that should be analyzed separately without comparison.',
        explanation:
          "Understanding the link between them is crucial for determining whether to 'chase' or 'float'.",
      },
      {
        id: 'c',
        text: 'They are directly proportionate; when one is high, the other is usually high.',
        explanation:
          "These two factors usually move in opposite directions based on the opponent's willingness to fold.",
      },
      {
        id: 'd',
        text: "They are inversely proportionate; when an opponent is unlikely to fold (high implied odds), Hero has low fold equity.",
        explanation:
          "If you hit your draw and expect to get paid (implied odds), it means your opponent doesn't like folding, which minimizes your bluffing success (fold equity).",
      },
    ],
    correctOptionId: 'd',
    explanation:
      "Implied odds and fold equity are inversely proportionate — opponents who don't fold give you high implied odds but low fold equity, and vice versa.",
    chapterReference: 'Chapter 8 — Implied Odds vs Fold Equity',
  },
  {
    id: 'q-8-010',
    chapterId: 8,
    conceptIds: ['fold-equity', 'position'],
    type: 'multiple-choice',
    prompt:
      'Which factor makes Hero more inclined to RAISE a non-made-hand rather than just call?',
    options: [
      {
        id: 'a',
        text: 'Having significant Showdown Value (SDV).',
        explanation:
          'Hands with SDV prefer to call to realize their equity at showdown rather than turning the hand into a bluff.',
      },
      {
        id: 'b',
        text: 'Being in position.',
        explanation:
          'Being in position makes floating (calling) more attractive as it is easier to realize fold equity later.',
      },
      {
        id: 'c',
        text: 'Being out of position.',
        explanation:
          'Raising out of position allows Hero to seize fold equity immediately and avoid the difficulty of playing future streets with a disadvantage.',
      },
      {
        id: 'd',
        text: 'Facing a very large bet that offers excellent pot odds.',
        explanation:
          'Good pot odds encourage calling; bad pot odds might encourage a raise to maximize fold equity.',
      },
    ],
    correctOptionId: 'c',
    explanation:
      'Being out of position makes raising non-made-hands more attractive — Hero seizes fold equity immediately rather than facing difficult future streets at a positional disadvantage.',
    chapterReference: 'Chapter 8 — Raising Non-Made-Hands',
  },
  {
    id: 'q-8-011',
    chapterId: 8,
    conceptIds: ['c-betting'],
    type: 'multiple-choice',
    prompt:
      'What is a "Donk Bet"?',
    options: [
      {
        id: 'a',
        text: 'A very small bet meant to induce a raise.',
        explanation:
          'While size varies, the term refers to the relative positions of the aggressor and caller.',
      },
      {
        id: 'b',
        text: "A bet made specifically by a player identified as a 'Fish' on the HUD.",
        explanation:
          'While often associated with weaker players, it is a technical term for the betting sequence.',
      },
      {
        id: 'c',
        text: 'A bet made into the pre-flop aggressor by the caller before the aggressor has a chance to bet.',
        explanation:
          "Donking refers to 'leading' into the player who had the initiative in the previous betting round.",
      },
      {
        id: 'd',
        text: 'A bet made by the pre-flop raiser on the flop.',
        explanation:
          'This is a continuation bet (c-bet).',
      },
    ],
    correctOptionId: 'c',
    explanation:
      "A donk bet is when the caller leads into the pre-flop aggressor before they have a chance to continuation bet — 'leading' into the player with initiative.",
    chapterReference: 'Chapter 8 — Donk Bets',
  },
  {
    id: 'q-8-012',
    chapterId: 8,
    conceptIds: ['equity', 'position'],
    type: 'multiple-choice',
    prompt:
      'In Hand 54, why is calling a half-pot c-bet with 77 on K-9-5 considered a mistake?',
    options: [
      {
        id: 'a',
        text: "Hero only has 5% equity against the Villain's range.",
        explanation:
          "Hero actually has significant raw equity (approx 48%), but it is not easily realized.",
      },
      {
        id: 'b',
        text: 'The pot odds of 25% are mathematically impossible to meet with an underpair.',
        explanation:
          "The pot odds are fine for the raw equity, but the spot is 'open action', not 'end of action'.",
      },
      {
        id: 'c',
        text: 'Because the Villain is tight and only bets with top pair or better.',
        explanation:
          "The Villain is an 'Aggro Reg' who likely bets his entire range here.",
      },
      {
        id: 'd',
        text: "Hero is out of position and much of his equity is 'Ghost Equity' that will be lost to future aggression.",
        explanation:
          'The difficulty of reaching showdown out of position against an aggressive opponent makes the flop call \u2212EV.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      "Despite having ~48% raw equity, Hero is OOP against an aggressive opponent. Much of that equity is Ghost Equity — it vanishes because Hero will be forced to fold on later streets.",
    chapterReference: 'Chapter 8 — Hand 54 Analysis',
  },
]
