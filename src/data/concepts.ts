import type { Concept } from '@/types'

export const concepts: Concept[] = [
  { id: 'position', name: 'Position', description: 'The advantage of acting later in the hand, allowing you to make more informed decisions.', chapterIds: [2, 3, 4, 6, 8], category: 'general' },
  { id: 'starting-hands', name: 'Starting Hand Selection', description: 'Choosing which hands to play based on their quality, position, and game context.', chapterIds: [2], category: 'preflop' },
  { id: 'opening-ranges', name: 'Opening Ranges', description: 'The set of hands you raise with as the first player to enter the pot, varying by position.', chapterIds: [2], category: 'preflop' },
  { id: 'iso-raise', name: 'Isolation Raise', description: 'Raising over a limper to isolate them heads-up, exploiting their weak range.', chapterIds: [3], category: 'preflop' },
  { id: 'fold-equity', name: 'Fold Equity', description: 'The value gained from the possibility that your opponent will fold to your bet or raise.', chapterIds: [3, 10, 12], category: 'general' },
  { id: 'frequent-strength', name: 'Frequent Strength', description: 'How often your hand has the best hand or significant equity against the opponent\'s range.', chapterIds: [3, 11], category: 'general' },
  { id: 'limping', name: 'Limping & Over-limping', description: 'When and why to just call the big blind instead of raising, usually for implied odds or stealing.', chapterIds: [3], category: 'preflop' },
  { id: 'c-betting', name: 'Continuation Betting', description: 'Betting the flop as the preflop raiser to maintain initiative and apply pressure.', chapterIds: [4, 13], category: 'postflop' },
  { id: 'board-texture', name: 'Board Texture', description: 'How the community cards interact with likely hand ranges - dry, wet, coordinated, paired.', chapterIds: [4, 5, 8, 12], category: 'postflop' },
  { id: 'sdv', name: 'Showdown Value', description: 'Whether your hand can win at showdown without further betting. Hands with SDV prefer checking.', chapterIds: [4, 8, 12], category: 'postflop' },
  { id: 'relative-strength', name: 'Relative Hand Strength', description: 'How strong your hand is relative to your opponent\'s likely calling range, not in absolute terms.', chapterIds: [5, 7, 8], category: 'postflop' },
  { id: 'value-betting', name: 'Value Betting', description: 'Betting when you expect to be called by worse hands more often than better hands.', chapterIds: [5], category: 'postflop' },
  { id: 'thin-value', name: 'Thin Value', description: 'Value betting with hands that only narrowly beat the opponent\'s calling range.', chapterIds: [5], category: 'postflop' },
  { id: 'slowplaying', name: 'Slowplaying', description: 'Checking or calling with a very strong hand to deceive opponents and extract more value later.', chapterIds: [5], category: 'postflop' },
  { id: 'bet-sizing', name: 'Bet Sizing', description: 'Choosing the right bet amount based on board texture, hand strength, and opponent tendencies.', chapterIds: [4, 5, 10], category: 'postflop' },
  { id: 'pot-odds', name: 'Pot Odds', description: 'The ratio of the current pot size to the cost of a call, used to determine profitable decisions.', chapterIds: [6, 7], category: 'general' },
  { id: 'implied-odds', name: 'Implied Odds', description: 'Additional value expected from future betting when you hit your draw.', chapterIds: [6, 14], category: 'general' },
  { id: 'required-equity', name: 'Required Equity', description: 'The minimum equity needed to profitably call: RE = Call / (Pot + Call).', chapterIds: [7], category: 'general' },
  { id: 'bluff-catching', name: 'Bluff Catching', description: 'Calling with a medium-strength hand specifically to catch bluffs on the river.', chapterIds: [7], category: 'postflop' },
  { id: 'defending-bets', name: 'Defending Against Bets', description: 'Evaluating whether to call, raise, or fold when facing a bet on any street.', chapterIds: [8], category: 'postflop' },
  { id: 'equity-types', name: 'True vs Ghost Equity', description: 'True equity comes from real outs; ghost equity comes from outs that don\'t help you win the pot.', chapterIds: [8], category: 'postflop' },
  { id: 'chasing', name: 'Chasing Draws', description: 'Calling bets to see more cards hoping to improve. Requires sufficient pot odds or implied odds.', chapterIds: [8], category: 'postflop' },
  { id: 'floating', name: 'Floating', description: 'Calling a bet with a weak hand to take the pot away on a later street using fold equity.', chapterIds: [8], category: 'postflop' },
  { id: 'donk-bets', name: 'Donk Bets', description: 'When a player bets into the preflop aggressor. Adjust response based on villain type.', chapterIds: [8, 14], category: 'postflop' },
  { id: 'combos', name: 'Hand Combinations', description: 'Counting the number of ways a specific hand can be dealt: pairs=6, offsuit=12, suited=4.', chapterIds: [9], category: 'general' },
  { id: 'blockers', name: 'Blockers', description: 'Cards you hold that reduce the number of combinations of hands your opponent can have.', chapterIds: [9, 10, 12], category: 'general' },
  { id: '3betting', name: '3-Betting', description: 'Re-raising a player who has already raised, using either a polar or linear range strategy.', chapterIds: [10], category: 'preflop' },
  { id: 'polar-range', name: 'Polar 3-Bet Range', description: 'A 3-bet range split into value hands and bluffs with nothing in between. Used when you have fold equity.', chapterIds: [10], category: 'preflop' },
  { id: 'linear-range', name: 'Linear 3-Bet Range', description: 'A 3-bet range of the strongest hands only, with no bluffs. Used when fold equity is low.', chapterIds: [10], category: 'preflop' },
  { id: 'squeezing', name: 'Squeezing', description: '3-betting after there has been a raise and one or more callers, exploiting dead money.', chapterIds: [10, 11], category: 'preflop' },
  { id: 'facing-3bets', name: 'Facing 3-Bets', description: 'Deciding whether to call, 4-bet, or fold when your open raise gets 3-bet.', chapterIds: [11], category: 'preflop' },
  { id: 'defence-ranges', name: 'Defence Ranges', description: 'The complete set of hands you continue with when facing aggression to avoid being exploited.', chapterIds: [11], category: 'preflop' },
  { id: 'double-barrel', name: 'Double Barrel Bluffing', description: 'Continuing to bluff on the turn after c-betting the flop, usually when the turn card improves your range.', chapterIds: [12], category: 'postflop' },
  { id: 'triple-barrel', name: 'Triple Barrel Bluffing', description: 'Bluffing all three streets. Requires careful hand selection and good blockers on the river.', chapterIds: [12], category: 'postflop' },
  { id: 'delay-cbet', name: 'Delayed C-Bet', description: 'Checking the flop and betting the turn. Useful when flop c-bet is -EV but turn card improves your spot.', chapterIds: [12], category: 'postflop' },
  { id: 'probing', name: 'Turn Probing', description: 'Betting the turn OOP when the preflop raiser checked the flop, targeting their weak checking range.', chapterIds: [12], category: 'postflop' },
  { id: '3bet-pots', name: '3-Bet Pot Strategy', description: 'Adjusting your post-flop strategy in 3-bet pots where stacks are shallower and ranges are narrower.', chapterIds: [13], category: 'postflop' },
  { id: 'range-advantage', name: 'Range Advantage', description: 'When your range of hands is stronger than your opponent\'s on a given board texture.', chapterIds: [13], category: 'postflop' },
  { id: 'balance', name: 'Balance', description: 'Having a mix of value bets and bluffs in your range to remain unexploitable.', chapterIds: [13], category: 'general' },
  { id: 'stack-depth', name: 'Stack Depth', description: 'How the effective stack size changes preflop and postflop decision making.', chapterIds: [14], category: 'general' },
  { id: 'spr', name: 'Stack-to-Pot Ratio', description: 'The ratio of effective stacks to pot size. Low SPR favors big hands; high SPR favors speculative hands.', chapterIds: [14], category: 'general' },
  { id: 'nut-potential', name: 'Nut Potential', description: 'A hand\'s ability to make very strong hands like flushes, straights, or sets.', chapterIds: [10, 14], category: 'general' },
  { id: 'player-types', name: 'Player Type Adjustments', description: 'Modifying strategy based on whether villain is nitty, reg, loose-passive, or aggro.', chapterIds: [3, 7, 8, 12], category: 'general' },
  { id: 'equity-realization', name: 'Equity Realization', description: 'How well a hand can realize its raw equity, influenced by position, playability, and skill edge.', chapterIds: [6, 11], category: 'general' },
]

export function getConceptById(id: string): Concept | undefined {
  return concepts.find(c => c.id === id)
}

export function getConceptsByChapter(chapterId: number): Concept[] {
  return concepts.filter(c => c.chapterIds.includes(chapterId))
}

export function getConceptsByCategory(category: Concept['category']): Concept[] {
  return concepts.filter(c => c.category === category)
}
