import type { QuizQuestion } from '@/types'

export const chapter4Questions: QuizQuestion[] = [
  {
    id: 'q-4-001',
    chapterId: 4,
    conceptIds: ['c-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "What is the primary difference between a 'Value C-Bet' and a 'Light C-Bet' according to the source material?",
    options: [
      {
        id: 'a',
        text: 'A value c-bet is only made on dry boards, whereas a light c-bet is reserved for wet boards.',
        explanation:
          'Hand strength and intent dictate the type of c-bet, though board texture certainly influences the success of either.',
      },
      {
        id: 'b',
        text: 'A value c-bet aims to get called by weaker hands, while a light c-bet aims to pick up the pot with a display of strength.',
        explanation:
          'Value bets seek to extract chips from worse holdings, whereas light c-bets utilize fold equity when Hero likely lacks the best hand.',
      },
      {
        id: 'c',
        text: 'A value c-bet is made by the pre-flop raiser, while a light c-bet is made by the caller.',
        explanation:
          'By definition, any continuation bet must be made by the original pre-flop aggressor.',
      },
      {
        id: 'd',
        text: 'A light c-bet is always smaller in sizing than a value c-bet to minimize risk.',
        explanation:
          'While sizing varies, the core distinction lies in the intent and hand strength rather than the bet amount itself.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Value c-bets seek calls from worse hands to extract chips. Light c-bets leverage fold equity when Hero likely does not have the best hand.',
    chapterReference: 'Chapter 4 — C-Bet Types',
  },
  {
    id: 'q-4-002',
    chapterId: 4,
    conceptIds: ['c-betting', 'board-texture'],
    type: 'multiple-choice',
    prompt:
      "Which of the following describes a 'Type 5 - Soaking' board texture and its impact on light c-betting?",
    options: [
      {
        id: 'a',
        text: 'It is a dangerous flop that connects heavily with common calling ranges, requiring Hero to have good equity to justify a light c-bet.',
        explanation:
          'Soaking boards offer many straight and flush possibilities, meaning opponents fold less often and Hero needs backup equity.',
      },
      {
        id: 'b',
        text: 'It is a board with three cards of the same suit, which generally increases the profitability of a light c-bet due to fear.',
        explanation:
          'Monotone boards are very wet and usually decrease fold equity as many hands in a calling range contain a single card of that suit.',
      },
      {
        id: 'c',
        text: "It is a dry board where opponents rarely connect, making a light c-bet mandatory with any two cards.",
        explanation:
          "This describes a 'Bone Dry' texture, which is the opposite of a soaking board.",
      },
      {
        id: 'd',
        text: 'It refers to a paired board where trips are possible, leading to high fold equity against most opponents.',
        explanation:
          'Paired boards are typically drier and offer more fold equity than soaking boards, which are highly coordinated.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Soaking boards connect heavily with calling ranges, reducing fold equity. Hero needs backup equity (draws, outs) to justify a light c-bet on these textures.',
    chapterReference: 'Chapter 4 — Board Texture Types',
  },
  {
    id: 'q-4-003',
    chapterId: 4,
    conceptIds: ['c-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "Why is 'Vulnerable Showdown Value (SDV)' considered a 'Good Factor' for making a light c-bet?",
    options: [
      {
        id: 'a',
        text: 'Betting protects the hand from being outdrawn by hands that currently have significant equity but would fold to a bet.',
        explanation:
          "Vulnerable hands can win at showdown but often get worse on later streets, so 'denying equity' by making Villain fold is beneficial.",
      },
      {
        id: 'b',
        text: 'It allows Hero to build a massive pot for value against hands that are currently beating him.',
        explanation:
          'A light c-bet by definition is not betting for value, and building a pot against better hands is counter-productive.',
      },
      {
        id: 'c',
        text: "It guarantees that Hero will have the best hand by the river regardless of the turn card.",
        explanation:
          "SDV only refers to the current strength; vulnerability implies that the hand's status as the 'best' is at risk.",
      },
      {
        id: 'd',
        text: "Vulnerable hands have the highest possible equity when called by an opponent's range.",
        explanation:
          'Vulnerable SDV usually has mediocre equity when called, as Villain typically only continues with hands that beat it or have high equity.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Vulnerable SDV hands can currently win at showdown but are at risk of being outdrawn. Betting denies equity by forcing Villain to fold hands that could overtake on later streets.',
    chapterReference: 'Chapter 4 — Light C-Bet Factors',
  },
  {
    id: 'q-4-004',
    chapterId: 4,
    conceptIds: ['c-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "According to the 'Fish Flop Fallacy', what is a common misconception regarding wide pre-flop ranges and low boards?",
    options: [
      {
        id: 'a',
        text: 'Players with wide ranges only play high cards, so they always miss low flops.',
        explanation:
          'While they play many high cards, the fallacy specifically addresses the belief that they hit low boards more often than they actually do.',
      },
      {
        id: 'b',
        text: "A wide range connects more frequently with low flops because it contains many low cards that 'Regs' would fold.",
        explanation:
          'In reality, even a wide range contains more high/medium card combinations than low ones, and the lowest cards are still often folded pre-flop.',
      },
      {
        id: 'c',
        text: 'Fish always hit sets on low boards because they play every pocket pair.',
        explanation:
          'While Fish may play all pocket pairs, this is a matter of range composition rather than a specific fallacy about board connection frequency.',
      },
      {
        id: 'd',
        text: 'Wide ranges are easier to bluff on wet boards than on dry boards.',
        explanation:
          'The fallacy specifically concerns how low cards in a wide range interact with low flops, not board coordination in general.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'The Fish Flop Fallacy is the misconception that wide ranges hit low boards more often. In reality, even wide ranges contain predominantly high/medium cards.',
    chapterReference: 'Chapter 4 — The Fish Flop Fallacy',
  },
  {
    id: 'q-4-005',
    chapterId: 4,
    conceptIds: ['c-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "When facing a 'Nit' who calls from the Button, why might an AK holding on a Q98 flop be a poor candidate for a c-bet?",
    options: [
      {
        id: 'a',
        text: 'Hero is in position, so he should always check to see a free turn card with his overcards.',
        explanation:
          'In the example provided, the Button (BU) called the Hero (HJ), meaning Hero is actually out of position.',
      },
      {
        id: 'b',
        text: "A Nit's calling range is narrow and consists of many medium pairs and broadway hands that connect well with this board.",
        explanation:
          "Nits play very strong ranges, meaning their 'misses' on a board like Q98 still often have significant equity or a pair.",
      },
      {
        id: 'c',
        text: "The board is 'Bone Dry', and Nits never fold on dry boards.",
        explanation:
          'A Q98 board is semi-wet, and Nits are actually the most likely group to fold on dry boards when they miss.',
      },
      {
        id: 'd',
        text: 'Hero has too much showdown value with Ace-high to turn it into a bluff.',
        explanation:
          "Against a Nit's range on this board, Ace-high has almost no showdown value and is effectively air.",
      },
    ],
    correctOptionId: 'b',
    explanation:
      "A Nit's narrow calling range connects very well with Q98 — medium pairs, broadway hands, and strong draws are all present, giving AK very little fold equity.",
    chapterReference: 'Chapter 4 — C-Betting Against Nits',
  },
  {
    id: 'q-4-006',
    chapterId: 4,
    conceptIds: ['c-betting', 'board-texture'],
    type: 'multiple-choice',
    prompt:
      "What is the recommended approach for c-bet sizing on dry boards when playing against a 'Reg'?",
    options: [
      {
        id: 'a',
        text: 'Always bet exactly 1/2 Pot to make the math simple for future streets.',
        explanation:
          'Sizing should be dynamic based on board texture and range composition rather than a fixed rule for simplicity.',
      },
      {
        id: 'b',
        text: 'Size large (e.g., 3/4 Pot) to maximize the pressure on their air hands.',
        explanation:
          'Large sizing increases your Required Fold Equity (RFE) unnecessarily when a smaller bet achieves the same result.',
      },
      {
        id: 'c',
        text: 'Check every hand to remain balanced and avoid being exploited by raises.',
        explanation:
          'Checking your entire range misses out on profitable c-betting opportunities that exist because most hands miss most flops.',
      },
      {
        id: 'd',
        text: 'Size small (e.g., 1/3 Pot) to keep the Required Fold Equity (RFE) low for a range that contains a lot of air.',
        explanation:
          'Small bets on dry boards risk less to win the pot, which is ideal when your range is wide and both players likely missed.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'On dry boards against Regs, small sizing (~1/3 pot) keeps RFE low, allowing Hero to profitably c-bet a wide range since both players likely missed.',
    chapterReference: 'Chapter 4 — C-Bet Sizing on Dry Boards',
  },
  {
    id: 'q-4-007',
    chapterId: 4,
    conceptIds: ['c-betting'],
    type: 'multiple-choice',
    prompt:
      "Which HUD stat is specifically highlighted as a tool to identify 'Aggro Fish' who might raise c-bets recklessly?",
    options: [
      {
        id: 'a',
        text: 'Aggression Factor (AF)',
        explanation:
          'AF is a general measure of aggression across all streets, whereas Raise F Cbet is specific to the c-betting situation.',
      },
      {
        id: 'b',
        text: 'Raise F Cbet',
        explanation:
          'This stat identifies players who are unbalanced toward raising flops lightly, making light c-betting against them much riskier.',
      },
      {
        id: 'c',
        text: 'VPIP/PFR',
        explanation:
          'While these help define the player type, they do not specifically track post-flop aggression against continuation bets.',
      },
      {
        id: 'd',
        text: 'Fold to Flop C-Bet',
        explanation:
          'This stat tells you how often they give up, but not how aggressively they fight back.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Raise F Cbet specifically tracks how often a player raises continuation bets, making it the key stat for identifying Aggro Fish who fight back recklessly.',
    chapterReference: 'Chapter 4 — HUD Stats for C-Betting',
  },
  {
    id: 'q-4-008',
    chapterId: 4,
    conceptIds: ['c-betting', 'position'],
    type: 'multiple-choice',
    prompt:
      "How does 'Position' influence the decision to make a light c-bet according to the manual?",
    options: [
      {
        id: 'a',
        text: 'Being In Position (IP) increases the expected EV of a c-bet because it is easier to realize equity and navigate future streets.',
        explanation:
          'Acting last provides more information and control over the pot size, making marginal c-bets more profitable than when OOP.',
      },
      {
        id: 'b',
        text: 'Being Out of Position (OOP) requires a smaller c-bet size to discourage the opponent from calling.',
        explanation:
          'Sizing is more dependent on board texture and range; being OOP often makes c-betting less attractive regardless of sizing.',
      },
      {
        id: 'c',
        text: 'Position has no impact on light c-betting; only board texture and equity matter.',
        explanation:
          'Position is explicitly listed as a key factor that can turn a check/fold into a profitable c-bet.',
      },
      {
        id: 'd',
        text: "Being Out of Position (OOP) is better because it allows you to see the opponent's action first on the turn.",
        explanation:
          'The player In Position (IP) acts last on all post-flop streets, which is a significant advantage.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Being IP increases c-bet EV because acting last provides information, pot control, and the ability to realize equity on future streets.',
    chapterReference: 'Chapter 4 — Position and C-Betting',
  },
  {
    id: 'q-4-009',
    chapterId: 4,
    conceptIds: ['c-betting', 'fold-equity'],
    type: 'multiple-choice',
    prompt:
      "If Hero has a hand with 9 outs against a calling range and bets 1/2 Pot, why is the 'Raw RFE' of 33% an overestimation of what Hero actually needs?",
    options: [
      {
        id: 'a',
        text: 'Because the pot equity and fold equity should be added together to exceed 100%.',
        explanation:
          "Equity and fold equity are different components of EV that combine, but they don't 'add' to reach a 100% threshold.",
      },
      {
        id: 'b',
        text: 'Because Hero will sometimes win the pot even when called by improving to the best hand.',
        explanation:
          "Pot equity reduces the required fold equity; if you win 20% of the time when called, you don't need the opponent to fold as often.",
      },
      {
        id: 'c',
        text: '1/2 Pot bets are mathematically guaranteed to work 50% of the time.',
        explanation:
          'Betting frequency and success rate are determined by player tendencies and board texture, not just the bet size itself.',
      },
      {
        id: 'd',
        text: 'Raw RFE only applies to value bets, not light c-bets.',
        explanation:
          'RFE is a concept primarily used for bluffs and light bets to determine the necessary success rate to break even.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Raw RFE overestimates because Hero has pot equity — with 9 outs, Hero wins some percentage of the time even when called, reducing how often Villain needs to fold.',
    chapterReference: 'Chapter 4 — RFE and Pot Equity',
  },
  {
    id: 'q-4-010',
    chapterId: 4,
    conceptIds: ['c-betting', 'board-texture'],
    type: 'multiple-choice',
    prompt:
      "In the context of 'Turn and River Prospects', what defines a 'Scare Card'?",
    options: [
      {
        id: 'a',
        text: 'The exact card that gives Hero the nuts.',
        explanation:
          "A card that gives Hero the nuts is great for equity, but it is only a 'scare card' if the opponent perceives it as dangerous to them.",
      },
      {
        id: 'b',
        text: 'Any card higher than a Jack.',
        explanation:
          'While high cards can be scare cards, their status depends on how they interact with the perceived ranges of the players.',
      },
      {
        id: 'c',
        text: "A card that is perceived to improve a player's range, making the opponent more inclined to fold.",
        explanation:
          'Scare cards (like an Ace on a King-high board) shift the range advantage toward the aggressor, allowing for effective double-barreling.',
      },
      {
        id: 'd',
        text: 'A card that completes a flush, because it always scares every player.',
        explanation:
          "A flush card only scares an opponent if Hero's range is likely to contain that flush; otherwise, it may not be a scare card.",
      },
    ],
    correctOptionId: 'c',
    explanation:
      "A scare card is one perceived to improve the aggressor's range, making opponents more likely to fold. It shifts range advantage and enables effective double-barreling.",
    chapterReference: 'Chapter 4 — Turn and River Prospects',
  },
  {
    id: 'q-4-011',
    chapterId: 4,
    conceptIds: ['c-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "Against a 'Passive Fish' who is 'Fit-or-Fold', what is the suggested exploitative adjustment for c-bet sizing?",
    options: [
      {
        id: 'a',
        text: 'Check your entire range to induce them to bluff with their air.',
        explanation:
          'Passive fish rarely bluff; checking typically just lets them see a free card with their draws or weak pairs.',
      },
      {
        id: 'b',
        text: 'Use a single balanced size for your entire range to avoid giving away information.',
        explanation:
          "Passive fish are 'non-thinking' and won't exploit your sizing, so remaining balanced misses out on value.",
      },
      {
        id: 'c',
        text: 'Always bet the pot to maximize the pressure on their wide pre-flop range.',
        explanation:
          'Betting the pot with air against a player who only calls when they have a pair is an unnecessary risk of chips.',
      },
      {
        id: 'd',
        text: 'Bet small with air to lose less when they hit, and bet large with value to get paid when they hit.',
        explanation:
          'Since they call based on their own hand strength rather than your sizing, you should maximize value and minimize risk exploitatively.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      'Against fit-or-fold passive fish, use exploitative sizing: small with air (lose less when they have it) and large with value (extract max when they call).',
    chapterReference: 'Chapter 4 — Exploitative C-Bet Sizing',
  },
  {
    id: 'q-4-012',
    chapterId: 4,
    conceptIds: ['c-betting', 'fold-equity'],
    type: 'multiple-choice',
    prompt:
      "Why does 'Multiwayness' significantly decrease the profitability of a light c-bet?",
    options: [
      {
        id: 'a',
        text: "Multiway pots usually have more 'Aggro Fish' who will raise you.",
        explanation:
          "The presence of extra players doesn't change their individual types, but it increases the collective chance of someone having a strong hand.",
      },
      {
        id: 'b',
        text: "The pot is already large enough that Hero doesn't need to win it immediately.",
        explanation:
          'A large pot is more desirable to win; the issue is the probability of success, not the reward.',
      },
      {
        id: 'c',
        text: 'It is illegal in most 6-max games to c-bet into more than two players.',
        explanation:
          'C-betting is a strategy choice allowed in any number of players; it is simply less effective in multiway spots.',
      },
      {
        id: 'd',
        text: 'The probability that at least one opponent has flopped a hand they are unwilling to fold increases with every extra player.',
        explanation:
          "Mathematically, the more people in the pot, the higher the chance that someone 'connected,' drastically reducing your total fold equity.",
      },
    ],
    correctOptionId: 'd',
    explanation:
      'In multiway pots, the probability that at least one opponent has connected with the board rises sharply with each extra player, drastically reducing total fold equity.',
    chapterReference: 'Chapter 4 — Multiway C-Betting',
  },
]
