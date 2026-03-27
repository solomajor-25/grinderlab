import { generateChapterHands } from './hand-templates'
import type { PracticeHandScenario } from '@/types'

export const chapter14Hands: PracticeHandScenario[] = generateChapterHands({
  chapterId: 14,
  title: 'Stack Depth',
  conceptIds: ['stack-depth', 'implied-odds', 'spr', 'pot-control', 'hand-selection'],
  scenarios: [
    // --- Deep stacks: set mine with small pairs ---
    {
      titleTemplate: 'Set mine {hand} deep-stacked vs {villainPos} open',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb. Stacks are deep (~180bb effective). Small pairs increase in value with deep stacks due to implied odds.',
      street: 'preflop',
      heroPositions: ['CO', 'BU', 'HJ'],
      villainPositions: ['UTG', 'HJ'],
      villainTypes: ['reg', 'loose-passive'],
      handCategories: ['small-pair'],
      priorActionTemplate: '{villainPos} opens to 2.5bb. Effective stacks ~180bb.',
      correctAction: 'call',
      alternativeActions: [
        { action: 'fold', quality: 'suboptimal' },
        { action: 'raise', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} and deep stacks (~180bb), calling to set mine is very profitable. Deep stacks provide the implied odds needed: when you hit a set, you can win a huge pot. The deeper the stacks, the more valuable speculative hands like small pairs become.',
      factors: ['implied odds', 'deep stacks', 'set mining', 'speculative hands'],
      difficulty: 'fundamentals',
    },
    // --- Deep stacks: call with suited ace ---
    {
      titleTemplate: 'Call {hand} deep-stacked for implied odds from {heroPos}',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb. Stacks are deep (~200bb effective). Suited aces gain value with deep stacks for nut flush potential.',
      street: 'preflop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['UTG', 'HJ', 'CO'],
      villainTypes: ['reg', 'loose-passive'],
      handCategories: ['suited-ace'],
      priorActionTemplate: '{villainPos} opens to 2.5bb. Effective stacks ~200bb.',
      correctAction: 'call',
      alternativeActions: [
        { action: 'raise', quality: 'acceptable' },
        { action: 'fold', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} deep-stacked, the implied odds make this a clear call. Suited aces make nut flushes that can stack deep opponents. The deeper the stacks, the more you can win when you make the nuts. Position amplifies the implied odds further.',
      factors: ['implied odds', 'nut potential', 'deep stacks', 'suited ace value'],
      difficulty: 'fundamentals',
    },
    // --- Deep stacks: tighten EP opens ---
    {
      titleTemplate: 'Fold {hand} deep from {heroPos} - EP tightening required',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. Stacks are deep (~200bb effective). Deep stacks amplify post-flop mistakes, requiring tighter early position opens.',
      street: 'preflop',
      heroPositions: ['UTG', 'HJ'],
      villainPositions: ['CO', 'BU', 'SB', 'BB'],
      villainTypes: ['reg'],
      handCategories: ['weak-broadway', 'suited-gapper'],
      priorActionTemplate: 'Deep stacks ~200bb. No action to hero.',
      correctAction: 'fold',
      alternativeActions: [{ action: 'raise', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} in {heroPos} at 200bb deep, fold. Deep stacks amplify positional disadvantage and post-flop mistakes. Marginal hands from early position become losing propositions because you will face difficult decisions for big pots out of position.',
      factors: ['deep stack tightening', 'early position', 'amplified mistakes', 'positional disadvantage'],
      difficulty: 'standard',
    },
    // --- Deep stacks: pot control with one pair ---
    {
      titleTemplate: 'Pot control with {hand} on {board} - deep stacks',
      descriptionTemplate:
        'You are in {heroPos} deep-stacked with {hand} on {board}. Pot is {potSize}bb but effective stacks are ~180bb. One pair is not strong enough to play for stacks deep.',
      street: 'flop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['reg'],
      handCategories: ['top-pair', 'overpair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'ace-high' }],
      priorActionTemplate: 'Hero opened, {villainPos} called. Deep stacks ~180bb. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.33,
      alternativeActions: [
        { action: 'check', quality: 'acceptable' },
      ],
      explanationTemplate:
        'With {hand} on {board} at deep stacks, bet small for pot control. One pair cannot profitably play for 180bb stacks. A small c-bet gets value from worse hands while keeping the pot manageable. Plan to check a street later to avoid bloating the pot beyond what one pair can justify.',
      factors: ['pot control', 'one pair hand', 'deep stacks', 'avoid stacking off'],
      difficulty: 'standard',
    },
    // --- Deep stacks: avoid stacking off with TPTK ---
    {
      titleTemplate: 'Don\'t stack off with {hand} on {board} deep',
      descriptionTemplate:
        'You hold {hand} on {board} from {heroPos}. Stacks started at ~200bb and the pot has grown to {potSize}bb. {villainPos} ({villainType}) raises your bet. With deep stacks, one pair is rarely good enough.',
      street: 'turn',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['reg', 'nitty'],
      handCategories: ['top-pair', 'overpair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'ace-high' }],
      priorActionTemplate: 'Hero bet flop and turn. {villainPos} raises turn. Deep stacks. Pot: {potSize}bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'fold', quality: 'acceptable' },
        { action: 'raise', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} on {board} at deep stacks facing a turn raise, just call. Re-raising commits your stack and at 200bb deep, your opponent needs an extremely strong hand to raise. One pair is a pot-control hand at these stack depths, not a stacking hand.',
      factors: ['deep stack caution', 'one pair hand strength', 'pot control', 'raise strength'],
      difficulty: 'standard',
      replayVariant: {
        description: 'Same spot at 80bb effective',
        change: 'At standard 80bb stacks, this SPR makes top pair strong enough to commit. The shallower stacks change one pair from a pot-control hand to a committing hand.',
      },
    },
    // --- Shallow stacks: push/fold with premium ---
    {
      titleTemplate: 'Shove {hand} from {heroPos} with shallow stacks',
      descriptionTemplate:
        'You hold {hand} in {heroPos} with only ~25bb effective. At shallow stacks, simplify to push/fold with strong hands.',
      street: 'preflop',
      heroPositions: ['UTG', 'HJ', 'CO', 'BU', 'SB'],
      villainPositions: ['BB'],
      villainTypes: ['reg', 'loose-passive', 'aggro-fish'],
      handCategories: ['premium-pair', 'big-broadway-suited'],
      priorActionTemplate: 'Shallow stacks ~25bb. No action to hero.',
      correctAction: 'raise',
      correctSizing: 25,
      alternativeActions: [{ action: 'call', quality: 'bad' }],
      explanationTemplate:
        'With {hand} at 25bb effective from {heroPos}, shoving is correct. At shallow stacks, open-raising to 2.5bb leaves you committed to any post-flop action. Simplify by shoving all-in preflop to maximize fold equity and avoid post-flop decisions with a hand strong enough to commit.',
      factors: ['shallow stacks', 'push/fold', 'simplified strategy', 'commitment'],
      difficulty: 'fundamentals',
    },
    // --- Shallow stacks: fold marginal hands ---
    {
      titleTemplate: 'Fold {hand} from {heroPos} at shallow stacks',
      descriptionTemplate:
        'You hold {hand} in {heroPos} with ~30bb effective. Shallow stacks reduce the value of speculative hands that need implied odds.',
      street: 'preflop',
      heroPositions: ['UTG', 'HJ', 'CO'],
      villainPositions: ['BB'],
      villainTypes: ['reg'],
      handCategories: ['suited-connector', 'suited-gapper', 'small-pair'],
      priorActionTemplate: 'Shallow stacks ~30bb. No action to hero.',
      correctAction: 'fold',
      alternativeActions: [
        { action: 'raise', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} at 30bb effective from {heroPos}, fold. Speculative hands need deep stacks for implied odds. At shallow stacks, you cannot win enough post-flop to justify the preflop investment. Focus on hands that survive all-in confrontations: big pairs and strong broadways.',
      factors: ['shallow stacks', 'implied odds absent', 'speculative hand devaluation'],
      difficulty: 'standard',
    },
    // --- Shallow: open tighter from EP ---
    {
      titleTemplate: 'Tighten opens with {hand} from {heroPos} at 40bb',
      descriptionTemplate:
        'You hold {hand} in {heroPos} with ~40bb effective. At these stack depths, trim the weakest opens and focus on hands that play well short-stacked.',
      street: 'preflop',
      heroPositions: ['UTG', 'HJ'],
      villainPositions: ['CO', 'BU', 'BB'],
      villainTypes: ['reg'],
      handCategories: ['weak-broadway', 'suited-gapper'],
      priorActionTemplate: 'Stacks ~40bb. No action to hero.',
      correctAction: 'fold',
      alternativeActions: [{ action: 'raise', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} from {heroPos} at 40bb, fold. Shallow stacks demand tighter opens from early position. These hands do not perform well in the inevitable all-in situations that short stacks create. Open only hands that can withstand 3-bet shoves.',
      factors: ['shallow stack opening', 'all-in equity', 'range tightening', 'early position'],
      difficulty: 'standard',
    },
    // --- SPR planning: low SPR commit ---
    {
      titleTemplate: 'Commit with {hand} at low SPR on {board}',
      descriptionTemplate:
        'You are in {heroPos} with {hand} on {board}. The flop SPR is about 3. Pot is {potSize}bb. {villainPos} ({villainType}) bets. At SPR under 4, top pair is strong enough to commit.',
      street: 'flop',
      heroPositions: ['CO', 'BU', 'BB'],
      villainPositions: ['SB', 'BB', 'CO'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['top-pair', 'overpair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'ace-high' }],
      priorActionTemplate: 'Preflop action created SPR ~3. {villainPos} bets. Pot: {potSize}bb',
      correctAction: 'raise',
      correctSizing: 2.5,
      alternativeActions: [
        { action: 'call', quality: 'acceptable' },
        { action: 'fold', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} on {board} at SPR ~3, you are committed with top pair or better. The low SPR means folding one pair is mathematically incorrect. Raise to get the money in while you likely have the best hand. SPR under 4 = commit with top pair.',
      factors: ['SPR threshold', 'commitment level', 'low SPR strategy', 'top pair commitment'],
      difficulty: 'standard',
    },
    // --- SPR planning: high SPR caution ---
    {
      titleTemplate: 'Exercise caution with {hand} at high SPR on {board}',
      descriptionTemplate:
        'You are in {heroPos} with {hand} on {board}. The flop SPR is about 12. Pot is {potSize}bb. {villainPos} ({villainType}) check-raises. At high SPR, one pair needs careful consideration.',
      street: 'flop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['reg'],
      handCategories: ['top-pair', 'overpair'],
      boardPatterns: [{ type: 'wet' }, { type: 'low-connected' }],
      priorActionTemplate: 'Deep stacks, SPR ~12. Hero c-bet. {villainPos} check-raises. Pot: {potSize}bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'fold', quality: 'acceptable' },
        { action: 'raise', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} on {board} at SPR ~12, proceed cautiously facing a check-raise. High SPR means you should only commit with very strong hands like sets and better. One pair is a call-and-evaluate hand, not a stacking hand. Re-raising bloats the pot beyond what one pair can justify.',
      factors: ['high SPR', 'pot control', 'check-raise strength', 'one pair caution'],
      difficulty: 'standard',
    },
    // --- Deep: suited connector value increases ---
    {
      titleTemplate: 'Call {hand} deep for nut potential from {heroPos}',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb. Stacks are ~175bb effective. Suited connectors gain value with deeper stacks.',
      street: 'preflop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['UTG', 'HJ'],
      villainTypes: ['reg', 'loose-passive'],
      handCategories: ['suited-connector'],
      priorActionTemplate: '{villainPos} opens to 2.5bb. Deep stacks ~175bb.',
      correctAction: 'call',
      alternativeActions: [
        { action: 'raise', quality: 'acceptable' },
        { action: 'fold', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} at 175bb deep, calling is clearly profitable. Suited connectors make straights and flushes that can stack deep opponents. The deeper the stacks, the better the implied odds for these nut-making hands. Position further increases their profitability.',
      factors: ['implied odds', 'nut-making hands', 'deep stacks', 'suited connector value'],
      difficulty: 'fundamentals',
    },
    // --- Deep: check back flop for pot control ---
    {
      titleTemplate: 'Check back {hand} deep on {board} for pot control',
      descriptionTemplate:
        'You are in {heroPos} deep-stacked (~200bb) with {hand} on {board}. Pot is {potSize}bb. {villainPos} ({villainType}) checks. Controlling the pot size is critical with deep stacks.',
      street: 'flop',
      heroPositions: ['BU', 'CO'],
      villainPositions: ['BB'],
      villainTypes: ['reg'],
      handCategories: ['medium-pair', 'overpair'],
      boardPatterns: [{ type: 'wet' }, { type: 'low-connected' }],
      priorActionTemplate: 'Hero opened, {villainPos} called. Deep stacks ~200bb. {villainPos} checks. Pot: {potSize}bb',
      correctAction: 'check',
      alternativeActions: [{ action: 'bet', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} on {board} at 200bb deep, checking back is correct. The wet board connects with the caller range and betting starts a pot trajectory toward stacking off. At deep stacks, you do not want to build a big pot with medium-strength hands on dangerous boards.',
      factors: ['pot control', 'deep stacks', 'wet board', 'medium hand strength'],
      difficulty: 'standard',
    },
    // --- Shallow: 3-bet shove ---
    {
      titleTemplate: '3-bet shove {hand} from {heroPos} at 35bb',
      descriptionTemplate:
        'You hold {hand} in {heroPos} with ~35bb effective. {villainPos} ({villainType}) opens to 2.5bb. At this stack depth, 3-betting should be an all-in shove.',
      street: 'preflop',
      heroPositions: ['SB', 'BB', 'BU'],
      villainPositions: ['CO', 'HJ'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['premium-pair', 'big-broadway-suited', 'big-broadway-offsuit'],
      priorActionTemplate: '{villainPos} opens to 2.5bb. Effective stacks ~35bb.',
      correctAction: 'raise',
      correctSizing: 35,
      alternativeActions: [
        { action: 'call', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} at 35bb effective from {heroPos}, the correct 3-bet is an all-in shove. A standard 3-bet to 8-9bb commits more than 25% of your stack, making any fold post-flop incorrect. Simplify by shoving to maximize fold equity and avoid awkward SPR situations.',
      factors: ['shallow 3-bet sizing', 'shove threshold', 'commitment', 'simplified strategy'],
      difficulty: 'standard',
    },
    // --- Deep: donk bet defense ---
    {
      titleTemplate: 'Face donk bet with {hand} on {board} deep',
      descriptionTemplate:
        'You opened from {heroPos} and got called. On {board}, {villainPos} ({villainType}) leads into you (donk bet). Stacks are ~180bb. Pot is {potSize}bb.',
      street: 'flop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['loose-passive', 'aggro-fish'],
      handCategories: ['overpair', 'top-pair'],
      boardPatterns: [{ type: 'low-connected' }, { type: 'wet' }],
      priorActionTemplate: 'Hero opened, {villainPos} called. {villainPos} donk bets. Deep stacks ~180bb. Pot: {potSize}bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'raise', quality: 'suboptimal' },
        { action: 'fold', quality: 'bad' },
      ],
      explanationTemplate:
        'Facing a donk bet from {villainType} on {board} with {hand} deep-stacked, call and reassess. Donk bets from recreational players often indicate a medium-strength hand or draw. At deep stacks, raising with one pair risks building a massive pot against an unknown range. Flat and navigate later streets.',
      factors: ['donk bet interpretation', 'deep stacks', 'pot control', 'recreational tendencies'],
      difficulty: 'standard',
    },
    // --- SPR mid-range: draw commitment ---
    {
      titleTemplate: 'Commit with draw at medium SPR: {hand} on {board}',
      descriptionTemplate:
        'You are in {heroPos} with {hand} on {board}. SPR is about 6. Pot is {potSize}bb. {villainPos} ({villainType}) bets. Your strong draw is committing at this SPR.',
      street: 'flop',
      heroPositions: ['BB', 'SB', 'CO'],
      villainPositions: ['BU', 'CO'],
      villainTypes: ['reg'],
      handCategories: ['draw'],
      boardPatterns: [{ type: 'wet' }],
      priorActionTemplate: 'SPR ~6. {villainPos} bets. Pot: {potSize}bb',
      correctAction: 'raise',
      correctSizing: 2.5,
      alternativeActions: [
        { action: 'call', quality: 'acceptable' },
      ],
      explanationTemplate:
        'With {hand} on {board} at SPR ~6, raising with your strong draw is correct. At medium SPR, a strong draw (combo draw, flush draw with overcards) has enough equity to commit. Raising applies maximum pressure while maintaining significant equity when called.',
      factors: ['medium SPR', 'draw commitment', 'semi-bluff raise', 'equity realization'],
      difficulty: 'advanced',
    },
    // --- Deep: value bet sets aggressively ---
    {
      titleTemplate: 'Value bet set with {hand} on {board} deep',
      descriptionTemplate:
        'You hold {hand} (set) on {board} from {heroPos}. Stacks are ~180bb effective. Pot is {potSize}bb. {villainPos} ({villainType}) checks to you. Sets are the premier stacking hands at deep stacks.',
      street: 'flop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['reg', 'loose-passive'],
      handCategories: ['small-pair', 'medium-pair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'dry-low' }],
      priorActionTemplate: 'Hero opened, {villainPos} called. Deep stacks ~180bb. {villainPos} checks. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.65,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} (representing a set) on {board} deep-stacked, bet for value. Sets are the hands you want to stack off with at deep stacks. Unlike one-pair hands that must pot control, sets can comfortably build the pot across three streets. Size to ~2/3 pot to keep the opponent in.',
      factors: ['deep stack value betting', 'set strength', 'three-street plan', 'nut hand'],
      difficulty: 'standard',
    },
    // --- Advanced: SPR calculation and planning ---
    {
      titleTemplate: 'Calculate SPR and plan with {hand} on {board}',
      descriptionTemplate:
        'You are in {heroPos} with {hand} on {board}. Pot on flop is {potSize}bb with stacks of about 85bb remaining. Calculate your SPR and commit accordingly.',
      street: 'flop',
      heroPositions: ['CO', 'BU', 'BB'],
      villainPositions: ['BB', 'SB', 'CO'],
      villainTypes: ['reg'],
      handCategories: ['overpair', 'top-pair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'ace-high' }],
      priorActionTemplate: 'Flop pot: {potSize}bb. Remaining stacks: ~85bb. {villainPos} checks.',
      correctAction: 'bet',
      correctSizing: 0.4,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} on {board}, calculate SPR: ~85bb remaining / {potSize}bb pot = medium SPR. At this SPR, top pair and overpairs are strong enough to bet three streets but not strong enough to get all-in on the flop. Bet small on the flop, then plan turn and river sizing to reach a river shove if appropriate.',
      factors: ['SPR calculation', 'three-street planning', 'bet sizing geometry', 'commitment planning'],
      difficulty: 'advanced',
    },
    // --- Shallow: avoid fancy play ---
    {
      titleTemplate: 'Simplify with {hand} at shallow stacks on {board}',
      descriptionTemplate:
        'You are in {heroPos} with {hand} on {board}. Stacks are ~40bb. Pot is {potSize}bb. {villainPos} ({villainType}) bets. At shallow stacks, avoid elaborate lines.',
      street: 'flop',
      heroPositions: ['BB', 'SB'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['top-pair', 'overpair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'dry-low' }],
      priorActionTemplate: 'Shallow stacks ~40bb. {villainPos} c-bets. Pot: {potSize}bb',
      correctAction: 'raise',
      correctSizing: 2.5,
      alternativeActions: [
        { action: 'call', quality: 'acceptable' },
      ],
      explanationTemplate:
        'With {hand} on {board} at 40bb stacks, raise to get the money in. At shallow stacks, there is no room for multi-street deception. Your top pair is a committing hand at this SPR. Check-raising gets maximum value and avoids playing awkward turn and river spots with short stacks.',
      factors: ['shallow stacks', 'simplified play', 'commitment', 'avoid fancy play'],
      difficulty: 'standard',
    },
    // --- Advanced: deep stack 3-bet pot navigation ---
    {
      titleTemplate: 'Navigate deep 3-bet pot with {hand} on {board}',
      descriptionTemplate:
        'You called a 3-bet in {heroPos} with {hand}. Stacks started at ~180bb. Board: {board}. Pot is {potSize}bb. {villainPos} ({villainType}) c-bets. The deep stacks create complex post-flop decisions.',
      street: 'flop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg'],
      handCategories: ['medium-pair', 'suited-connector'],
      boardPatterns: [{ type: 'wet' }, { type: 'low-connected' }],
      priorActionTemplate: '{villainPos} 3-bet, Hero called. Deep stacks ~180bb. {villainPos} c-bets. Pot: {potSize}bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'raise', quality: 'suboptimal' },
        { action: 'fold', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} on {board} in a deep 3-bet pot, call and evaluate. Deep stacks in 3-bet pots create a unique dynamic: the pot is already large but stacks are still deep relative to it. Flatting preserves your positional advantage and allows you to realize equity on favorable turn cards.',
      factors: ['deep 3-bet pot', 'position preservation', 'equity realization', 'stack depth interaction'],
      difficulty: 'advanced',
    },
    // --- Exploitative: stack deep vs recreational ---
    {
      titleTemplate: 'Exploit deep stacks vs {villainType}: {hand} on {board}',
      descriptionTemplate:
        'You are in {heroPos} with {hand} on {board}. Stacks are ~180bb. Pot is {potSize}bb. {villainPos} ({villainType}) tends to call too much. Deep stacks amplify this mistake.',
      street: 'flop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['loose-passive', 'aggro-fish'],
      handCategories: ['overpair', 'top-pair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'ace-high' }],
      priorActionTemplate: 'Hero opened, {villainPos} called. Deep stacks ~180bb. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.75,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'Against a {villainType} at deep stacks with {hand} on {board}, bet large for value. Their calling tendencies are amplified by deep stacks - they will call bigger bets and pay off more streets. Size up to extract maximum value from opponents who cannot fold.',
      factors: ['exploitative sizing', 'deep stack value', 'recreational tendencies', 'value extraction'],
      difficulty: 'exploitative',
    },
  ],
})
