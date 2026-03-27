import type { QuizQuestion } from '@/types'

export const chapter11Questions: QuizQuestion[] = [
  {
    id: 'q-11-001',
    chapterId: 11,
    conceptIds: ['3-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      'When Hero faces a 3-bet, what is the primary objective of flatting with a marginal part of the opening range?',
    options: [
      {
        id: 'a',
        text: 'To ensure the hand shows a net positive EV in tracking software.',
        explanation:
          "It is mathematically expected for marginal parts of an opening range to lose money when facing a 3-bet; the goal is not immediate profit but loss mitigation.",
      },
      {
        id: 'b',
        text: 'To achieve an EV that is less negative than simply folding.',
        explanation:
          'Folding loses the initial open size (e.g., -3BB); calling is correct if the resulting EV of the hand from that point is higher than -3BB.',
      },
      {
        id: 'c',
        text: 'To increase the pot size for maximum value when a pair is flopped.',
        explanation:
          'Marginal hands often suffer from domination or poor playability, making bloated pots dangerous rather than purely value-driven.',
      },
      {
        id: 'd',
        text: 'To force the Villain to fold to a post-flop continuation bet.',
        explanation:
          'Flatting puts Hero in a position without the initiative, meaning Hero is typically the one defending against c-bets rather than leading.',
      },
    ],
    correctOptionId: 'b',
    explanation:
      'Flatting marginal hands vs a 3-bet aims for an EV less negative than folding. If calling loses less than the open amount already invested, it is the correct play.',
    chapterReference: 'Chapter 11 — Facing 3-Bets with Marginal Hands',
  },
  {
    id: 'q-11-002',
    chapterId: 11,
    conceptIds: ['3-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      'Why does the author suggest that implied odds are often insufficient for calling 3-bets with 100BB stacks?',
    options: [
      {
        id: 'a',
        text: 'The rake at 25NL and 50NL makes implied odds calculations impossible.',
        explanation:
          'While rake is a factor in overall EV, it does not fundamentally negate the logic of investment-to-payout ratios.',
      },
      {
        id: 'b',
        text: 'Hero is usually out of position, which removes all implied odds.',
        explanation:
          'Position is a major factor, but implied odds still exist out of position; they are simply much harder to realize.',
      },
      {
        id: 'c',
        text: 'The ratio of the investment required to see the flop versus the potential payout is unfavorable.',
        explanation:
          'Investing 6 to 8BB to see a flop significantly reduces the potential return multiple needed to justify fit-or-fold play.',
      },
      {
        id: 'd',
        text: 'Villains at micro-stakes are too aggressive to allow for set-mining.',
        explanation:
          "Aggression can actually increase implied odds if a Villain is 'spewy,' but the primary constraint mentioned is mathematical rather than behavioral.",
      },
    ],
    correctOptionId: 'c',
    explanation:
      'At 100BB stacks, the 6-8BB investment to see a flop creates an unfavorable ratio — the potential payout multiple is too low to justify speculative calling.',
    chapterReference: 'Chapter 11 — Implied Odds vs 3-Bets',
  },
  {
    id: 'q-11-003',
    chapterId: 11,
    conceptIds: ['3-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      'Which hand is cited as a prime candidate for a 4-bet bluff in Hand 94 (UTG vs. SB) and why?',
    options: [
      {
        id: 'a',
        text: '77 because it can comfortably fold to a 5-bet shove.',
        explanation:
          'Small pairs like 77 are poor bluffing candidates because they have no blockers to the hands Villain will shove with.',
      },
      {
        id: 'b',
        text: "KJs because it dominates the Villain's light 3-betting range.",
        explanation:
          "If a hand dominates the Villain's range, it is usually better to flat to keep their bluffs in rather than 4-betting and forcing them to fold.",
      },
      {
        id: 'c',
        text: "A5s because it has the highest equity against a value range.",
        explanation:
          "While A5s is a good bluffing candidate due to playability, it is chosen for its 'nut' potential and blockers rather than raw equity against a value range.",
      },
      {
        id: 'd',
        text: "AQo because it contains double blockers to the Villain's value range of [QQ+, AK].",
        explanation:
          'Holding an Ace and a Queen significantly reduces the number of combinations of pocket Queens, pocket Aces, and AK that the Villain can hold.',
      },
    ],
    correctOptionId: 'd',
    explanation:
      "AQo is ideal for a 4-bet bluff because the Ace and Queen block QQ, AA, and AK — significantly reducing Villain's value combos.",
    chapterReference: 'Chapter 11 — Hand 94: 4-Bet Bluffing',
  },
  {
    id: 'q-11-004',
    chapterId: 11,
    conceptIds: ['3-betting', 'general-strategy'],
    type: 'multiple-choice',
    prompt:
      'What is the Minimum Defence Frequency (MDF) and its purpose in a balanced strategy?',
    options: [
      {
        id: 'a',
        text: "To make Villain's bluffs break even.",
        explanation:
          "By defending at the MDF, Hero prevents the opponent from profiting purely by adding more bluffs to their 3-betting range.",
      },
      {
        id: 'b',
        text: 'The percentage of hands Hero must fold to ensure Villain never bluffs.',
        explanation:
          'MDF is about the portion Hero defends, not folds, and it aims to make bluffing indifferent, not non-existent.',
      },
      {
        id: 'c',
        text: 'The ratio of bluffs to value hands Hero should use when 4-betting.',
        explanation:
          'This describes the composition of a 4-bet range, whereas MDF describes the overall frequency of defending the opening range.',
      },
      {
        id: 'd',
        text: 'The frequency with which Hero should 4-bet for value to exploit tight 3-bettors.',
        explanation:
          'MDF is a defensive concept meant to protect against overbluffing, not an offensive tool for value targeting.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      "MDF is the portion of Hero's range that must be defended to make Villain's bluffs exactly break even, preventing profitable over-bluffing.",
    chapterReference: 'Chapter 11 — Minimum Defence Frequency',
  },
  {
    id: 'q-11-005',
    chapterId: 11,
    conceptIds: ['3-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "How should Hero adjust his defense strategy against a 'Passive Fish' who 3-bets to 8BB?",
    options: [
      {
        id: 'a',
        text: 'Adopt a balanced MDF strategy to ensure he cannot be exploited.',
        explanation:
          'Balance is unnecessary against players who do not adjust or bluff; the goal should be pure exploitation.',
      },
      {
        id: 'b',
        text: 'Increase 4-bet bluffing frequency because the fish folds to aggression.',
        explanation:
          'Passive fish rarely 3-bet bluff, meaning their range is heavily weighted toward value hands they will not fold.',
      },
      {
        id: 'c',
        text: "Flat a wide range of suited connectors to exploit the fish's post-flop weaknesses.",
        explanation:
          "Suited connectors are often dominated by the high cards in a passive fish's 3-bet range and require significant fold equity post-flop, which is lacking.",
      },
      {
        id: 'd',
        text: "Defend only hands capable of flopping 'monsters' for implied odds, such as pocket pairs.",
        explanation:
          "Against a range as tight as [KK+], Hero's goal is to set-mine or flop a straight, where the fish's strong range ensures Hero gets paid off.",
      },
    ],
    correctOptionId: 'd',
    explanation:
      "Against a passive fish's tight 3-bet range, defend only hands that can flop monsters (sets, straights) — their strong range guarantees big payoffs when you hit.",
    chapterReference: 'Chapter 11 — Defending vs Passive Fish 3-Bets',
  },
  {
    id: 'q-11-006',
    chapterId: 11,
    conceptIds: ['3-betting', 'fold-equity'],
    type: 'multiple-choice',
    prompt:
      "In the formula for Villain's Raw Required Fold Equity (RFE = R/(R+PG)), what does PG represent?",
    options: [
      {
        id: 'a',
        text: 'The current size of the pot plus any blinds and dead money.',
        explanation:
          'PG stands for Potential Gain, which is the money already in the middle that the bettor stands to win if the opponent folds.',
      },
      {
        id: 'b',
        text: "The total amount of the Villain's stack.",
        explanation:
          "Stack size is important for implied odds but is not the 'Potential Gain' of a single bet.",
      },
      {
        id: 'c',
        text: 'The percentage of the time the Villain expects to win at showdown.',
        explanation:
          'This refers to equity, which is separate from the fold equity required to make a bluff profitable.',
      },
      {
        id: 'd',
        text: 'The size of the 3-bet the Villain is making.',
        explanation:
          'The size of the bet itself represents the risk (R), not the gain (PG).',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'PG (Potential Gain) is the money already in the pot — blinds, dead money, and previous bets — that the bettor wins if the opponent folds.',
    chapterReference: 'Chapter 11 — Required Fold Equity Formula',
  },
  {
    id: 'q-11-007',
    chapterId: 11,
    conceptIds: ['3-betting', 'open-raising'],
    type: 'multiple-choice',
    prompt:
      'What is a primary reason to open for 2BB instead of 3BB when facing aggressive 3-bettors?',
    options: [
      {
        id: 'a',
        text: "It creates a deeper stack-to-pot ratio (SPR), improving Hero's implied odds and room for play.",
        explanation:
          'Smaller opens keep the pot smaller relative to stacks, allowing Hero more flexibility and better math for speculative hands.',
      },
      {
        id: 'b',
        text: "It decreases the Villain's Raw Required Fold Equity (RFE).",
        explanation:
          "Opening smaller actually increases the Villain's RFE slightly if they maintain standard sizing, making their bluffs require more folds to be profitable.",
      },
      {
        id: 'c',
        text: 'It signals to the table that Hero is playing a tight, cautious strategy.',
        explanation:
          'Sizing adjustments are mathematical tools, and aggressive players often interpret smaller opens as a sign of a wider, more steal-oriented range.',
      },
      {
        id: 'd',
        text: 'It forces the Villain to 3-bet to a smaller size, giving Hero better pot odds.',
        explanation:
          'Villain can choose to 3-bet to any size they wish; they are not forced to go smaller.',
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Opening 2BB instead of 3BB creates a deeper SPR, giving Hero more post-flop flexibility, better implied odds, and room to maneuver against aggressive 3-bettors.',
    chapterReference: 'Chapter 11 — Open Sizing vs Aggressive 3-Bettors',
  },
  {
    id: 'q-11-008',
    chapterId: 11,
    conceptIds: ['3-betting', 'hand-selection'],
    type: 'multiple-choice',
    prompt:
      "When facing a squeeze as the pre-flop raiser (PFR) with an aggressive fish still in the pot, why should Hero's strategy shift toward flatting big pairs?",
    options: [
      {
        id: 'a',
        text: "The fish's presence boosts implied odds and allows Hero to take advantage of the fish stacking off too lightly.",
        explanation:
          'Hero wants to keep the fish in the pot because the fish is a primary source of EV, and big pairs perform exceptionally well in multi-way pots against weak ranges.',
      },
      {
        id: 'b',
        text: 'To hide the strength of the hand and prevent the squeezer from folding.',
        explanation:
          'While true, the primary reason provided is the involvement of the third player (the fish) in the pot.',
      },
      {
        id: 'c',
        text: 'Flatting ensures Hero maintains position on the squeezer for the remainder of the hand.',
        explanation:
          "Hero's position relative to the squeezer is fixed by the seats at the table, regardless of whether Hero flats or 4-bets.",
      },
      {
        id: 'd',
        text: 'MDF requirements increase when three players are involved in the pot.',
        explanation:
          "Actually, MDF requirements for the PFR decrease because the other caller shares the burden of defending against the squeezer's bluffs.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      "Flatting big pairs keeps the fish in the pot — they are the primary EV source, stacking off too lightly, and big pairs crush their weak ranges in multiway pots.",
    chapterReference: 'Chapter 11 — Facing Squeezes with Fish in Pot',
  },
  {
    id: 'q-11-009',
    chapterId: 11,
    conceptIds: ['3-betting', 'position'],
    type: 'multiple-choice',
    prompt:
      'Why does the author generally advise against having a cold-calling range in steal spots (e.g., BB facing BU open and SB 3-bet)?',
    options: [
      {
        id: 'a',
        text: 'Hero has a capped range and must play out of position against an uncapped BU range that is still to act.',
        explanation:
          'Calling 7.5BB cold without initiative into two players — one of whom has an uncapped range — is a recipe for being squeezed or outplayed post-flop.',
      },
      {
        id: 'b',
        text: 'The pot odds in the BB are too poor to justify calling any amount.',
        explanation:
          'Pot odds are actually quite good in the BB; the issue is the realization of equity and the positional/tactical disadvantage.',
      },
      {
        id: 'c',
        text: 'It is impossible to balance a cold-calling range against two opponents.',
        explanation:
          'Balance is possible, but the technical difficulty and lack of initiative make it less desirable than a polar 4-bet strategy.',
      },
      {
        id: 'd',
        text: 'Cold calling is always a sign of a weak player at micro-stakes.',
        explanation:
          "While often true for fish, the author's argument is based on tactical disadvantages rather than player image.",
      },
    ],
    correctOptionId: 'a',
    explanation:
      'Cold-calling in steal spots leaves Hero with a capped range, no initiative, and vulnerability to squeezes from uncapped ranges still to act.',
    chapterReference: 'Chapter 11 — Cold-Calling in Steal Spots',
  },
  {
    id: 'q-11-010',
    chapterId: 11,
    conceptIds: ['3-betting', 'general-strategy'],
    type: 'multiple-choice',
    prompt:
      "In Hand 107 (UTG open, HJ 3-bet), why is it recommended to have a '4-bet nothing' strategy?",
    options: [
      {
        id: 'a',
        text: "4-betting for value with Aces is too 'obvious' and will always be folded to.",
        explanation:
          "Value 4-betting is still profitable; the strategy suggests calling to keep Hero's overall range uncapped and protected.",
      },
      {
        id: 'b',
        text: 'Hero should always fold AKo and QQ in this spot to avoid being crushed.',
        explanation:
          "These hands are too strong to fold but can be played more effectively as calls to protect the rest of Hero's flatting range.",
      },
      {
        id: 'c',
        text: "Villains at these positions have extremely narrow ranges, making 4-bet bluffs ineffective.",
        explanation:
          "Early position opens and raises command high respect; since Villain's range is so strong, Hero likely won't get enough folds to make bluffing profitable.",
      },
      {
        id: 'd',
        text: 'Hero\'s position on the Button allows him to play any hand profitably by calling.',
        explanation:
          "Hero still needs a very tight range to call, as early position ranges dominate many standard 'combative' hands.",
      },
    ],
    correctOptionId: 'c',
    explanation:
      "In UTG vs HJ spots, both ranges are extremely narrow. 4-bet bluffs are ineffective because Villain won't fold enough, making a pure call-or-fold strategy optimal.",
    chapterReference: 'Chapter 11 — Hand 107: 4-Bet Nothing Strategy',
  },
]
