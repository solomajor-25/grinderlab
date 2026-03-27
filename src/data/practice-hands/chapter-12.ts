import { generateChapterHands } from './hand-templates'
import type { PracticeHandScenario } from '@/types'

export const chapter12Hands: PracticeHandScenario[] = generateChapterHands({
  chapterId: 12,
  title: 'Bluffing Turn and River',
  conceptIds: ['bluffing', 'double-barrel', 'board-texture', 'fold-equity', 'range-analysis'],
  scenarios: [
    // --- Double barrel with overcard turn ---
    {
      titleTemplate: 'Double barrel {hand} on overcard turn from {heroPos}',
      descriptionTemplate:
        'You c-bet the flop from {heroPos} with {hand}. The turn brings an overcard to the board ({board}). Pot is {potSize}bb. {villainPos} ({villainType}) called flop.',
      street: 'turn',
      heroPositions: ['CO', 'BU', 'HJ'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['reg'],
      handCategories: ['air', 'draw'],
      boardPatterns: [{ type: 'dry-low' }],
      priorActionTemplate: 'Hero c-bet flop, {villainPos} called. Turn overcard. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.65,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} on a low board that now has an overcard, double barreling is profitable. The overcard favors the preflop raiser range and puts pressure on {villainType} middle pair and draw hands. Your bluff has credibility because you could easily hold the overcard.',
      factors: ['overcard turn', 'range advantage', 'credible bluff line'],
      difficulty: 'fundamentals',
    },
    // --- Double barrel with draw equity ---
    {
      titleTemplate: 'Double barrel {hand} with equity on {board}',
      descriptionTemplate:
        'You c-bet the flop from {heroPos} with {hand} on {board}. Pot is {potSize}bb. {villainPos} ({villainType}) called. You picked up draw equity on the turn.',
      street: 'turn',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['reg'],
      handCategories: ['draw'],
      boardPatterns: [{ type: 'wet' }],
      priorActionTemplate: 'Hero c-bet flop, {villainPos} called. Turn improves equity. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.6,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} on {board}, you have both fold equity and draw equity. Double barreling is correct because you profit from folds and have outs when called. This is the ideal double barrel scenario: fold equity plus actual equity.',
      factors: ['draw equity', 'fold equity', 'semi-bluff turn barrel'],
      difficulty: 'standard',
    },
    // --- Check-give up with no equity ---
    {
      titleTemplate: 'Check back {hand} on turn - no equity, no fold equity',
      descriptionTemplate:
        'You c-bet the flop from {heroPos} with {hand} on {board}. Pot is {potSize}bb. {villainPos} ({villainType}) called. The turn changes nothing and you have no equity.',
      street: 'turn',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB'],
      villainTypes: ['loose-passive'],
      handCategories: ['air'],
      boardPatterns: [{ type: 'dry-high' }],
      priorActionTemplate: 'Hero c-bet flop, {villainPos} called. Brick turn. Pot: {potSize}bb',
      correctAction: 'check',
      alternativeActions: [
        { action: 'bet', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} on {board}, the turn changed nothing. Against a {villainType} who called the flop, you have no fold equity and no draw equity. Firing another barrel is burning money. Check and give up.',
      factors: ['no equity', 'no fold equity', 'calling station', 'brick turn'],
      difficulty: 'fundamentals',
    },
    // --- Triple barrel bluff on scare card river ---
    {
      titleTemplate: 'Triple barrel {hand} on river scare card',
      descriptionTemplate:
        'You double barreled flop and turn from {heroPos} with {hand} on {board}. {villainPos} ({villainType}) called both streets. The river completes an obvious draw. Pot is {potSize}bb.',
      street: 'river',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['reg'],
      handCategories: ['air', 'draw'],
      boardPatterns: [{ type: 'wet' }],
      priorActionTemplate: 'Hero bet flop+turn, {villainPos} called both. River completes draw. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.75,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} after betting two streets, the river completing an obvious draw gives you a credible triple barrel. Against a {villainType}, this represents the nuts. Your line of bet-bet-bet on this runout tells a coherent story of a strong made hand or completed draw.',
      factors: ['scare card river', 'credible story', 'three-street aggression'],
      difficulty: 'standard',
    },
    // --- Don't triple barrel vs station ---
    {
      titleTemplate: 'Give up with {hand} on river vs {villainType}',
      descriptionTemplate:
        'You double barreled flop and turn from {heroPos} with {hand} on {board}. {villainPos} ({villainType}) called both streets. The river bricks.',
      street: 'river',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB'],
      villainTypes: ['loose-passive'],
      handCategories: ['air'],
      boardPatterns: [{ type: 'dry-high' }],
      priorActionTemplate: 'Hero bet flop+turn, {villainPos} called both. Brick river. Pot: {potSize}bb',
      correctAction: 'check',
      alternativeActions: [{ action: 'bet', quality: 'bad' }],
      explanationTemplate:
        'Against a {villainType} who called two streets with {hand}, triple barreling a brick river is lighting money on fire. Calling stations do not fold the river. They called two streets because they have something. Give up and accept the loss.',
      factors: ['calling station', 'no fold equity', 'river brick', 'opponent type'],
      difficulty: 'standard',
      replayVariant: {
        description: 'Same spot but villain is a tight regular',
        change: 'Against a tight reg, triple barreling becomes viable because they can find folds on the river with one-pair hands.',
      },
    },
    // --- Probe bet when raiser checks flop ---
    {
      titleTemplate: 'Probe bet {hand} on turn after raiser checks back',
      descriptionTemplate:
        'You are in {heroPos} and checked the flop. {villainPos} ({villainType}) was the preflop raiser but checked back flop on {board}. Pot is {potSize}bb. Their range is capped.',
      street: 'turn',
      heroPositions: ['BB', 'SB'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg'],
      handCategories: ['middle-pair', 'draw'],
      boardPatterns: [{ type: 'dry-low' }, { type: 'low-connected' }],
      priorActionTemplate: '{villainPos} opened, Hero called from {heroPos}. Villain checks back flop. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.5,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} on {board}, probing the turn is profitable. {villainPos} revealed weakness by not c-betting the flop, capping their range. Your middle pair or draw benefits from fold equity and you deny free cards. Size at half pot.',
      factors: ['capped range', 'probe opportunity', 'weakness shown', 'fold equity'],
      difficulty: 'standard',
    },
    // --- Bluff raise on turn ---
    {
      titleTemplate: 'Bluff raise {hand} on turn vs thin value bet',
      descriptionTemplate:
        'You are in {heroPos} on {board}. {villainPos} ({villainType}) bet the turn for thin value. You hold {hand} with blockers to their value range. Pot is {potSize}bb.',
      street: 'turn',
      heroPositions: ['BB', 'SB', 'CO'],
      villainPositions: ['BU', 'CO'],
      villainTypes: ['reg'],
      handCategories: ['draw'],
      boardPatterns: [{ type: 'wet' }],
      priorActionTemplate: '{villainPos} c-bet flop and bet turn. Pot: {potSize}bb',
      correctAction: 'raise',
      correctSizing: 2.5,
      alternativeActions: [
        { action: 'call', quality: 'acceptable' },
        { action: 'fold', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} on {board}, bluff raising the turn is a high-risk, high-reward play. The wet board changed significantly and you hold draw blockers. If {villainType} is betting thin value, they cannot withstand a raise. This play works best when the board favors your check-call range.',
      factors: ['bluff raise', 'blocker value', 'scare card', 'thin value target'],
      difficulty: 'advanced',
    },
    // --- River bluff raise ---
    {
      titleTemplate: 'River bluff raise with {hand} on {board}',
      descriptionTemplate:
        'You are in {heroPos} on the river ({board}). {villainPos} ({villainType}) bets small on a completed board. You hold {hand} with blockers to the nuts. Pot is {potSize}bb.',
      street: 'river',
      heroPositions: ['BB', 'SB'],
      villainPositions: ['BU', 'CO'],
      villainTypes: ['reg'],
      handCategories: ['draw', 'air'],
      boardPatterns: [{ type: 'wet' }, { type: 'monotone' }],
      priorActionTemplate: '{villainPos} bet flop+turn, bets small river. Pot: {potSize}bb',
      correctAction: 'raise',
      correctSizing: 2.8,
      alternativeActions: [
        { action: 'fold', quality: 'acceptable' },
        { action: 'call', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} on {board}, raising the river as a bluff targets thin value bets from {villainType}. You block the nut hands and the small river sizing suggests a medium-strength hand. This is a rare but profitable spot when the conditions align.',
      factors: ['blocker value', 'thin value sizing tell', 'river bluff raise', 'nut blockers'],
      difficulty: 'advanced',
    },
    // --- Delayed c-bet bluff ---
    {
      titleTemplate: 'Delayed c-bet with {hand} on {board} from {heroPos}',
      descriptionTemplate:
        'You checked the flop from {heroPos} with {hand} on {board}. The turn brings a favorable card. {villainPos} ({villainType}) checked behind on flop. Pot is {potSize}bb.',
      street: 'turn',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['reg'],
      handCategories: ['air', 'draw'],
      boardPatterns: [{ type: 'low-connected' }, { type: 'wet' }],
      priorActionTemplate: 'Hero checks flop, {villainPos} checks. Turn card favors raiser range. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.6,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} on {board}, a delayed c-bet on a favorable turn is profitable. Checking the flop with air on a connected board was correct, but the turn changing the board dynamic gives you a second chance to take the pot. The check-check-bet line is less suspicious than bet-bet.',
      factors: ['delayed c-bet', 'favorable turn card', 'range advantage shift'],
      difficulty: 'standard',
    },
    // --- Double barrel on flush-completing turn ---
    {
      titleTemplate: 'Barrel flush-completing turn with {hand}',
      descriptionTemplate:
        'You c-bet the flop from {heroPos} with {hand} on a two-tone board. The turn brings the third flush card ({board}). Pot is {potSize}bb. {villainPos} ({villainType}) called flop.',
      street: 'turn',
      heroPositions: ['CO', 'BU', 'HJ'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['reg'],
      handCategories: ['air'],
      boardPatterns: [{ type: 'monotone' }],
      priorActionTemplate: 'Hero c-bet flop on two-tone board, {villainPos} called. Turn completes flush. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.55,
      alternativeActions: [{ action: 'check', quality: 'acceptable' }],
      explanationTemplate:
        'With {hand}, the flush-completing turn is an excellent barrel card even without the flush. You represent the flush and the {villainType} must fold hands that cannot beat a flush. This is a core double barrel concept: bet when the turn card favors your perceived range.',
      factors: ['scare card', 'flush completion', 'perceived range', 'fold equity'],
      difficulty: 'standard',
    },
    // --- Check with showdown value ---
    {
      titleTemplate: 'Check {hand} on turn - showdown value on {board}',
      descriptionTemplate:
        'You c-bet the flop from {heroPos} with {hand} on {board}. Pot is {potSize}bb. {villainPos} ({villainType}) called. Your hand has showdown value, making a bet less attractive.',
      street: 'turn',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB'],
      villainTypes: ['reg', 'loose-passive'],
      handCategories: ['middle-pair', 'top-pair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'dry-low' }],
      priorActionTemplate: 'Hero c-bet flop, {villainPos} called. Pot: {potSize}bb',
      correctAction: 'check',
      alternativeActions: [
        { action: 'bet', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} on {board}, your hand has showdown value. One of the criteria for double barreling is that your hand has no showdown value. Betting turns your made hand into a bluff and folds out worse hands while getting called by better. Check and get to showdown.',
      factors: ['showdown value', 'bluff criteria', 'pot control', 'hand strength'],
      difficulty: 'fundamentals',
    },
    // --- River bluff on paired board ---
    {
      titleTemplate: 'Bluff river with {hand} on paired board {board}',
      descriptionTemplate:
        'You bet flop and turn from {heroPos} with {hand}. The river pairs the board ({board}). Pot is {potSize}bb. {villainPos} ({villainType}) called both streets.',
      street: 'river',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB', 'SB'],
      villainTypes: ['reg'],
      handCategories: ['air', 'draw'],
      boardPatterns: [{ type: 'paired' }],
      priorActionTemplate: 'Hero bet flop+turn, {villainPos} called both. River pairs board. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.7,
      alternativeActions: [
        { action: 'check', quality: 'acceptable' },
      ],
      explanationTemplate:
        'With {hand} on a river that pairs the board, bluffing represents trips or a full house. The {villainType} range after calling two streets is often one pair, which cannot continue against a river bet on a paired board. Your line tells a credible story.',
      factors: ['paired board', 'credible representation', 'one-pair folds', 'three-barrel story'],
      difficulty: 'standard',
    },
    // --- Planned multi-street bluff ---
    {
      titleTemplate: 'Plan a three-street bluff with {hand} from {heroPos}',
      descriptionTemplate:
        'You are about to c-bet from {heroPos} with {hand} on {board}. Pot is {potSize}bb. {villainPos} ({villainType}) is likely to float. Plan your bluff across all three streets.',
      street: 'flop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB'],
      villainTypes: ['reg'],
      handCategories: ['draw', 'air'],
      boardPatterns: [{ type: 'ace-high' }, { type: 'dry-high' }],
      priorActionTemplate: 'Hero raised preflop, {villainPos} called. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.33,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} on {board}, begin your bluff line with a small c-bet. The ace-high or high-card board favors your opening range. Plan to barrel turn cards that improve your equity or scare the villain, and evaluate river bluff viability. Multi-street bluffs must be planned, not improvised.',
      factors: ['multi-street planning', 'range advantage', 'small c-bet sizing', 'follow-through'],
      difficulty: 'advanced',
    },
    // --- Avoid bluff raise vs under-bluffer ---
    {
      titleTemplate: 'Call (don\'t raise) {hand} vs under-bluffing {villainType}',
      descriptionTemplate:
        'You are in {heroPos} on the river ({board}). {villainPos} ({villainType}) bets into you. They rarely bluff in this spot. You hold {hand}.',
      street: 'river',
      heroPositions: ['BB', 'SB'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['nitty', 'loose-passive'],
      handCategories: ['top-pair', 'overpair'],
      boardPatterns: [{ type: 'dry-high' }, { type: 'dry-low' }],
      priorActionTemplate: '{villainPos} bets river. Pot: {potSize}bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'raise', quality: 'bad' },
        { action: 'fold', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} on {board} vs a {villainType} river bet, calling is correct. Raising is a mistake because this villain type under-bluffs, meaning their river bets are weighted toward value. A raise only gets called by hands that beat you. Your one-pair hand is a call, not a raise.',
      factors: ['under-bluffing', 'thin value call', 'raise folding out worse', 'opponent type'],
      difficulty: 'standard',
    },
    // --- Probe bet on river after missed draw ---
    {
      titleTemplate: 'Probe river with {hand} after checking turn',
      descriptionTemplate:
        'Both players checked the turn. You are in {heroPos} on the river ({board}) with {hand}. {villainPos} ({villainType}) has shown weakness. Pot is {potSize}bb.',
      street: 'river',
      heroPositions: ['BB', 'SB'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg'],
      handCategories: ['air', 'draw'],
      boardPatterns: [{ type: 'dry-low' }, { type: 'ace-high' }],
      priorActionTemplate: 'Flop checked through. Turn checked through. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.6,
      alternativeActions: [
        { action: 'check', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} after two checks from {villainPos}, probing the river is profitable. The {villainType} checked back two streets, showing extreme weakness. Even with air, a bet here leverages the uncapped nature of your range against their clearly weak holding.',
      factors: ['weakness shown', 'probe opportunity', 'uncapped range', 'bluff opportunity'],
      difficulty: 'standard',
    },
    // --- Advanced: polarized river bet ---
    {
      titleTemplate: 'Polarized river bet with {hand} on {board}',
      descriptionTemplate:
        'You are in {heroPos} on the river after three streets of action on {board}. Pot is {potSize}bb. {villainPos} ({villainType}) has been check-calling. Your range should be polarized: nut hands and bluffs only.',
      street: 'river',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['BB'],
      villainTypes: ['reg'],
      handCategories: ['air'],
      boardPatterns: [{ type: 'broadway' }, { type: 'ace-high' }],
      priorActionTemplate: 'Hero bet flop, bet turn. {villainPos} called both. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.85,
      alternativeActions: [{ action: 'check', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} on {board}, you must either bet as a bluff or check with your medium-strength hands. After three streets, your range should be polarized. Since {hand} has no showdown value, it is a natural bluff candidate in a polarized river betting range.',
      factors: ['polarized range', 'river bluff selection', 'no showdown value', 'three-street credibility'],
      difficulty: 'advanced',
      replayVariant: {
        description: 'Same spot but you hold top pair',
        change: 'With top pair, check for showdown value. This hand sits in the medium-strength checking range, not the polarized betting range.',
      },
    },
    // --- Advanced: board texture and barrel selection ---
    {
      titleTemplate: 'Select barrel candidate: {hand} on {board} turn',
      descriptionTemplate:
        'You c-bet the flop from {heroPos} with {hand}. Turn card arrives ({board}). Pot is {potSize}bb. {villainPos} ({villainType}) called. Evaluate whether this turn is good for barreling.',
      street: 'turn',
      heroPositions: ['BU', 'CO'],
      villainPositions: ['BB'],
      villainTypes: ['reg'],
      handCategories: ['air', 'draw'],
      boardPatterns: [{ type: 'broadway' }, { type: 'ace-high' }],
      priorActionTemplate: 'Hero c-bet flop, {villainPos} called. Turn arrives. Pot: {potSize}bb',
      correctAction: 'bet',
      correctSizing: 0.6,
      alternativeActions: [{ action: 'check', quality: 'acceptable' }],
      explanationTemplate:
        'With {hand} on {board}, the turn maintains your range advantage on a board that favors the preflop raiser. Your draw or air hand makes a better barrel candidate than a medium-strength hand because it has no showdown value and benefits from fold equity.',
      factors: ['barrel selection', 'board texture', 'range advantage', 'no showdown value'],
      difficulty: 'advanced',
    },
  ],
})
