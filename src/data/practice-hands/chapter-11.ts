import { generateChapterHands } from './hand-templates'
import type { PracticeHandScenario } from '@/types'

export const chapter11Hands: PracticeHandScenario[] = generateChapterHands({
  chapterId: 11,
  title: 'Facing 3-Bets',
  conceptIds: ['defending', '3-betting', 'position', 'range-construction', 'fold-equity'],
  scenarios: [
    // --- Flat 3-bet IP with playable hands ---
    {
      titleTemplate: 'Flat 3-bet with {hand} in position from {heroPos}',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. {villainPos} ({villainType}) 3-bets to 8bb. You have position and a hand with good post-flop playability.',
      street: 'preflop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg'],
      handCategories: ['big-broadway-suited', 'medium-pair'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, {villainPos} 3-bets to 8bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'raise', quality: 'suboptimal' },
        { action: 'fold', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} in {heroPos} facing a 3-bet from {villainPos}, flatting is correct. You have position and your hand has strong post-flop playability. Suited broadways flop strong pairs and draws, and medium pairs can set mine profitably in position.',
      factors: ['position', 'playability', 'implied odds'],
      difficulty: 'fundamentals',
    },
    // --- 4-bet value with premiums ---
    {
      titleTemplate: '4-bet for value with {hand} from {heroPos}',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. {villainPos} ({villainType}) 3-bets to 9bb. With a premium hand, 4-betting for value is standard.',
      street: 'preflop',
      heroPositions: ['UTG', 'HJ', 'CO', 'BU'],
      villainPositions: ['SB', 'BB', 'CO', 'BU'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['premium-pair'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, {villainPos} 3-bets to 9bb',
      correctAction: 'raise',
      correctSizing: 22,
      alternativeActions: [{ action: 'call', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} in {heroPos}, 4-betting for value against {villainPos} 3-bet is standard. Premium pairs are always 4-bets. Flatting risks going multi-way and underplays your hand strength. Size to ~2.2-2.5x the 3-bet.',
      factors: ['hand strength', '4-bet value range', 'premium holdings'],
      difficulty: 'fundamentals',
    },
    // --- 4-bet bluff with Axs ---
    {
      titleTemplate: '4-bet bluff with {hand} from {heroPos} vs aggressive 3-bettor',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. {villainPos} ({villainType}) 3-bets to 9bb. They 3-bet frequently and you need 4-bet bluffs to defend your range.',
      street: 'preflop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg'],
      handCategories: ['suited-ace'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, {villainPos} 3-bets to 9bb (high 3-bet freq)',
      correctAction: 'raise',
      correctSizing: 22,
      alternativeActions: [
        { action: 'call', quality: 'acceptable' },
        { action: 'fold', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'Against a frequent 3-bettor in {villainPos}, 4-bet bluffing with {hand} from {heroPos} defends your range. Suited aces block AA and AK in their value range and have decent equity when called. Without 4-bet bluffs, you fold too often to aggressive 3-bettors.',
      factors: ['blocker value', 'defense frequency', 'exploiting aggressive 3-bettors'],
      difficulty: 'standard',
    },
    // --- Fold dominated hands OOP ---
    {
      titleTemplate: 'Fold {hand} OOP vs 3-bet from {villainPos}',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. {villainPos} ({villainType}) 3-bets to 9bb. Your hand is dominated and you are out of position.',
      street: 'preflop',
      heroPositions: ['UTG', 'HJ'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg', 'nitty'],
      handCategories: ['weak-broadway'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, {villainPos} 3-bets to 9bb',
      correctAction: 'fold',
      alternativeActions: [
        { action: 'call', quality: 'bad' },
        { action: 'raise', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} from {heroPos} facing a 3-bet from {villainPos}, folding is correct. Weak broadways are frequently dominated by the 3-bettor value range and you have no position to navigate post-flop. Calling OOP with dominated hands is a major leak.',
      factors: ['domination', 'out of position', 'hand strength'],
      difficulty: 'fundamentals',
    },
    // --- Complete defense range ---
    {
      titleTemplate: 'Defend {hand} from {heroPos} to avoid over-folding',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. {villainPos} ({villainType}) 3-bets to 8bb. Folding here would push your fold-to-3-bet above exploitable levels.',
      street: 'preflop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg'],
      handCategories: ['suited-connector', 'suited-gapper'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, {villainPos} 3-bets to 8bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'fold', quality: 'suboptimal' },
        { action: 'raise', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} from {heroPos}, flatting the 3-bet maintains a complete defense range. If you fold too often to 3-bets, opponents profit by 3-betting any two cards. Suited connectors and gappers have the playability needed to continue profitably in position.',
      factors: ['defense frequency', 'exploitability', 'post-flop playability'],
      difficulty: 'standard',
    },
    // --- Fold trash vs 3-bet ---
    {
      titleTemplate: 'Fold {hand} from {heroPos} vs 3-bet - bottom of range',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. {villainPos} ({villainType}) 3-bets to 9bb. This hand is the bottom of your opening range and a clear fold facing a 3-bet.',
      street: 'preflop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg', 'nitty'],
      handCategories: ['trash'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, {villainPos} 3-bets to 9bb',
      correctAction: 'fold',
      alternativeActions: [
        { action: 'call', quality: 'bad' },
        { action: 'raise', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} from {heroPos}, this is a clear fold vs a 3-bet. Defending does not mean calling with every hand you opened. The weakest hands in your opening range become folds facing a 3-bet. You still defend enough with your value 4-bets, flatting hands, and bluff 4-bets.',
      factors: ['range bottom', 'defense boundaries', 'hand strength'],
      difficulty: 'fundamentals',
    },
    // --- Preemptive tightening ---
    {
      titleTemplate: 'Tighten open with {hand} in {heroPos} - aggro 3-bettor behind',
      descriptionTemplate:
        'You are considering opening {hand} from {heroPos}. {villainPos} ({villainType}) is behind you and 3-bets at 14%. Should you still open?',
      street: 'preflop',
      heroPositions: ['UTG', 'HJ', 'CO'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['weak-broadway', 'suited-gapper'],
      priorActionTemplate: 'Aggressive 3-bettor in {villainPos} behind (14% 3-bet)',
      correctAction: 'fold',
      alternativeActions: [
        { action: 'raise', quality: 'suboptimal' },
        { action: 'call', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} in {heroPos} and an aggressive 3-bettor in {villainPos} behind, tighten your opening range preemptively. This hand cannot profitably continue vs a 3-bet, so opening it just to fold wastes chips. Cut marginal opens when facing aggressive players behind.',
      factors: ['preemptive adjustment', 'aggressive player behind', 'opening range tightening'],
      difficulty: 'standard',
      replayVariant: {
        description: 'The aggressive player has moved to a different seat',
        change: 'Without the aggressive 3-bettor behind, this hand returns to your standard opening range.',
      },
    },
    // --- Set mine with medium pair ---
    {
      titleTemplate: 'Set mine with {hand} vs 3-bet in position',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. {villainPos} ({villainType}) 3-bets to 8bb. Medium pairs can call to set mine when stacks are deep enough.',
      street: 'preflop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg', 'nitty'],
      handCategories: ['medium-pair'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, {villainPos} 3-bets to 8bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'fold', quality: 'acceptable' },
        { action: 'raise', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} in {heroPos}, calling the 3-bet to set mine is profitable with deep enough stacks. You need roughly 15:1 implied odds. With 100bb stacks, the math works in position. If you hit a set in a 3-bet pot, you often stack the overpair.',
      factors: ['set mining', 'implied odds', 'stack depth', 'position'],
      difficulty: 'standard',
    },
    // --- Facing squeeze as original caller ---
    {
      titleTemplate: 'Fold {hand} from {heroPos} facing squeeze',
      descriptionTemplate:
        'You called an open from {heroPos}. {villainPos} ({villainType}) squeezes to 12bb. Your calling range is capped and you should defend tight.',
      street: 'preflop',
      heroPositions: ['HJ', 'CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg'],
      handCategories: ['suited-connector', 'weak-broadway', 'small-pair'],
      priorActionTemplate: 'UTG opens to 2.5bb, Hero calls in {heroPos}, {villainPos} squeezes to 12bb',
      correctAction: 'fold',
      alternativeActions: [{ action: 'call', quality: 'bad' }],
      explanationTemplate:
        'With {hand} from {heroPos} facing a squeeze, fold. Your calling range is capped since you did not 3-bet initially. Most of your flatting hands cannot profitably continue vs a squeeze. Only premiums and the strongest suited broadways can defend here.',
      factors: ['capped range', 'squeeze defense', 'range awareness'],
      difficulty: 'standard',
    },
    // --- Defend vs squeeze with strong hand ---
    {
      titleTemplate: 'Defend {hand} from {heroPos} vs squeeze',
      descriptionTemplate:
        'You called an open from {heroPos} with a strong hand. {villainPos} ({villainType}) squeezes to 12bb. This hand is strong enough to continue.',
      street: 'preflop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['premium-pair', 'big-broadway-suited'],
      priorActionTemplate: 'HJ opens to 2.5bb, Hero calls in {heroPos}, {villainPos} squeezes to 12bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'raise', quality: 'acceptable' },
        { action: 'fold', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} from {heroPos} vs a squeeze, this hand is strong enough to continue. Premium hands and strong suited broadways can profitably flat or 4-bet. Folding here with a hand this strong would be over-folding to squeeze pressure.',
      factors: ['squeeze defense', 'hand strength', 'pot odds'],
      difficulty: 'standard',
    },
    // --- Cold 3-bet: respect it ---
    {
      titleTemplate: 'Fold {hand} in {heroPos} vs cold 3-bet from {villainPos}',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. HJ calls, then {villainPos} ({villainType}) cold 3-bets to 10bb. A cold 3-bet over multiple players is very strong.',
      street: 'preflop',
      heroPositions: ['UTG', 'HJ'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg', 'nitty'],
      handCategories: ['suited-connector', 'suited-gapper', 'weak-broadway'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, HJ calls, {villainPos} cold 3-bets to 10bb',
      correctAction: 'fold',
      alternativeActions: [
        { action: 'call', quality: 'bad' },
        { action: 'raise', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} from {heroPos} facing a cold 3-bet from {villainPos}, fold. A cold 3-bet entered voluntarily over multiple players and represents a very strong range. Treat it as stronger than a standard 3-bet and tighten your defense accordingly.',
      factors: ['cold 3-bet strength', 'range narrowing', 'multi-player action'],
      difficulty: 'standard',
    },
    // --- Flat OOP with playable hand ---
    {
      titleTemplate: 'Flat {hand} from {heroPos} OOP vs BU 3-bet',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. BU ({villainType}) 3-bets to 8bb. Despite being OOP, this hand has enough playability to continue.',
      street: 'preflop',
      heroPositions: ['HJ', 'CO'],
      villainPositions: ['BU'],
      villainTypes: ['reg'],
      handCategories: ['big-broadway-suited'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, BU 3-bets to 8bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'raise', quality: 'acceptable' },
        { action: 'fold', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} from {heroPos} facing a BU 3-bet, flatting is acceptable despite being OOP. Big suited broadways have enough equity and playability to navigate 3-bet pots. They flop strong draws and pairs frequently enough to justify the call.',
      factors: ['playability', 'out of position', 'equity retention'],
      difficulty: 'standard',
    },
    // --- Avoid flatting offsuit broadways OOP ---
    {
      titleTemplate: 'Fold {hand} OOP from {heroPos} vs 3-bet',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. {villainPos} ({villainType}) 3-bets to 9bb. Offsuit broadways play poorly OOP in 3-bet pots.',
      street: 'preflop',
      heroPositions: ['UTG', 'HJ'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg'],
      handCategories: ['big-broadway-offsuit'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, {villainPos} 3-bets to 9bb',
      correctAction: 'fold',
      alternativeActions: [
        { action: 'call', quality: 'bad' },
        { action: 'raise', quality: 'acceptable' },
      ],
      explanationTemplate:
        'With {hand} from {heroPos} OOP, flatting a 3-bet is a significant leak. Offsuit broadways lack the playability of suited variants and are frequently dominated. Either 4-bet as a bluff occasionally or fold. The in-between call is the worst option.',
      factors: ['suitedness', 'domination', 'out of position', 'post-flop difficulty'],
      difficulty: 'standard',
      replayVariant: {
        description: 'Same hand but suited',
        change: 'The suited version gains enough playability to flat call, especially with flush draw potential.',
      },
    },
    // --- Exploitative: over-fold vs nit 3-bet ---
    {
      titleTemplate: 'Over-fold {hand} vs nit 3-bet from {villainPos}',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. {villainPos} ({villainType}) 3-bets to 9bb. This villain only 3-bets 3% - their range is extremely strong.',
      street: 'preflop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['nitty'],
      handCategories: ['medium-pair', 'suited-connector', 'big-broadway-suited'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, {villainPos} 3-bets to 9bb (3-bet: 3%)',
      correctAction: 'fold',
      alternativeActions: [
        { action: 'call', quality: 'suboptimal' },
        { action: 'raise', quality: 'bad' },
      ],
      explanationTemplate:
        'Against a {villainType} in {villainPos} with a 3% 3-bet frequency, their range is essentially QQ+ and AK. Even {hand} cannot profitably continue against such a narrow range. Over-folding is correct here because the GTO defense frequency assumes a balanced 3-bettor.',
      factors: ['villain 3-bet frequency', 'exploitative folding', 'range narrowness'],
      difficulty: 'exploitative',
    },
    // --- Advanced: 4-bet light vs aggro 3-bettor ---
    {
      titleTemplate: '4-bet light with {hand} vs frequent 3-bettor in {villainPos}',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. {villainPos} ({villainType}) 3-bets to 9bb for the third time in the last orbit. Time to fight back.',
      street: 'preflop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['suited-ace', 'big-broadway-offsuit'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, {villainPos} 3-bets to 9bb (very high frequency)',
      correctAction: 'raise',
      correctSizing: 22,
      alternativeActions: [
        { action: 'call', quality: 'suboptimal' },
        { action: 'fold', quality: 'bad' },
      ],
      explanationTemplate:
        'Against a {villainType} in {villainPos} who 3-bets at an exploitatively high frequency, 4-betting light with {hand} is the correct counter-adjustment. You need 4-bet bluffs to prevent them from printing money with aggressive 3-bets. Hands with blocker value are ideal.',
      factors: ['4-bet bluff', 'counter-exploitation', 'blocker value', 'defense adjustment'],
      difficulty: 'exploitative',
    },
    // --- Advanced: adjust defense by position ---
    {
      titleTemplate: 'Position-based defense: {hand} from {heroPos} vs {villainPos} 3-bet',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. {villainPos} ({villainType}) 3-bets to 9bb. Your defense range should be wider from late position opens.',
      street: 'preflop',
      heroPositions: ['BU'],
      villainPositions: ['SB', 'BB'],
      villainTypes: ['reg'],
      handCategories: ['suited-gapper', 'small-pair'],
      priorActionTemplate: 'Hero opens BU to 2.5bb, {villainPos} 3-bets to 9bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'fold', quality: 'acceptable' },
        { action: 'raise', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'From BU vs a blind 3-bet with {hand}, defending wider is correct because your opening range from BU is wider, meaning you have more hands to defend with. Suited gappers and small pairs have enough implied odds in position to justify calls at the boundary of your defense range.',
      factors: ['position-based defense', 'opening range width', 'implied odds', 'defense frequency'],
      difficulty: 'advanced',
    },
    // --- Advanced: facing 4-bet after 3-betting ---
    {
      titleTemplate: 'Facing 4-bet: fold {hand} after 3-bet bluff from {heroPos}',
      descriptionTemplate:
        'You 3-bet to 9bb from {heroPos} as a bluff. {villainPos} ({villainType}) 4-bets to 22bb. Your bluff has been called out - time to give up.',
      street: 'preflop',
      heroPositions: ['SB', 'BB', 'BU'],
      villainPositions: ['UTG', 'HJ', 'CO'],
      villainTypes: ['reg', 'nitty'],
      handCategories: ['suited-ace', 'suited-connector'],
      priorActionTemplate: 'Hero 3-bets to 9bb from {heroPos}, {villainPos} 4-bets to 22bb',
      correctAction: 'fold',
      alternativeActions: [{ action: 'call', quality: 'bad' }],
      explanationTemplate:
        'With {hand} from {heroPos} facing a 4-bet, fold. Your 3-bet bluff was called and the 4-bet represents a very strong range. Continuing with a bluff hand in a bloated pot is burning money. The blocker value that justified the 3-bet is not enough to call a 4-bet.',
      factors: ['4-bet pot', 'bluff recognition', 'pot commitment', 'range strength'],
      difficulty: 'advanced',
    },
    // --- Facing 3-bet with AKo - always continue ---
    {
      titleTemplate: 'Always continue with {hand} from {heroPos} vs 3-bet',
      descriptionTemplate:
        'You opened to 2.5bb from {heroPos}. {villainPos} ({villainType}) 3-bets to 9bb. AK is always strong enough to continue facing a 3-bet.',
      street: 'preflop',
      heroPositions: ['UTG', 'HJ', 'CO', 'BU'],
      villainPositions: ['SB', 'BB', 'CO', 'BU'],
      villainTypes: ['reg', 'nitty', 'aggro-fish'],
      handCategories: ['big-broadway-offsuit', 'big-broadway-suited'],
      priorActionTemplate: 'Hero opens {heroPos} to 2.5bb, {villainPos} 3-bets to 9bb',
      correctAction: 'raise',
      correctSizing: 22,
      alternativeActions: [{ action: 'call', quality: 'acceptable' }],
      explanationTemplate:
        'With {hand} from {heroPos}, always continue vs a 3-bet. Big broadway hands at the top of your range are either 4-bet value candidates or profitable flats. AK specifically blocks AA and KK, making it excellent for 4-betting. Never fold the top of your range to a single 3-bet.',
      factors: ['hand strength', 'range top', 'blocker value', '4-bet candidacy'],
      difficulty: 'fundamentals',
    },
  ],
})
