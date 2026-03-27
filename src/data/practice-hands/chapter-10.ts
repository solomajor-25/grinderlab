import { generateChapterHands } from './hand-templates'
import type { PracticeHandScenario } from '@/types'

export const chapter10Hands: PracticeHandScenario[] = generateChapterHands({
  chapterId: 10,
  title: '3-Betting',
  conceptIds: ['3-betting', 'polarization', 'blockers', 'fold-equity', 'squeezing'],
  scenarios: [
    // --- Polar 3-Bet Value ---
    {
      titleTemplate: 'Value 3-bet {hand} from {heroPos} vs {villainPos} open',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb. You have a premium hand suitable for a value 3-bet.',
      street: 'preflop',
      heroPositions: ['CO', 'BU', 'SB', 'BB'],
      villainPositions: ['UTG', 'HJ', 'CO'],
      villainTypes: ['reg', 'loose-passive'],
      handCategories: ['premium-pair'],
      priorActionTemplate: '{villainPos} opens to 2.5bb',
      correctAction: 'raise',
      correctSizing: 8,
      alternativeActions: [{ action: 'call', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} in {heroPos} vs a {villainPos} open, 3-betting for value is standard. Premium pairs are the backbone of your value 3-bet range. Flatting risks multi-way pots that reduce your equity edge.',
      factors: ['hand strength', 'position', 'value 3-bet range'],
      difficulty: 'fundamentals',
    },
    {
      titleTemplate: 'Value 3-bet big broadway {hand} from {heroPos}',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb. Your hand is strong enough for a linear value 3-bet.',
      street: 'preflop',
      heroPositions: ['BU', 'SB', 'BB'],
      villainPositions: ['HJ', 'CO'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['big-broadway-suited'],
      priorActionTemplate: '{villainPos} opens to 2.5bb',
      correctAction: 'raise',
      correctSizing: 9,
      alternativeActions: [{ action: 'call', quality: 'acceptable' }],
      explanationTemplate:
        'With {hand} in {heroPos}, 3-betting for value isolates a weaker range from {villainPos}. Big suited broadways play well in 3-bet pots with strong post-flop equity.',
      factors: ['hand strength', 'playability', 'isolation'],
      difficulty: 'fundamentals',
    },
    // --- Polar 3-Bet Bluff (Axs) ---
    {
      titleTemplate: 'Bluff 3-bet with {hand} from {heroPos} vs {villainPos}',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb. Your suited ace has blocker value for a polar 3-bet bluff.',
      street: 'preflop',
      heroPositions: ['BU', 'SB', 'BB'],
      villainPositions: ['UTG', 'HJ', 'CO'],
      villainTypes: ['reg'],
      handCategories: ['suited-ace'],
      priorActionTemplate: '{villainPos} opens to 2.5bb',
      correctAction: 'raise',
      correctSizing: 8,
      alternativeActions: [
        { action: 'call', quality: 'suboptimal' },
        { action: 'fold', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} in {heroPos}, 3-betting as a bluff is ideal. The Ace blocks AA and AK in {villainPos} range, and suited wheel aces retain decent equity when called. This is a core polar 3-bet bluff hand.',
      factors: ['blocker value', 'fold equity', 'post-flop playability'],
      difficulty: 'standard',
    },
    // --- Polar 3-Bet Bluff (suited connectors) ---
    {
      titleTemplate: '3-bet bluff {hand} from {heroPos} vs {villainPos} open',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb. Suited connectors can serve as 3-bet bluffs with good post-flop equity.',
      street: 'preflop',
      heroPositions: ['BU', 'BB'],
      villainPositions: ['HJ', 'CO'],
      villainTypes: ['reg'],
      handCategories: ['suited-connector'],
      priorActionTemplate: '{villainPos} opens to 2.5bb',
      correctAction: 'raise',
      correctSizing: 8,
      alternativeActions: [
        { action: 'call', quality: 'acceptable' },
        { action: 'fold', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} in {heroPos}, 3-betting as a bluff works because suited connectors flop well and are hard to play profitably as flat calls against {villainType} opponents. The fold equity plus post-flop playability makes this a profitable 3-bet bluff.',
      factors: ['fold equity', 'post-flop equity', 'playability'],
      difficulty: 'standard',
    },
    // --- Linear 3-Bet vs Calling Station ---
    {
      titleTemplate: 'Linear 3-bet {hand} from {heroPos} vs station in {villainPos}',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb and rarely folds to 3-bets. A linear 3-bet strategy is appropriate here.',
      street: 'preflop',
      heroPositions: ['BU', 'SB', 'BB'],
      villainPositions: ['HJ', 'CO', 'BU'],
      villainTypes: ['loose-passive'],
      handCategories: ['premium-pair', 'big-broadway-suited'],
      priorActionTemplate: '{villainPos} opens to 2.5bb',
      correctAction: 'raise',
      correctSizing: 10,
      alternativeActions: [{ action: 'call', quality: 'suboptimal' }],
      explanationTemplate:
        'Against a {villainType} in {villainPos} who rarely folds to 3-bets, switch to a linear strategy. 3-bet only hands with genuine value like {hand}. Bluff 3-bets are unprofitable because the villain calls too wide.',
      factors: ['villain tendencies', 'linear range', 'fold-to-3bet frequency'],
      difficulty: 'standard',
    },
    // --- Fold bluffs vs station ---
    {
      titleTemplate: 'Avoid 3-bet bluff with {hand} vs {villainType} in {villainPos}',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb and calls 3-bets extremely wide. Should you 3-bet bluff here?',
      street: 'preflop',
      heroPositions: ['BU', 'SB', 'BB'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['loose-passive'],
      handCategories: ['suited-ace', 'suited-connector'],
      priorActionTemplate: '{villainPos} opens to 2.5bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'fold', quality: 'acceptable' },
        { action: 'raise', quality: 'bad' },
      ],
      explanationTemplate:
        'Against a {villainType} who rarely folds to 3-bets, bluff 3-betting with {hand} burns money. Without fold equity, your bluff 3-bet builds a bloated pot with a marginal hand. Flat call to see a flop with good implied odds, or fold.',
      factors: ['fold equity', 'villain tendencies', 'implied odds'],
      difficulty: 'standard',
      replayVariant: {
        description: 'Same hand but villain is a tight regular',
        change: 'Against a reg who folds to 3-bets 60% of the time, this becomes a profitable 3-bet bluff.',
      },
    },
    // --- Squeeze with premium ---
    {
      titleTemplate: 'Squeeze with {hand} from {heroPos} over caller',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb and another player calls. The dead money makes squeezing highly profitable.',
      street: 'preflop',
      heroPositions: ['CO', 'BU', 'SB', 'BB'],
      villainPositions: ['UTG', 'HJ'],
      villainTypes: ['reg', 'loose-passive'],
      handCategories: ['premium-pair', 'big-broadway-suited'],
      priorActionTemplate: '{villainPos} opens to 2.5bb, one caller behind',
      correctAction: 'raise',
      correctSizing: 12,
      alternativeActions: [{ action: 'call', quality: 'suboptimal' }],
      explanationTemplate:
        'With {hand} in {heroPos}, squeezing over the open and a caller is clearly the best play. The dead money from the caller increases your steal equity and the caller range is capped. Size larger than a standard 3-bet to account for the extra player.',
      factors: ['dead money', 'capped caller range', 'squeeze sizing'],
      difficulty: 'fundamentals',
    },
    // --- Squeeze as bluff ---
    {
      titleTemplate: 'Squeeze bluff with {hand} from {heroPos}',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens and one player calls. The dead money and capped ranges make this a good squeeze bluff spot.',
      street: 'preflop',
      heroPositions: ['SB', 'BB', 'BU'],
      villainPositions: ['UTG', 'HJ', 'CO'],
      villainTypes: ['reg'],
      handCategories: ['suited-ace', 'suited-connector'],
      priorActionTemplate: '{villainPos} opens to 2.5bb, one caller',
      correctAction: 'raise',
      correctSizing: 12,
      alternativeActions: [
        { action: 'call', quality: 'suboptimal' },
        { action: 'fold', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} in {heroPos}, squeezing as a bluff is profitable. The caller range is capped and the opener folds more knowing a player behind might call. Suited aces and connectors retain equity when called. Size to ~12bb with one caller.',
      factors: ['dead money', 'capped range', 'fold equity', 'blocker value'],
      difficulty: 'standard',
    },
    // --- 3-Bet Sizing IP ---
    {
      titleTemplate: '3-bet sizing in position with {hand} from {heroPos}',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb. You are in position - what is the correct 3-bet sizing?',
      street: 'preflop',
      heroPositions: ['CO', 'BU'],
      villainPositions: ['UTG', 'HJ'],
      villainTypes: ['reg'],
      handCategories: ['premium-pair', 'big-broadway-suited'],
      priorActionTemplate: '{villainPos} opens to 2.5bb',
      correctAction: 'raise',
      correctSizing: 7.5,
      alternativeActions: [{ action: 'call', quality: 'suboptimal' }],
      explanationTemplate:
        'In position, 3-bet to approximately 3x the open-raise. With {hand} in {heroPos}, sizing to ~7.5bb gives you a good price while keeping the pot manageable with position. Larger sizing is unnecessary when you have the positional advantage.',
      factors: ['position', '3-bet sizing', 'in-position advantage'],
      difficulty: 'fundamentals',
    },
    // --- 3-Bet Sizing OOP ---
    {
      titleTemplate: '3-bet sizing out of position with {hand} from {heroPos}',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb. You are out of position - size up your 3-bet.',
      street: 'preflop',
      heroPositions: ['SB', 'BB'],
      villainPositions: ['CO', 'BU'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['premium-pair', 'big-broadway-suited'],
      priorActionTemplate: '{villainPos} opens to 2.5bb',
      correctAction: 'raise',
      correctSizing: 10,
      alternativeActions: [{ action: 'call', quality: 'suboptimal' }],
      explanationTemplate:
        'Out of position from {heroPos}, 3-bet to approximately 3.5-4x the open. With {hand}, sizing to ~10bb compensates for your positional disadvantage by building a pot where you get more folds preflop and more value when called.',
      factors: ['position', '3-bet sizing', 'out-of-position compensation'],
      difficulty: 'fundamentals',
    },
    // --- Polar 3-bet: flat the middle ---
    {
      titleTemplate: 'Flat {hand} from {heroPos} vs {villainPos} - calling range',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb. This hand belongs in your flatting range, not your 3-bet range.',
      street: 'preflop',
      heroPositions: ['BU', 'CO'],
      villainPositions: ['UTG', 'HJ'],
      villainTypes: ['reg'],
      handCategories: ['medium-pair', 'suited-gapper'],
      priorActionTemplate: '{villainPos} opens to 2.5bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'raise', quality: 'suboptimal' },
        { action: 'fold', quality: 'bad' },
      ],
      explanationTemplate:
        'With {hand} in {heroPos}, this hand sits in the flatting tier of a polar 3-bet strategy. It is too strong to fold but lacks the characteristics of a value 3-bet or an ideal bluff 3-bet. Flat call and use position post-flop.',
      factors: ['polar range structure', 'calling tier', 'post-flop playability'],
      difficulty: 'standard',
    },
    // --- 3-Bet bluff with trash = bad ---
    {
      titleTemplate: 'Fold {hand} in {heroPos} - not a profitable 3-bet bluff',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb. This hand lacks blocker value and playability for a 3-bet bluff.',
      street: 'preflop',
      heroPositions: ['SB', 'BB'],
      villainPositions: ['UTG', 'HJ', 'CO'],
      villainTypes: ['reg'],
      handCategories: ['trash', 'weak-broadway'],
      priorActionTemplate: '{villainPos} opens to 2.5bb',
      correctAction: 'fold',
      alternativeActions: [{ action: 'raise', quality: 'bad' }],
      explanationTemplate:
        'With {hand} in {heroPos}, this hand is a clear fold. It lacks the blocker value of Axs and the post-flop playability of suited connectors. 3-bet bluffing with hands that have no blocker value and poor equity when called is a major leak.',
      factors: ['blocker value', 'post-flop equity', 'hand selection'],
      difficulty: 'fundamentals',
    },
    // --- Squeeze too many callers ---
    {
      titleTemplate: 'Squeeze sizing with {hand} - two callers behind',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb and two players call. More dead money requires larger squeeze sizing.',
      street: 'preflop',
      heroPositions: ['SB', 'BB'],
      villainPositions: ['UTG', 'HJ'],
      villainTypes: ['reg', 'loose-passive'],
      handCategories: ['premium-pair', 'big-broadway-suited'],
      priorActionTemplate: '{villainPos} opens to 2.5bb, two callers',
      correctAction: 'raise',
      correctSizing: 14,
      alternativeActions: [{ action: 'call', quality: 'bad' }],
      explanationTemplate:
        'With {hand} in {heroPos} and two callers, squeeze large to ~14bb. Each additional caller adds dead money and requires a bigger sizing to deny pot odds. Flatting into a 4-way pot with a hand that plays best heads-up is a significant error.',
      factors: ['dead money', 'squeeze sizing', 'multiway pot avoidance'],
      difficulty: 'standard',
    },
    // --- Advanced: 3-bet bluff from SB vs BU ---
    {
      titleTemplate: '3-bet bluff {hand} from SB vs BU steal',
      descriptionTemplate:
        'You hold {hand} in SB. BU ({villainType}) opens to 2.5bb. BU opens wide, making SB 3-bet bluffs profitable.',
      street: 'preflop',
      heroPositions: ['SB'],
      villainPositions: ['BU'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['suited-ace', 'suited-connector', 'suited-gapper'],
      priorActionTemplate: 'BU opens to 2.5bb',
      correctAction: 'raise',
      correctSizing: 10,
      alternativeActions: [
        { action: 'fold', quality: 'acceptable' },
        { action: 'call', quality: 'bad' },
      ],
      explanationTemplate:
        'From SB vs a wide BU open, 3-betting with {hand} is preferred over flatting. Flatting from SB leaves BB in the hand and puts you OOP in a multi-way pot. 3-betting isolates the BU opener and leverages fold equity against their wide steal range.',
      factors: ['fold equity', 'position', 'avoid flatting OOP', 'wide villain range'],
      difficulty: 'standard',
      replayVariant: {
        description: 'BU is a nit who only opens 15% from the button',
        change: 'Against a tight BU, reduce 3-bet bluff frequency and only 3-bet for value.',
      },
    },
    // --- Advanced: exploit low fold-to-3bet ---
    {
      titleTemplate: 'Adapt 3-bet range vs {villainType} who never folds',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb and has a fold-to-3-bet of only 30%. How should you adjust?',
      street: 'preflop',
      heroPositions: ['BU', 'SB', 'BB'],
      villainPositions: ['CO', 'HJ'],
      villainTypes: ['loose-passive', 'aggro-fish'],
      handCategories: ['big-broadway-suited', 'premium-pair'],
      priorActionTemplate: '{villainPos} opens to 2.5bb (fold-to-3bet: 30%)',
      correctAction: 'raise',
      correctSizing: 11,
      alternativeActions: [{ action: 'call', quality: 'acceptable' }],
      explanationTemplate:
        'Against a {villainType} with a low fold-to-3-bet, use a linear range. 3-bet only genuine value hands like {hand} and size up to punish their wide calling range. Drop bluff 3-bets entirely since they have no fold equity.',
      factors: ['villain fold-to-3bet', 'linear vs polar', 'exploitative adjustment'],
      difficulty: 'exploitative',
    },
    // --- Advanced: 3-bet pot with small pair ---
    {
      titleTemplate: 'Decide whether to 3-bet {hand} from {heroPos}',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb. Small pairs have set-mining value but are poor 3-bet candidates.',
      street: 'preflop',
      heroPositions: ['BU', 'CO'],
      villainPositions: ['UTG', 'HJ'],
      villainTypes: ['reg'],
      handCategories: ['small-pair'],
      priorActionTemplate: '{villainPos} opens to 2.5bb',
      correctAction: 'call',
      alternativeActions: [
        { action: 'raise', quality: 'bad' },
        { action: 'fold', quality: 'acceptable' },
      ],
      explanationTemplate:
        'With {hand} in {heroPos}, flatting to set mine is correct. Small pairs make terrible 3-bet bluffs because they have no blocker value against premium hands and poor post-flop playability in 3-bet pots when they miss.',
      factors: ['set mining', 'implied odds', 'blocker value', '3-bet candidacy'],
      difficulty: 'standard',
    },
    // --- Advanced: polarization concept ---
    {
      titleTemplate: 'Identify polar vs linear: {hand} in {heroPos} vs {villainPos}',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 2.5bb and folds to 3-bets about 55% of the time. Is this a polar or linear 3-bet spot?',
      street: 'preflop',
      heroPositions: ['BU', 'SB', 'BB'],
      villainPositions: ['UTG', 'HJ', 'CO'],
      villainTypes: ['reg'],
      handCategories: ['suited-ace'],
      priorActionTemplate: '{villainPos} opens to 2.5bb (folds to 3-bet ~55%)',
      correctAction: 'raise',
      correctSizing: 8,
      alternativeActions: [
        { action: 'call', quality: 'suboptimal' },
        { action: 'fold', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} vs a {villainType} who folds to 3-bets at a healthy rate, use a polar strategy. Your suited ace is the ideal bluff 3-bet: it blocks AA/AK and retains equity when called. The 55% fold frequency makes polar 3-betting profitable.',
      factors: ['polar vs linear', 'fold frequency', 'blocker value', 'range construction'],
      difficulty: 'advanced',
    },
    // --- Advanced: squeeze vs multiple aggro ---
    {
      titleTemplate: 'Squeeze decision with {hand} vs aggro open and call',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 3bb and an aggressive player calls. The caller capped their range by not 3-betting.',
      street: 'preflop',
      heroPositions: ['BB', 'SB'],
      villainPositions: ['HJ', 'CO'],
      villainTypes: ['reg', 'aggro-fish'],
      handCategories: ['big-broadway-suited', 'suited-ace'],
      priorActionTemplate: '{villainPos} opens to 3bb, aggro caller in BU',
      correctAction: 'raise',
      correctSizing: 13,
      alternativeActions: [
        { action: 'call', quality: 'suboptimal' },
        { action: 'fold', quality: 'suboptimal' },
      ],
      explanationTemplate:
        'With {hand} in {heroPos}, squeezing is strong because the BU caller range is capped (they would have 3-bet their premiums). The dead money from the caller makes the squeeze more profitable. Size larger than a standard 3-bet.',
      factors: ['capped range', 'dead money', 'squeeze opportunity', 'aggressor dynamics'],
      difficulty: 'advanced',
    },
    // --- 3-bet sizing vs recreational ---
    {
      titleTemplate: 'Size up 3-bet with {hand} vs recreational {villainPos}',
      descriptionTemplate:
        'You hold {hand} in {heroPos}. {villainPos} ({villainType}) opens to 3bb. Against recreational players with inelastic calling ranges, size up your 3-bet.',
      street: 'preflop',
      heroPositions: ['BU', 'CO', 'SB', 'BB'],
      villainPositions: ['UTG', 'HJ', 'CO'],
      villainTypes: ['aggro-fish', 'loose-passive'],
      handCategories: ['premium-pair', 'big-broadway-suited'],
      priorActionTemplate: '{villainPos} opens to 3bb',
      correctAction: 'raise',
      correctSizing: 12,
      alternativeActions: [{ action: 'call', quality: 'suboptimal' }],
      explanationTemplate:
        'Against a {villainType} in {villainPos}, size up your 3-bet to ~12bb. Recreational players have inelastic calling ranges - they call with the same hands regardless of sizing. Extract maximum value preflop with {hand} by making it bigger.',
      factors: ['exploitative sizing', 'inelastic calling range', 'value extraction'],
      difficulty: 'exploitative',
    },
  ],
})
