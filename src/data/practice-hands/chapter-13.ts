import { generateChapterHands } from './hand-templates'
import type { PracticeHandScenario } from '@/types'

export const chapter13Hands: PracticeHandScenario[] = generateChapterHands({
  chapterId: 13,
  title: '3-Bet Pots and Balance',
  conceptIds: ['3-bet-pots', 'c-betting', 'sizing', 'range-advantage', 'spr'],
  scenarios: [
    // --- C-bet high board as aggressor ---
    {
      titleTemplate: 'C-bet 3-bet pot on high board with {hand} from {heroPos}',
      descriptionTemplate:
        'You 3-bet preflop from {heroPos} and got called by {villainPos} ({villainType}). Board: {board}. Pot is {potSize}bb. High-card board favors your 3-bet range.',
      street: 'flop',
      heroPositions: ['SB', 'BB', 'BU'],
      villainPositions: ['CO', 'HJ', 'BU'],
      villainTypes: ['reg'],
      handCategories: ['premium-pair', 'big-broadway-suited'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'ace-high' }],
      priorActionTemplate: 'Hero 3-bet, {villainPos} called. 3-bet pot. Board: high cards. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.33,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'In a 3-bet pot on a high-card board with {hand} from {heroPos}, c-bet small at ~1/3 pot. Your range has more overpairs and big aces than {villainPos} calling range. The small sizing is efficient because it risks little while maintaining high frequency on boards that favor you.',
      factors: ['range advantage', 'small sizing', 'high-card board', '3-bet pot dynamics'],
      difficulty: 'fundamentals',
    },
    // --- Check low connected board as aggressor ---
    {
      titleTemplate: 'Check 3-bet pot on low board with {hand} from {heroPos}',
      descriptionTemplate:
        'You 3-bet preflop from {heroPos} and got called by {villainPos} ({villainType}). Board: {board}. Pot is {potSize}bb. Low connected board does not favor your range.',
      street: 'flop',
      heroPositions: ['SB', 'BB'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg'],
      handCategories: ['big-broadway-suited', 'big-broadway-offsuit'],
      boardPatterns: [{ type: 'low-connected' }],
      priorActionTemplate: 'Hero 3-bet, {villainPos} called. 3-bet pot. Board: low connected. Pot: {potSize}bb',
      correctAction: 'check',
      alternativeActions: [{ action: 'bet', quality: 'bad' }],
      explanationTemplate:
        'In a 3-bet pot on a low connected board with {hand}, checking is correct. The caller has more sets, two-pairs, and strong draws on boards like {board}. Your range advantage disappears and c-betting frequently will get punished by check-raises.',
      factors: ['range disadvantage', 'low connected board', 'check frequency', 'caller advantage'],
      difficulty: 'standard',
    },
    // --- Small c-bet with air on favorable board ---
    {
      titleTemplate: 'Small c-bet bluff with {hand} on {board} in 3-bet pot',
      descriptionTemplate:
        'You 3-bet from {heroPos} and got called by {villainPos} ({villainType}). Board: {board}. Pot is {potSize}bb. You missed but the board favors your range.',
      street: 'flop',
      heroPositions: ['SB', 'BB', 'BU'],
      villainPositions: ['CO', 'HJ'],
      villainTypes: ['reg'],
      handCategories: ['air', 'suited-ace'],
      boardPatterns: [{ type: 'ace-high' }, { type: 'broadway' }],
      priorActionTemplate: 'Hero 3-bet, {villainPos} called. 3-bet pot. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.25,
      alternativeActions: [{ action: 'check', quality: 'acceptable' }],
      explanationTemplate:
        'With {hand} on {board} in a 3-bet pot, a small c-bet bluff is profitable. The board texture heavily favors the 3-bettor range. At 1/4 pot sizing, you only need a modest fold frequency to profit. The small size also sets up turn and river play with only 1-2 pot-sized bets remaining.',
      factors: ['small sizing efficiency', 'range advantage', 'bluff frequency', 'SPR planning'],
      difficulty: 'standard',
    },
    // --- Commit with top pair in 3-bet pot ---
    {
      titleTemplate: 'Commit with {hand} on {board} - low SPR in 3-bet pot',
      descriptionTemplate:
        'You called a 3-bet from {heroPos} and are in {villainPos} ({villainType}) 3-bet pot. Board: {board}. Pot is {potSize}bb. The low SPR means top pair is committing.',
      street: 'flop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['top-pair', 'overpair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'ace-high' }],
      priorActionTemplate: '{villainPos} 3-bet, Hero called. {villainPos} c-bets. Pot: {potSize}bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'raise', quality: 'acceptable' },
        { action: 'fold', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} on {board} in a 3-bet pot, the low SPR makes top pair or overpair a committing hand. With only 1-2 pot-sized bets left in the stacks, folding one pair is incorrect. Call the c-bet and plan to get the money in by the river.',
      factors: ['low SPR', 'commitment threshold', 'top pair strength', '3-bet pot stacks'],
      difficulty: 'fundamentals',
    },
    // --- Check-raise as defender on favorable board ---
    {
      titleTemplate: 'Check-raise {hand} as 3-bet defender on {board}',
      descriptionTemplate:
        'You called a 3-bet in {heroPos}. {villainPos} ({villainType}) c-bets on {board}. The board connects with your flatting range. Pot is {potSize}bb.',
      street: 'flop',
      heroPositions: ['CO', 'BU', 'HJ'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg'],
      handCategories: ['overpair', 'top-pair'],
      boardPatterns: [{ type: 'low-connected' }, { type: 'wet' }],
      priorActionTemplate: '{villainPos} 3-bet, Hero called from {heroPos}. {villainPos} c-bets. Pot: {potSize}bb',
      correctAction: 'raise',
      correctSizing: 2.5,
      alternativeActions: [
        { action: 'call', quality: 'acceptable' },
      ],
      explanationTemplate:
        'With {hand} on {board}, check-raising as the 3-bet defender is strong. This board connects more with your flatting range than the aggressor 3-bet range. Check-raising puts pressure on their c-bet bluffs and builds the pot with your strong hand on a board that favors you.',
      factors: ['defender board advantage', 'check-raise opportunity', 'range texture', 'board connectivity'],
      difficulty: 'standard',
    },
    // --- C-bet with draw in 3-bet pot ---
    {
      titleTemplate: 'C-bet draw in 3-bet pot: {hand} on {board}',
      descriptionTemplate:
        'You 3-bet from {heroPos} and got called by {villainPos} ({villainType}). Board: {board}. Pot is {potSize}bb. You have a draw that plays well as a c-bet bluff.',
      street: 'flop',
      heroPositions: ['SB', 'BB'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg'],
      handCategories: ['draw'],
      boardPatterns: [{ type: 'wet' }],
      priorActionTemplate: 'Hero 3-bet, {villainPos} called. 3-bet pot. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.33,
      alternativeActions: [{ action: 'check', quality: 'acceptable' }],
      explanationTemplate:
        'With {hand} on {board} in a 3-bet pot, c-betting with your draw is a strong semi-bluff. You have fold equity plus equity when called. In the compressed SPR of a 3-bet pot, hitting your draw often means stacking the opponent. Small sizing keeps the bluff efficient.',
      factors: ['semi-bluff', 'draw equity', 'compressed SPR', 'fold equity'],
      difficulty: 'standard',
    },
    // --- Fold air on unfavorable board ---
    {
      titleTemplate: 'Check-fold {hand} on unfavorable board in 3-bet pot',
      descriptionTemplate:
        'You 3-bet from {heroPos} and got called by {villainPos} ({villainType}). Board: {board}. Pot is {potSize}bb. The board does not favor your range and you have no equity.',
      street: 'flop',
      heroPositions: ['SB', 'BB'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg'],
      handCategories: ['air'],
      boardPatterns: [{ type: 'low-connected' }, { type: 'paired' }],
      priorActionTemplate: 'Hero 3-bet, {villainPos} called. 3-bet pot. Pot: {potSize}bb',
      correctAction: 'check',
      alternativeActions: [{ action: 'bet', quality: 'bad' }],
      explanationTemplate:
        'With {hand} on {board}, check and give up. This board connects with the caller range (sets, two-pairs, straight draws) far more than your 3-bet range. C-betting here with air gets check-raised frequently and bleeds money. Save your chips for favorable boards.',
      factors: ['unfavorable board', 'range disadvantage', 'give up', 'selective c-betting'],
      difficulty: 'fundamentals',
    },
    // --- Turn play in 3-bet pot as aggressor ---
    {
      titleTemplate: 'Continue aggression in 3-bet pot with {hand} on {board}',
      descriptionTemplate:
        'You c-bet the flop in a 3-bet pot from {heroPos} with {hand}. {villainPos} ({villainType}) called. Turn: {board}. Pot is {potSize}bb. The turn favors your range.',
      street: 'turn',
      heroPositions: ['SB', 'BB', 'BU'],
      villainPositions: ['CO', 'BU', 'HJ'],
      villainTypes: ['reg'],
      handCategories: ['overpair', 'top-pair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'ace-high' }],
      priorActionTemplate: 'Hero 3-bet, c-bet flop. {villainPos} called. Turn arrives. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.5,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} on {board} in a 3-bet pot, continuing to bet the turn for value is correct. The compressed SPR means you are building toward a river shove. After a small flop c-bet, a half-pot turn bet sets up a natural river all-in with your strong hand.',
      factors: ['value betting', 'SPR commitment', 'three-street plan', 'stack-off planning'],
      difficulty: 'standard',
    },
    // --- Give up turn in 3-bet pot ---
    {
      titleTemplate: 'Give up turn bluff in 3-bet pot with {hand}',
      descriptionTemplate:
        'You c-bet the flop in a 3-bet pot from {heroPos} with {hand}. {villainPos} ({villainType}) called. Turn bricks ({board}). Pot is {potSize}bb. No reason to continue barreling.',
      street: 'turn',
      heroPositions: ['SB', 'BB'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg', 'loose-passive'],
      handCategories: ['air'],
      boardPatterns: [{ type: 'dry-high' }],
      priorActionTemplate: 'Hero 3-bet, c-bet flop. {villainPos} called. Brick turn. Pot: {potSize}bb',
      correctAction: 'check',
      alternativeActions: [{ action: 'bet', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} in a 3-bet pot after the turn bricks, check and give up. You bluffed the flop and got called. The {villainType} is not folding to another barrel on a turn that changes nothing. Preserve your stack for better spots.',
      factors: ['brick turn', 'bluff abandonment', 'opponent resistance', 'chip preservation'],
      difficulty: 'fundamentals',
    },
    // --- Monotone board in 3-bet pot ---
    {
      titleTemplate: 'Navigate monotone board {board} in 3-bet pot with {hand}',
      descriptionTemplate:
        'You 3-bet from {heroPos} and got called by {villainPos} ({villainType}). Board: {board} (monotone). Pot is {potSize}bb. Monotone boards require careful c-bet selection.',
      street: 'flop',
      heroPositions: ['SB', 'BB'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg'],
      handCategories: ['premium-pair', 'overpair'],
      boardPatterns: [{ type: 'monotone' }],
      priorActionTemplate: 'Hero 3-bet, {villainPos} called. 3-bet pot. Monotone board. Pot: {potSize}bb',
      correctAction: 'check',
      alternativeActions: [
        { action: 'bet', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} on a monotone board in a 3-bet pot, checking is often best even with overpairs. The monotone texture dramatically changes the dynamics: the caller can have many flush combos, and your overpair is vulnerable. Check to pot control and re-evaluate on the turn.',
      factors: ['monotone board', 'pot control', 'flush vulnerability', 'board texture caution'],
      difficulty: 'standard',
    },
    // --- Sizing tells in 3-bet pots ---
    {
      titleTemplate: 'Respond to small c-bet with {hand} on {board}',
      descriptionTemplate:
        'You called a 3-bet in {heroPos}. {villainPos} ({villainType}) c-bets 1/4 pot on {board}. Pot is {potSize}bb. The small sizing indicates a wide c-bet range.',
      street: 'flop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg'],
      handCategories: ['medium-pair', 'draw'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'ace-high' }],
      priorActionTemplate: '{villainPos} 3-bet, Hero called. {villainPos} c-bets 1/4 pot. Pot: {potSize}bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'raise', quality: 'suboptimal' },
        { action: 'fold', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} on {board} facing a small 1/4 pot c-bet, calling is correct. The small sizing means {villainType} is c-betting a wide range. You are getting good odds to continue with medium-strength hands and draws. Folding to such a small bet with any equity is a major error.',
      factors: ['small sizing interpretation', 'pot odds', 'wide c-bet range', 'defense frequency'],
      difficulty: 'standard',
    },
    // --- Paired board in 3-bet pot ---
    {
      titleTemplate: 'C-bet paired board in 3-bet pot with {hand}',
      descriptionTemplate:
        'You 3-bet from {heroPos} and got called by {villainPos} ({villainType}). Board: {board} (paired). Pot is {potSize}bb. You have overcards on a low paired board.',
      street: 'flop',
      heroPositions: ['SB', 'BB', 'BU'],
      villainPositions: ['CO', 'HJ'],
      villainTypes: ['reg'],
      handCategories: ['big-broadway-suited', 'big-broadway-offsuit'],
      boardPatterns: [{ type: 'paired' }],
      priorActionTemplate: 'Hero 3-bet, {villainPos} called. 3-bet pot. Paired board. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.25,
      alternativeActions: [{ action: 'check', quality: 'acceptable' }],
      explanationTemplate:
        'With {hand} on a low paired board, c-betting small is profitable. Paired boards reduce the number of strong hands either player can have (fewer trips combos). Your overcards have good equity and the paired texture means the caller rarely has a monster. A small bet takes it down often.',
      factors: ['paired board dynamics', 'overcard equity', 'reduced combos', 'small sizing'],
      difficulty: 'standard',
    },
    // --- Advanced: balance check-backs in 3-bet pot ---
    {
      titleTemplate: 'Check back {hand} for balance on {board} in 3-bet pot',
      descriptionTemplate:
        'You 3-bet from {heroPos} and got called by {villainPos} ({villainType}). Board: {board}. Pot is {potSize}bb. Despite having a strong hand, checking protects your check-back range.',
      street: 'flop',
      heroPositions: ['BU'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['reg'],
      handCategories: ['overpair', 'premium-pair'],
      boardPatterns: [{ type: 'wet' }, { type: 'low-connected' }],
      priorActionTemplate: 'Hero 3-bet, {villainPos} called. 3-bet pot. Pot: {potSize}bb',
      correctAction: 'check',
      alternativeActions: [{ action: 'bet', quality: 'acceptable' }],
      explanationTemplate:
        'With {hand} on {board} in a 3-bet pot, checking back with a strong hand protects your check range. If you only check back weak hands, the {villainType} can attack your checks relentlessly. By mixing strong hands into your checks on boards that favor the caller, you maintain balance.',
      factors: ['range balance', 'protecting check range', 'opponent exploitation prevention', 'GTO concept'],
      difficulty: 'advanced',
    },
    // --- Advanced: turn shove in 3-bet pot ---
    {
      titleTemplate: 'Shove turn in 3-bet pot with {hand} on {board}',
      descriptionTemplate:
        'You c-bet the flop in a 3-bet pot from {heroPos} with {hand}. {villainPos} ({villainType}) called. Turn: {board}. Pot is {potSize}bb. The SPR is now under 1. It is time to commit.',
      street: 'turn',
      heroPositions: ['SB', 'BB', 'BU'],
      villainPositions: ['CO', 'BU', 'HJ'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['overpair', 'top-pair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'ace-high' }],
      priorActionTemplate: 'Hero 3-bet, c-bet flop. {villainPos} called. SPR < 1. Turn: Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 1.0,
      alternativeActions: [{ action: 'check', quality: 'bad' }],
      explanationTemplate:
        'With {hand} on {board} in a 3-bet pot with SPR under 1, shoving the turn is correct. You are mathematically committed with top pair or better at this stack depth. Checking gives free cards and misses value. The shallow stacks make one pair a premium holding worth committing.',
      factors: ['SPR commitment', 'pot-committed', 'shallow stacks', 'value shove'],
      difficulty: 'advanced',
    },
    // --- Exploitative: c-bet vs recreational in 3-bet pot ---
    {
      titleTemplate: 'Exploit recreational player: c-bet {hand} on {board}',
      descriptionTemplate:
        'You 3-bet from {heroPos} and got called by {villainPos} ({villainType}). Board: {board}. Pot is {potSize}bb. Against a recreational player, adjust your c-bet strategy.',
      street: 'flop',
      heroPositions: ['SB', 'BB', 'BU'],
      villainPositions: ['CO', 'HJ', 'BU'],
      villainTypes: ['loose-passive', 'aggro-fish'],
      handCategories: ['top-pair', 'overpair', 'premium-pair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'dry-low' }, { type: 'ace-high' }],
      priorActionTemplate: 'Hero 3-bet, {villainPos} called. 3-bet pot. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.5,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'Against a {villainType} in a 3-bet pot with {hand}, c-bet larger than normal for pure value. Recreational players call too much, so increase your value bet sizing and decrease your bluff frequency. Extract maximum value from their calling tendencies.',
      factors: ['exploitative sizing', 'recreational tendencies', 'value extraction', 'reduced bluffs'],
      difficulty: 'exploitative',
    },
    // --- As defender: fold low equity hands ---
    {
      titleTemplate: 'Fold {hand} as 3-bet defender on {board}',
      descriptionTemplate:
        'You called a 3-bet in {heroPos}. {villainPos} ({villainType}) c-bets on {board}. Pot is {potSize}bb. Your hand missed completely and has no playability.',
      street: 'flop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg', 'nitty'],
      handCategories: ['air', 'small-pair'],
      boardPatterns: [{ type: 'ace-high' }, { type: 'broadway' }],
      priorActionTemplate: '{villainPos} 3-bet, Hero called from {heroPos}. {villainPos} c-bets. Pot: {potSize}bb',
      correctAction: 'fold',
      alternativeActions: [
        { action: 'call', quality: 'bad' },
        { action: 'raise', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} on {board} facing a c-bet in a 3-bet pot, folding is correct. You missed the board completely and the high-card texture heavily favors the 3-bettor range. Continuing with no equity and no draw in a bloated pot is a losing play.',
      factors: ['no equity', 'board texture', 'range disadvantage', 'pot size'],
      difficulty: 'fundamentals',
    },
  ],
})
