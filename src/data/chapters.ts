import type { Chapter } from '@/types'

export const chapters: Chapter[] = [
  {
    id: 2,
    title: 'Opening the Pot',
    subtitle: 'Preflop open-raising fundamentals by position',
    sections: [
      '2.1 The 6 Handed Table',
      '2.2 Rating Starting Hands',
      '2.3 UTG',
      '2.4 HJ',
      '2.5 CO',
      '2.6 BU',
      '2.7 SB',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'Hand Categories: GPP, Value, and Non-Premium',
        content:
          'Starting hands fall into three categories. Good Pair Plus (GPP) hands like AA-TT and AK are strong enough to open from any position. Value hands like broadways and suited aces profit from open-raising but need some positional advantage. Non-Premium hands like suited connectors and weak broadways are only playable from later positions where you are more likely to act last post-flop. These hands have lower nut potential (NP) — they are less likely to make the nuts — so they need positional advantage to compensate.',
      },
      {
        type: 'principle',
        title: 'Positional Opening Ranges Widen As You Move Around the Table',
        content:
          'Open the tightest range from UTG because you have five players left to act and will usually be out of position post-flop. The Hijack adds some suited connectors and weaker broadways. The Cutoff opens considerably wider since only the Button and blinds remain. The Button has the widest opening range because it guarantees post-flop position. The Small Blind opens wider than UTG but narrower than the Button because it will always be out of position against a Big Blind caller.',
      },
      {
        type: 'heuristic',
        title: 'Default Open Size: 3bb + 1bb Per Limper',
        content:
          'Use a standard open-raise of 3 big blinds. Add 1 big blind for each limper already in the pot. This sizing gives you a good price on stealing the blinds while building a pot with your strong hands. Some players use 2.5bb from the Button or Cutoff to risk less when stealing.',
      },
      {
        type: 'mistake',
        title: 'Opening Too Wide From Early Position',
        content:
          'A common leak is playing hands like KTo, Q9s, or 76s from UTG or HJ. These hands face too many players behind, will often be dominated, and will usually play out of position. Tighten your early position range to hands that have strong equity against calling and 3-betting ranges.',
      },
      {
        type: 'mistake',
        title: 'Opening Too Tight From the Button',
        content:
          'Failing to steal the blinds frequently enough from the Button is a major missed opportunity. You are guaranteed position post-flop and only have two players to get through. Open any hand with reasonable playability including weak suited hands, gapped connectors, and most broadways.',
      },
      {
        type: 'factor',
        title: 'Key Decision Factors When Choosing to Open',
        content:
          'Consider: (1) Your position and how many players are left to act, (2) Whether the hand has good post-flop playability such as suitedness and connectedness, (3) The tendencies of the players in the blinds (tight blinds encourage more steals), (4) Whether your hand will frequently be dominated if called, and (5) Your ability to navigate tough post-flop spots out of position.',
      },
    ],
    conceptIds: ['position', 'open-raising', 'hand-selection', 'stealing'],
    summary:
      'Open-raising is the foundation of a winning strategy. Categorize hands as GPP, Value, or Non-Premium, then widen your range as position improves from UTG through the Button. Default to 3bb sizing and exploit tight blinds by stealing more from late position.',
  },
  {
    id: 3,
    title: 'When Someone Limps',
    subtitle: 'Isolation raising and playing against limpers',
    sections: [
      '3.1 The ISO Triangle',
      '3.2 Frequent Strength',
      '3.3 Fold Equity',
      '3.4 Position',
      '3.5 Limping Behind',
      '3.6 Sizing An ISO',
      '3.7 Example Hands',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'The Isolation Triangle: Strength, Fold Equity, Position',
        content:
          'When a player limps, decide whether to isolate by evaluating three factors forming a triangle. Frequent Strength asks whether your hand is strong enough to play a raised pot. Fold Equity asks whether the limper and remaining players will fold often enough to make a raise profitable. Position asks whether you will have post-flop position. You need at least two of these three factors to justify an isolation raise.',
      },
      {
        type: 'heuristic',
        title: 'Need Two of Three ISO Factors',
        content:
          'If you have all three factors (strong hand, fold equity, position) the isolation raise is clear. With only one factor, prefer to limp behind or fold. With two, you can usually isolate. For example, a decent hand in position against a player who folds to raises is a clear ISO even if the hand is not premium.',
      },
      {
        type: 'principle',
        title: 'Limping Behind for Implied Odds',
        content:
          'Sometimes the best play is to limp behind rather than isolate. This is correct when you hold a speculative hand with good implied odds such as small pairs or suited connectors, the limper is unlikely to fold to a raise, and the pot odds you are getting by overlimping are attractive. Limping behind also makes sense when the players behind you are passive and unlikely to raise.',
      },
      {
        type: 'heuristic',
        title: 'ISO Sizing: Standard Open + 1bb Per Limper',
        content:
          'Size your isolation raise as your normal open-raise plus 1 big blind for each limper in the pot. Against one limper, raise to about 4bb. Against two limpers, raise to about 5bb. This denies the limpers a cheap flop while keeping the raise proportional to what is already in the pot.',
      },
      {
        type: 'mistake',
        title: 'Isolating Without Fold Equity Against Calling Stations',
        content:
          'Raising speculative hands against a limper who never folds is a common error. If the limper calls raises with any two cards, you lose the fold equity leg of the triangle. Against calling stations, tighten your isolation range to hands that have strong frequent strength and can win at showdown. Save your suited connectors and weak broadways for limping behind.',
      },
      {
        type: 'factor',
        title: 'Evaluating a Limp Pot',
        content:
          'Before acting, assess: (1) How many players have limped and how likely are they to fold to a raise, (2) Your position relative to the limpers, (3) Whether players behind you are likely to squeeze, (4) Whether your hand plays better in a multiway limped pot or a heads-up raised pot, and (5) The stack depth of the limpers since deep stacks improve implied odds for speculative hands.',
      },
    ],
    conceptIds: ['isolation', 'fold-equity', 'position', 'implied-odds', 'pot-odds'],
    summary:
      'Against limpers, use the ISO Triangle to decide: raise when you have at least two of frequent strength, fold equity, and position. Size your ISO as the standard open plus 1bb per limper. Against calling stations, tighten up. Limp behind with speculative hands when implied odds are good.',
  },
  {
    id: 4,
    title: 'C-Betting',
    subtitle: 'Continuation betting strategy and sizing',
    sections: [
      '4.1 Light C-Bet Factors',
      '4.2 C-Bet Sizing',
      '4.3 More C-Bet Spots',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'The Seven Light C-Bet Factors',
        content:
          'A profitable continuation bet when you do not have a strong made hand depends on seven factors: (1) Dry board texture favoring the preflop raiser, (2) Good equity such as overcards or draws, (3) The villain folds frequently to c-bets, (4) Your hand is vulnerable with no showdown value, (5) The pot is heads-up not multiway, (6) Good turn and river prospects for barreling, and (7) You have position. The more of these factors present, the more profitable a c-bet becomes.',
      },
      {
        type: 'heuristic',
        title: 'Small on Dry Boards, Large on Wet Boards',
        content:
          'On dry, disconnected flops like K-7-2 rainbow, use a small c-bet around one-third pot. Villains fold roughly the same frequency regardless of size on dry boards, so a smaller bet risks less. On wet, connected flops like 9-8-6 with a flush draw, size up to two-thirds or three-quarters pot to charge draws and deny cheap cards.',
      },
      {
        type: 'mistake',
        title: 'C-Betting Into Multiple Opponents',
        content:
          'Continuation betting into three or more players with a weak hand is a major leak. In multiway pots, at least one opponent is likely to have connected with the board. Reserve your c-bets in multiway pots for genuine value hands and strong draws. Check and give up more often with air.',
      },
      {
        type: 'mistake',
        title: 'Mandatory Check: OOP to the Preflop Aggressor',
        content:
          'When you called a raise preflop and are out of position, you must check to the preflop aggressor on the flop. Betting into the raiser (donk betting) without a specific exploitative reason is almost always a mistake at lower stakes. It puts you in an awkward spot when raised and removes the option of check-raising.',
      },
      {
        type: 'factor',
        title: 'Board Texture and Range Advantage',
        content:
          'The most important factor for c-betting is how well the flop connects with your perceived range versus your opponent range. On ace-high and king-high dry boards, the preflop raiser has a clear range advantage and can c-bet at high frequency. On low, connected boards, the caller range connects more often, requiring the raiser to slow down and check more frequently.',
      },
    ],
    conceptIds: ['c-betting', 'board-texture', 'fold-equity', 'position', 'sizing'],
    summary:
      'Continuation bet profitably by evaluating seven factors including board texture, equity, and opponent fold frequency. Size small on dry boards and large on wet boards. Avoid c-betting multiway pots with air, and never donk bet out of position into the preflop raiser.',
  },
  {
    id: 5,
    title: 'Value Betting',
    subtitle: 'Extracting maximum value from strong hands',
    sections: [
      '5.1 Introducing Value Bet',
      '5.2 Relative Hand Strength',
      '5.3 Building the Pot',
      '5.4 Slowplaying',
      '5.5 Thick and Thin Value',
      '5.6 Sizing and Elasticity',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'Relative Hand Strength Matters, Not Absolute',
        content:
          'A hand is strong only relative to the range of hands your opponent will call with. Top pair good kicker on a dry board is a very strong hand against a wide calling range. The same hand on a wet, connected board where your opponent would only call with two pair or better is now a marginal hand. Always evaluate your hand against the range of hands your opponent continues with, not in isolation.',
      },
      {
        type: 'principle',
        title: 'Required Equity for Value Betting',
        content:
          'A value bet is profitable when your hand wins more than half the time against the range of hands that call. Use the formula Required Equity = Risk divided by (Risk + Reward). If you bet 60 into a pot of 100, your risk is 60 and your reward is 160 (the pot plus their call), so you need 60/160 = 37.5% equity against calling hands. Since your hand must beat over 50% of their calling range to be a value bet, this threshold is usually met if you are ahead of most of their continuing range.',
      },
      {
        type: 'heuristic',
        title: 'Thick Value vs Thin Value',
        content:
          'Thick value bets are made with hands that are clearly ahead of the calling range, like top set on a dry board. These are straightforward and should be sized large. Thin value bets are made with hands that are only marginally ahead of the calling range, like second pair on the river. Thin value bets should be sized smaller because you want to target the weakest part of the calling range without bloating the pot against hands that beat you.',
      },
      {
        type: 'principle',
        title: 'Slowplaying: When to Trap',
        content:
          'Slowplaying is correct only when three conditions are met: (1) Your hand is very strong and unlikely to be overtaken by a free card, (2) The board is dry so giving a free card is not dangerous, and (3) Betting would fold out almost everything in the opponent range. If any of these conditions fail, bet for value. Most players slowplay too often and leave money on the table.',
      },
      {
        type: 'factor',
        title: 'Sizing and Elasticity of Calling Ranges',
        content:
          'An elastic calling range is one where the opponent folds significantly more hands when you bet larger. Against elastic opponents, use smaller value bets to keep their calling range wide. An inelastic calling range means the opponent calls roughly the same hands regardless of size. Against inelastic opponents, bet large to extract maximum value. Recreational players tend to have inelastic ranges while regulars are more elastic.',
      },
      {
        type: 'mistake',
        title: 'Failing to Build the Pot With Strong Hands',
        content:
          'A common and costly leak is checking strong hands on early streets hoping to trap, then finding the pot too small on the river to get paid off. With strong but vulnerable hands, bet every street to build the pot. The pot grows geometrically: a half-pot bet on flop, turn, and river turns a 6bb pot into roughly 40bb. Missing even one street of value drastically reduces your winnings.',
      },
    ],
    conceptIds: ['value-betting', 'relative-strength', 'pot-building', 'sizing', 'slowplaying'],
    summary:
      'Value bet based on relative hand strength against your opponent calling range, not absolute hand strength. Use the Required Equity formula to verify profitability. Bet thick value large, thin value small, and only slowplay on dry boards when your hand is invulnerable and betting folds everything.',
  },
  {
    id: 6,
    title: 'Calling Opens',
    subtitle: 'Defending against open-raises by position',
    sections: [
      '6.1 Reasons to Call',
      '6.2 Cold Calling IP',
      '6.3 Calling OOP',
      '6.4 Calling Blind vs Blind',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'Your Hand Must Have Equity Against Their Range',
        content:
          'The fundamental requirement for calling an open-raise is that your hand must have sufficient equity against a good portion of the opener range. Hands that flop well with suitedness and connectedness are better calls than raw high-card hands. Suited connectors, pocket pairs, and suited broadways are the core of a cold-calling range because they frequently make strong hands or draws.',
      },
      {
        type: 'heuristic',
        title: 'Call Tighter vs Early Position, Looser vs Late Position',
        content:
          'An UTG opener has a tight, strong range so your calling range must also be tight, limited to premium hands and strong suited hands. A Cutoff or Button opener has a much wider range, so you can call with weaker hands that have decent playability. The wider the opener range, the more equity your marginal hands have against it.',
      },
      {
        type: 'principle',
        title: 'Cold Calling In Position',
        content:
          'Calling from the Button or Cutoff versus an open is the most favorable spot to cold call. Position gives you control of the pot size, the ability to realize your equity, and the option to bluff when checked to. Your in-position calling range can include suited connectors, small pairs, suited aces, and broadways that are not strong enough to 3-bet.',
      },
      {
        type: 'mistake',
        title: 'Cold Calling Out of Position With Marginal Hands',
        content:
          'Calling from the blinds with easily dominated hands like KTo, QJo, or A5o is a persistent leak. Out of position you cannot control the pot or reliably realize equity. Your OOP calling range should focus on hands that can make strong post-flop hands: pocket pairs for set mining, suited connectors, and strong suited broadways. Fold offsuit broadways that will frequently be dominated.',
      },
      {
        type: 'factor',
        title: 'Blind vs Blind Adjustments',
        content:
          'When the action folds to the Small Blind who raises, the Big Blind should defend much wider than usual. The SB is opening a wide range to steal, so your equity against that range is higher with any given hand. Defend with most suited hands, pairs, and broadways. Also consider 3-betting more liberally since the SB range is wide and you will always be out of position, making aggressive pre-flop play more attractive.',
      },
    ],
    conceptIds: ['calling-ranges', 'position', 'equity', 'blind-defense', 'hand-selection'],
    summary:
      'Call opens with hands that have good equity against the opener range and post-flop playability. Call tighter against early-position opens and wider against late-position opens. In position you can call more liberally. Avoid flatting dominated offsuit hands out of position, and defend the Big Blind widely against Small Blind steals.',
  },
  {
    id: 7,
    title: 'Facing Bets - End of Action',
    subtitle: 'Deciding to call when there is no further action behind',
    sections: [
      '7.1 Two-Part Thought Process',
      '7.2 Stats and Examples',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'The Two-Part Thought Process',
        content:
          'When facing a bet on the river or in a spot where no further action is possible, use a two-part framework. First, calculate your Required Equity by dividing Risk by (Risk + Reward) where Risk is the amount you must call and Reward is the total pot including the bet. Second, assess whether your hand meets that equity threshold by asking three questions about the villain range.',
      },
      {
        type: 'heuristic',
        title: 'Three Questions to Assess Your Equity',
        content:
          'Ask these questions in order: (1) Is it likely the villain would bet worse hands for value? If yes, you are more likely ahead. (2) Does the villain arrive at this spot with enough air or bluffs? If the villain has many missed draws, your bluff-catching equity increases. (3) Does the villain credibly represent better hands given the action? If the line does not make sense for strong hands, your equity goes up. Answering yes to any question makes calling more attractive.',
      },
      {
        type: 'heuristic',
        title: 'Required Equity Calculation in Practice',
        content:
          'Against a half-pot bet your Required Equity is 25%. Against a two-thirds pot bet it is 28.5%. Against a full pot bet it is 33%. Against a two-times pot bet it is 40%. Memorize these common thresholds so you can quickly assess river decisions without calculating from scratch every time.',
      },
      {
        type: 'mistake',
        title: 'Calling Based on Hand Strength Alone',
        content:
          'Many players call river bets simply because they hold top pair or an overpair without considering whether the villain range actually contains enough worse value bets and bluffs. A strong absolute hand can be a clear fold if the villain line only represents hands that beat you. Always analyze the range, never just your own cards.',
      },
      {
        type: 'factor',
        title: 'Using Stats to Estimate Villain Bluff Frequency',
        content:
          'Villain HUD stats help estimate bluff frequency. A high Aggression Factor or high Bet River percentage suggests a villain who fires thin value and bluffs frequently, making your bluff catchers more profitable calls. A low aggression villain who rarely bets rivers without strong hands warrants more folding. Without reads, use population tendencies: most low-stakes players underbluff rivers.',
      },
    ],
    conceptIds: ['required-equity', 'bluff-catching', 'range-analysis', 'villain-tendencies'],
    summary:
      'When facing a bet at the end of the action, calculate Required Equity and then evaluate whether the villain range contains enough worse value bets and bluffs for a call to be profitable. Use the three-question framework and memorize common equity thresholds for quick decisions.',
  },
  {
    id: 8,
    title: 'Facing Bets - Open Action',
    subtitle: 'Defending against bets when action remains',
    sections: [
      '8.1 Defending Flop Made-Hands',
      '8.2 Defending Flop Non-Made-Hands',
      '8.3 Defending Turn',
      '8.4 Dealing with Donk Bets',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'Good and Bad Factors for Continuing With Made Hands',
        content:
          'When facing a flop bet with a made hand, evaluate four factor pairs. Good factors are: True Equity where your hand is genuinely ahead, Outs When Behind so you can improve, Invulnerable Showdown Value meaning few cards hurt you, and Being In Position for pot control. Bad factors are: Ghost Equity where your hand looks good but is often dominated, No Outs When Behind, Vulnerable Showdown Value where many turn cards reduce your equity, and Being Out Of Position.',
      },
      {
        type: 'principle',
        title: 'Defending With Non-Made Hands on the Flop',
        content:
          'Continue with non-made hands on the flop based on the strength of your draw and implied odds. Flush draws and open-ended straight draws are strong enough to continue against a standard c-bet. Gutshots need additional equity such as overcards or backdoor draws to justify continuing. Pure overcards with no draw are a fold against most c-bets unless the board is very favorable.',
      },
      {
        type: 'heuristic',
        title: 'Turn Defense Is Tighter Than Flop Defense',
        content:
          'Facing a second barrel on the turn, tighten up significantly compared to the flop. Many of your speculative flop calls like weak draws and marginal pairs become folds on the turn if they have not improved. Continue with hands that have strengthened, strong draws with good pot odds, and hands that beat a large portion of the villain turn betting range.',
      },
      {
        type: 'mistake',
        title: 'Overvaluing Top Pair Weak Kicker On Wet Boards',
        content:
          'Holding top pair with a weak kicker on a wet, connected board is one of the most commonly overplayed holdings. This hand has Ghost Equity because it looks like top pair but is often dominated by better kickers or beaten by two pair and sets. It also has Vulnerable Showdown Value as many turn cards bring straights and flushes. Be prepared to fold these hands facing significant aggression.',
      },
      {
        type: 'factor',
        title: 'Responding to Donk Bets',
        content:
          'A donk bet is a lead into the preflop aggressor. At low stakes, donk bets typically indicate a medium-strength hand trying to set its own price or a draw that does not want to face a large c-bet. Raise strong hands for value, call with draws and decent made hands that want to see a turn, and fold weak hands. Do not auto-raise donk bets as a bluff since low-stakes donk bettors rarely fold.',
      },
    ],
    conceptIds: ['defending', 'equity', 'board-texture', 'position', 'showdown-value'],
    summary:
      'Defend against bets by evaluating good factors (true equity, outs, invulnerability, position) versus bad factors (ghost equity, no outs, vulnerability, OOP). Tighten up on the turn compared to the flop. Against donk bets, respect the line and avoid bluff-raising recreational players.',
  },
  {
    id: 9,
    title: 'Combos and Blockers',
    subtitle: 'Using hand combinations and card removal for precise analysis',
    sections: [
      '9.1 Using Combos Pre-Flop',
      '9.2 Using Combos Post-Flop',
      '9.3 Blockers',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'Fundamental Combo Counts',
        content:
          'Every pocket pair has 6 possible combinations. Every offsuit unpaired hand has 12 combinations. Every suited unpaired hand has 4 combinations. Therefore AKo is three times more likely than AKs, and there are 16 total combos of AK. Understanding these base counts is essential for estimating how ranges are distributed across different hand types.',
      },
      {
        type: 'principle',
        title: 'Card Removal Reduces Combos',
        content:
          'When known cards remove possibilities, combo counts drop. If you hold an Ace, AK goes from 16 combos down to 12 because four AK combos contained your specific Ace. On a board with a King, pocket Kings goes from 6 combos to 3 because three combos included the board King. Counting remaining combos tells you how likely specific hands are in the villain range.',
      },
      {
        type: 'heuristic',
        title: 'Blocker-Based Decision Making',
        content:
          'Blockers shift the composition of the villain range. If you hold the Ace of spades on a three-spade board, you block the nut flush, making it less likely the villain has the nuts. This makes your bluff catches better and your bluffs more effective. If you hold pocket Kings on an Ace-high board, you do not block AK or AQ, so the villain can easily have those hands, making your Kings more vulnerable.',
      },
      {
        type: 'mistake',
        title: 'Ignoring Blockers in Big River Decisions',
        content:
          'On the river facing a large bet, many players focus only on their hand strength without considering which hands they block in the villain range. Holding a heart when deciding whether the villain has a flush matters. Holding an Ace when deciding whether the villain has top pair matters. In close river spots, blockers can turn a fold into a call or a passive check into a bluff.',
      },
      {
        type: 'factor',
        title: 'Applying Combos to Range Analysis',
        content:
          'When you assign a villain a range, count the combos in each category. If the villain 3-bets AA (6 combos), KK (6), and AKs (4), that is 16 value combos. If the villain also 3-bet bluffs A5s (4) and A4s (4), that is 8 bluff combos. The ratio of value to bluff combos tells you how often you are facing strength and informs your defense frequency.',
      },
    ],
    conceptIds: ['combos', 'blockers', 'range-analysis', 'card-removal'],
    summary:
      'Pairs have 6 combos, offsuit hands 12, suited hands 4. Known cards reduce these counts through card removal. Use blockers in close decisions: blocking the villain strong hands makes bluff catches and bluffs more profitable. Count combos to understand the value-to-bluff ratio in the opponent range.',
  },
  {
    id: 10,
    title: '3-Betting',
    subtitle: 'Building and executing 3-bet strategies',
    sections: [
      '10.1 Polar 3-Betting',
      '10.2 Linear 3-Betting',
      '10.3 Practical Examples',
      '10.4 Squeezing',
      '10.5 3-Bet Sizing',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'Polar 3-Bet Ranges: Value, Call, Bluff',
        content:
          'A polar 3-bet strategy divides your range into three tiers. Value hands like AA, KK, QQ, and AK are always 3-bet for value. The middle of your range, hands like TT, AJs, and KQs, call the open because they are too strong to fold but not strong enough to 3-bet for value. Bluff 3-bets come from the bottom of the range, using hands with good blockers like A5s and A4s (which block AA and AK) or suited connectors that have decent equity when called. Use polar 3-betting against opponents who fold to 3-bets at a reasonable frequency.',
      },
      {
        type: 'principle',
        title: 'Linear 3-Bet Ranges: No Bluffs Needed',
        content:
          'When the opponent rarely folds to 3-bets, a polar strategy fails because your bluffs get called too often. Switch to a linear (merged) strategy where every 3-bet hand has genuine value. 3-bet strong hands like big pairs, big suited broadways, and strong aces while simply folding the hands you would have used as bluffs. This strategy forfeits bluff equity but avoids building big pots out of position with weak hands against stations.',
      },
      {
        type: 'heuristic',
        title: 'Ideal Bluff 3-Bet Hands',
        content:
          'The best bluff 3-bet hands share two properties: they block premium calling and 4-bet hands, and they retain decent equity when called. Ace-x suited hands like A5s through A2s are ideal because the Ace blocks AA and AK. Suited connectors like 76s and 87s work because they flop well and are harder to play profitably as calls. Avoid 3-bet bluffing with hands that have no blocker value and poor post-flop playability.',
      },
      {
        type: 'principle',
        title: 'Squeezing Against Multiple Players',
        content:
          'A squeeze is a 3-bet made when there is an open-raise and one or more callers. Squeezing is more profitable than standard 3-betting because the dead money from the caller makes your steal more valuable and the caller range is capped (they did not 3-bet). The original raiser also folds more often knowing there are players behind who might call. Size squeezes larger than standard 3-bets to account for the extra dead money.',
      },
      {
        type: 'heuristic',
        title: '3-Bet Sizing by Position',
        content:
          'In position, 3-bet to approximately 3 times the open-raise. Out of position, 3-bet to approximately 3.5 to 4 times the open-raise to compensate for the positional disadvantage. For squeezes, add roughly 1 to 2 big blinds on top per additional caller. Against recreational players who call too wide, size up further to exploit their inelastic calling ranges.',
      },
      {
        type: 'mistake',
        title: '3-Bet Bluffing Against Players Who Never Fold',
        content:
          'Persisting with a polar 3-bet strategy against opponents with a low fold-to-3-bet frequency is burning money. If the villain calls 3-bets with a wide range, your A5s bluff 3-bet will be called and you will play a bloated pot out of position with a weak hand. Identify calling stations and switch to linear 3-betting or simply tighten your 3-bet range.',
      },
    ],
    conceptIds: ['3-betting', 'polarization', 'blockers', 'fold-equity', 'squeezing'],
    summary:
      'Use polar 3-bet ranges (value, call, bluff) against opponents who fold enough. Switch to linear 3-betting against calling stations. Choose bluff 3-bet hands with good blockers like Axs. Squeeze larger when there is dead money from callers. Adjust sizing based on position and opponent tendencies.',
  },
  {
    id: 11,
    title: 'Facing 3-Bets',
    subtitle: 'Defending your opens against 3-bets',
    sections: [
      '11.1 Flatting 3-Bets',
      '11.2 Complete Defence Ranges',
      '11.3 Preemptive Adjustments',
      '11.4 Example Hands',
      '11.5 Facing Squeezes',
      '11.6 Facing 3-Bet Cold',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'Flatting 3-Bets Requires Playability and Position',
        content:
          'When facing a 3-bet, the hands that call should have strong post-flop playability and ideally position. Suited broadways like KQs, JTs, and AJs play well in 3-bet pots because they flop strong pairs and draws. Medium pocket pairs can call to set mine when stack depths allow. Avoid flatting 3-bets out of position with dominated hands like KJo or AT offsuit since you will face difficult decisions on nearly every flop.',
      },
      {
        type: 'heuristic',
        title: 'Build Complete Defense Ranges to Avoid Over-Folding',
        content:
          'If you fold too often to 3-bets, opponents can profitably 3-bet any two cards. As a guideline, defend at least 40 to 50 percent of your opening range against a 3-bet by combining 4-bets and calls. The exact defense frequency depends on the 3-bet sizing and your position, but always verify you are not folding so much that the villain auto-profits from 3-betting.',
      },
      {
        type: 'principle',
        title: 'Preemptive Adjustments Against Aggressive 3-Bettors',
        content:
          'If a player behind you 3-bets frequently, adjust before you even open. Tighten your opening range by cutting the weakest hands you would normally open. Additionally, shift some hands that would normally call 3-bets into 4-bet bluffs. The goal is to ensure that your opening range can withstand frequent 3-bets without being exploited.',
      },
      {
        type: 'mistake',
        title: 'Flatting 3-Bets Out of Position With Dominated Hands',
        content:
          'Calling a 3-bet from out of position with hands like KJo, QTo, or A9o is a significant leak. These hands are frequently dominated by the 3-bettor value range and you have no position to help you navigate post-flop. Either 4-bet these hands as bluffs or fold them. The in-between option of calling is the worst choice.',
      },
      {
        type: 'factor',
        title: 'Facing Squeezes and Cold 3-Bets',
        content:
          'When facing a squeeze after you have called an open, your range is capped since you did not 3-bet initially. Defend tighter than normal and fold most of your flatting range. When a 3-bet comes from a player who has not yet acted (cold 3-bet), treat it as stronger than a standard 3-bet because the cold 3-bettor entered the action voluntarily over multiple players. Tighten your defending range accordingly.',
      },
    ],
    conceptIds: ['defending', '3-betting', 'position', 'range-construction', 'fold-equity'],
    summary:
      'Defend against 3-bets by flatting with hands that have strong playability, especially in position. Build complete defense ranges to avoid being exploited by frequent 3-bettors. Adjust preemptively by tightening opens against aggressive opponents. Respect cold 3-bets and squeezes as stronger lines.',
  },
  {
    id: 12,
    title: 'Bluffing Turn and River',
    subtitle: 'Multi-street bluffing strategies and timing',
    sections: [
      '12.1 Double Barrel',
      '12.2 Triple Barrel',
      '12.3 Delaying C-Bet',
      '12.4 Probing Turn',
      '12.5 Bluff Raising Turn/River',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'Double Barrel Criteria Against Regulars',
        content:
          'A profitable double barrel on the turn requires several conditions: (1) The turn card improves your perceived range or gives you actual equity, (2) You have good equity with draws or overcards, (3) There is river follow-through potential so your bluff has credibility on multiple streets, (4) The villain is a tighter regular who can fold turns, and (5) Your hand has no showdown value, making a bet preferable to a check. Without these factors, check and give up with air on the turn.',
      },
      {
        type: 'heuristic',
        title: 'Good Turn Cards for Double Barreling',
        content:
          'Overcards to the board, cards that complete obvious draws, and cards that pair the board are all good double barrel cards. An Ace on the turn after you c-bet a middle-card flop is ideal because it favors the preflop raiser range. A flush-completing card is also strong because even if you do not hold the flush, the villain must respect that you might. Cards that change nothing, like low cards on an already dry board, are poor barrel candidates.',
      },
      {
        type: 'principle',
        title: 'Triple Barreling Requires a Narrow, Credible Story',
        content:
          'Three streets of aggression tells a very strong story. Your triple barrel must credibly represent a hand that would bet all three streets for value, such as an overpair or top pair top kicker on a favorable runout. The villain must also be capable of folding strong one-pair hands on the river. Against calling stations, triple barrel bluffing is torching money. Reserve triple barrels for opponents who respect river aggression.',
      },
      {
        type: 'principle',
        title: 'Probing the Turn When Checked To',
        content:
          'When the preflop raiser checks back the flop and you check the turn, you can probe with a bet. Probing is profitable because the raiser revealed weakness by not c-betting, meaning their range is capped. Good probe candidates are hands with some equity that would benefit from fold equity, like middle pair or a gutshot. Size probes at around half to two-thirds pot.',
      },
      {
        type: 'mistake',
        title: 'Bluffing the River Without a Plan',
        content:
          'Many players fire river bluffs impulsively without considering whether their line tells a coherent story. If you checked the flop and called the turn, suddenly bombing the river does not represent a strong hand. Your bluffing lines should be planned from earlier streets with a clear set of value hands you are representing and a believable sequence of actions.',
      },
      {
        type: 'factor',
        title: 'Bluff Raising on Turn and River',
        content:
          'Raising as a bluff on the turn or river is a high-risk, high-reward play that should be used sparingly. The best spots are when the board changes significantly (a scare card falls), you hold blockers to the villain value hands, and the villain line looks like thin value rather than a monster. Avoid bluff raising against opponents who under-bluff, since their bets are weighted toward strong hands that will not fold.',
      },
    ],
    conceptIds: ['bluffing', 'double-barrel', 'board-texture', 'fold-equity', 'range-analysis'],
    summary:
      'Double barrel when the turn improves your range and you have equity, especially against tight regulars. Triple barrel only with a credible story against opponents who can fold. Probe the turn when the raiser shows weakness. Plan bluff lines across multiple streets rather than firing impulsively.',
  },
  {
    id: 13,
    title: '3-Bet Pots and Balance',
    subtitle: 'Post-flop strategy in 3-bet pots',
    sections: [
      '13.1 C-Betting 3-Bet Pots',
      '13.2 As Aggressor',
      '13.3 Strategy As Defender',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'C-Betting Frequency in 3-Bet Pots Is Lower',
        content:
          'In 3-bet pots, stack-to-pot ratios are smaller and both ranges are stronger than in single-raised pots. The 3-bettor cannot c-bet as liberally because the caller range is condensed and strong. C-bet with your strong value hands and your best bluff candidates, but check back a wider portion of your range compared to single-raised pots. Board texture matters even more here because both players have narrow ranges.',
      },
      {
        type: 'principle',
        title: 'Aggressor Strategy: Leverage Range Advantage',
        content:
          'As the 3-bet aggressor, your range contains more overpairs and premium broadways. On high-card boards like A-K-x and K-Q-x, you have a significant range advantage and can c-bet at high frequency with a small sizing. On low, connected boards like 7-6-5, your range advantage disappears because the caller has more sets and two-pair combos. Check these boards more often and be prepared to give up.',
      },
      {
        type: 'heuristic',
        title: 'Small C-Bet Sizing in 3-Bet Pots',
        content:
          'Because stack-to-pot ratios are compressed in 3-bet pots, use a smaller c-bet size of around one-quarter to one-third pot. This size is effective because it does not risk much when you bluff, and the villain still has to fold a significant number of hands. With only one to two pot-sized bets remaining in the stacks, a small flop bet sets up natural turn and river shoves.',
      },
      {
        type: 'factor',
        title: 'Defending in 3-Bet Pots as the Caller',
        content:
          'As the defender in a 3-bet pot, respect the smaller stack-to-pot ratio and understand that you are often committed with top pair or better. Strong draws are also committing. Your strategy should focus on identifying which boards favor the aggressor range versus yours. On boards that connect with your flatting range (middle card boards with pairs and draws), consider check-raising to put pressure on the aggressor c-bet bluffs.',
      },
      {
        type: 'mistake',
        title: 'Playing 3-Bet Pots Like Single-Raised Pots',
        content:
          'A critical error is applying the same frequencies and sizings from single-raised pots to 3-bet pots. The dynamics are fundamentally different: ranges are narrower, stacks are shallower relative to the pot, and both players are stronger. Adjust by c-betting less frequently, using smaller sizing, and being more willing to commit with top pair because the shallow stacks make folding strong one-pair hands incorrect.',
      },
    ],
    conceptIds: ['3-bet-pots', 'c-betting', 'sizing', 'range-advantage', 'spr'],
    summary:
      'In 3-bet pots, both ranges are stronger and the stack-to-pot ratio is smaller. C-bet less frequently than in single-raised pots using smaller sizing. Leverage your range advantage on high-card boards as the aggressor. As the defender, look for check-raise opportunities on boards that favor your flatting range.',
  },
  {
    id: 14,
    title: 'Stack Depth',
    subtitle: 'Adjusting strategy for deep and shallow stacks',
    sections: [
      '14.1 Playing Deep Pre-Flop',
      '14.2 Playing Shallow Pre-Flop',
      '14.3 Playing Deep Post-Flop',
      '14.4 Dealing with Donk Bets',
    ],
    lessonBlocks: [
      {
        type: 'principle',
        title: 'Deep Stacks Increase Implied Odds',
        content:
          'When effective stacks are deep (150bb or more), hands that can make the nuts increase in value because there is more money to win post-flop. Small pocket pairs become more profitable to open and call with because set mining pays off hugely against deep stacks. Suited aces improve because nut flushes can stack opponents. Speculative suited connectors also gain value. Conversely, hands like ATo that make strong but non-nut hands become relatively weaker deep because they can build big pots they cannot win.',
      },
      {
        type: 'principle',
        title: 'Shallow Stacks Demand Simplified Preflop Strategy',
        content:
          'With effective stacks between 10 and 20 big blinds, open-raise smaller (2 to 2.5bb) because a standard 3bb open commits too much of your stack. Your opening range shifts toward hands that stand up well against all-in shoves: big broadway hands and medium-to-large pairs. Speculative hands like suited connectors and small pairs lose value because there is not enough money behind to realize implied odds. Be prepared for opponents to shove over your opens and have a plan for calling ranges.',
      },
      {
        type: 'heuristic',
        title: 'Deep Stack Preflop Adjustments',
        content:
          'When stacks are 150bb or deeper, make three adjustments: (1) Open tighter from early position since post-flop mistakes are amplified with deep stacks, (2) Increase the value of set mining and suited ace hands, calling more liberally with these in position, and (3) Be cautious about building large pots with one-pair hands since the deeper stacks mean one pair is rarely good enough to play for stacks.',
      },
      {
        type: 'principle',
        title: 'Deep Stack Post-Flop: Pot Control and Nut Advantage',
        content:
          'Post-flop with deep stacks, controlling the pot size becomes critical. With one-pair hands, lean toward checking and calling rather than betting and raising to keep the pot manageable. With nut hands like sets, straights, and flushes, build the pot aggressively across multiple streets. The key concept is that deep stacks reward nut hands disproportionately, so you want to be the player willing to put in all the money with the strongest hands while avoiding massive pots with marginal holdings.',
      },
      {
        type: 'mistake',
        title: 'Stacking Off With One Pair at Deep Stacks',
        content:
          'At 200bb deep, getting all the money in with top pair top kicker is almost always a disaster. Your opponent needs an extremely strong hand to put in that much money, and one pair is rarely good enough. Recognize that deep stacks change the effective hand strength hierarchy: one pair becomes a pot-control hand, two pair and sets become the hands you want to stack off with. Adjust your aggression accordingly.',
      },
      {
        type: 'factor',
        title: 'Stack-to-Pot Ratio as a Planning Tool',
        content:
          'The Stack-to-Pot Ratio (SPR) is the effective remaining stack divided by the pot on the flop. A low SPR (under 4) means you are nearly committed with top pair. A medium SPR (4 to 10) is standard play where hand reading matters most. A high SPR (over 10) means deep stacks and you should only commit with very strong hands. Calculate SPR on the flop and use it to plan your commitment level for the rest of the hand.',
      },
    ],
    conceptIds: ['stack-depth', 'implied-odds', 'spr', 'pot-control', 'hand-selection'],
    summary:
      'Deep stacks increase implied odds for nut-making hands like small pairs and suited aces while decreasing the relative value of one-pair hands. Shallow stacks demand tighter opens, smaller sizing, and hands that survive all-in confrontations. Use the Stack-to-Pot Ratio to plan commitment levels post-flop.',
  },
]
