/**
 * Quiz question generator for each chapter.
 * Produces 100 questions per chapter from lesson block content and poker concept templates.
 */
import type { QuizQuestion, LessonBlock } from '@/types'

interface ChapterInput {
  chapterId: number
  title: string
  conceptIds: string[]
  lessonBlocks: LessonBlock[]
  summary: string
}

// Deterministic seeded random for consistent question generation
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function shuffleWithRng<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function makeId(chapterId: number, index: number): string {
  return `q-${chapterId}-${String(index).padStart(3, '0')}`
}

/** Truncate text at the last complete sentence within maxLen, never mid-word */
function truncateSentence(text: string, maxLen = 300): string {
  if (text.length <= maxLen) return text
  const truncated = text.substring(0, maxLen)
  const lastPeriod = truncated.lastIndexOf('.')
  if (lastPeriod > maxLen * 0.4) return truncated.substring(0, lastPeriod + 1)
  const lastSpace = truncated.lastIndexOf(' ')
  if (lastSpace > maxLen * 0.5) return truncated.substring(0, lastSpace) + '.'
  return truncated + '...'
}

// Generate questions about a specific lesson block
function generateLessonBlockQuestions(
  block: LessonBlock,
  chapterId: number,
  conceptIds: string[],
  startIdx: number,
  _rng: () => number,
): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  const ref = `Chapter ${chapterId}: ${block.title}`

  // Extract key phrases from content for question generation
  const sentences = block.content.split(/\.\s+/).filter(s => s.length > 20)

  if (block.type === 'principle') {
    // Q: What is the key principle?
    if (sentences.length >= 2) {
      questions.push({
        id: makeId(chapterId, startIdx + questions.length),
        chapterId,
        conceptIds,
        type: 'multiple-choice',
        prompt: `According to the concept "${block.title}", which statement is most accurate?`,
        options: [
          { id: 'a', text: sentences[0] + '.', explanation: 'This directly states the core principle.' },
          { id: 'b', text: `The opposite of ${block.title.toLowerCase()} is always the best approach.`, explanation: 'This contradicts the chapter teaching.' },
          { id: 'c', text: 'This concept only applies in tournament poker, not cash games.', explanation: 'The concept applies to cash games as taught in this chapter.' },
          { id: 'd', text: 'This principle is only relevant at high stakes.', explanation: 'The principle applies at all stakes levels.' },
        ],
        correctOptionId: 'a',
        explanation: sentences[0] + '.',
        chapterReference: ref,
      })
    }

    // True/false style
    if (sentences.length >= 1) {
      questions.push({
        id: makeId(chapterId, startIdx + questions.length),
        chapterId,
        conceptIds,
        type: 'true-false',
        prompt: `True or false: ${sentences[0]}.`,
        options: [
          { id: 'a', text: 'True', explanation: 'This is a correct statement of the principle.' },
          { id: 'b', text: 'False', explanation: '' },
        ],
        correctOptionId: 'a',
        explanation: `This is correct. ${truncateSentence(block.content)}`,
        chapterReference: ref,
      })

      // False version with negation
      const negated = sentences[0].replace(/\b(is|are|should|must|can|do|does|will)\b/i, (m) => m + ' not')
      if (negated !== sentences[0]) {
        questions.push({
          id: makeId(chapterId, startIdx + questions.length),
          chapterId,
          conceptIds,
          type: 'true-false',
          prompt: `True or false: ${negated}.`,
          options: [
            { id: 'a', text: 'True', explanation: '' },
            { id: 'b', text: 'False', explanation: 'The original statement without the negation is what the chapter teaches.' },
          ],
          correctOptionId: 'b',
          explanation: `This is false. The chapter teaches: ${sentences[0]}.`,
          chapterReference: ref,
        })
      }
    }
  }

  if (block.type === 'mistake') {
    // Q: Which of these is a common mistake?
    questions.push({
      id: makeId(chapterId, startIdx + questions.length),
      chapterId,
      conceptIds,
      type: 'multiple-choice',
      prompt: `Which of the following is identified as a common mistake in this chapter?`,
      options: [
        { id: 'a', text: block.title, explanation: 'Correct. This is explicitly identified as a mistake to avoid.' },
        { id: 'b', text: 'Playing too tight from the Button', explanation: 'While this can be a mistake, it is not the one identified here.' },
        { id: 'c', text: 'Always folding to aggression', explanation: 'This is not the specific mistake discussed.' },
        { id: 'd', text: 'Using standard sizing in all spots', explanation: 'This is not the specific mistake discussed.' },
      ],
      correctOptionId: 'a',
      explanation: truncateSentence(block.content),
      chapterReference: ref,
    })

    // Why is it a mistake?
    if (sentences.length >= 2) {
      questions.push({
        id: makeId(chapterId, startIdx + questions.length),
        chapterId,
        conceptIds,
        type: 'best-reasoning',
        prompt: `Why is "${block.title}" considered a leak?`,
        options: [
          { id: 'a', text: sentences[1] ? sentences[1] + '.' : sentences[0] + '.', explanation: 'This captures the core reasoning from the chapter.' },
          { id: 'b', text: 'Because it makes the game less fun.', explanation: 'Strategic mistakes are about EV, not entertainment.' },
          { id: 'c', text: 'Because professional players never do it.', explanation: 'The reasoning is about strategic logic, not mimicking pros.' },
          { id: 'd', text: 'Because it violates standard poker etiquette.', explanation: 'This is a strategic concern, not an etiquette issue.' },
        ],
        correctOptionId: 'a',
        explanation: truncateSentence(block.content),
        chapterReference: ref,
      })
    }
  }

  if (block.type === 'heuristic') {
    // Q: What is the recommended heuristic?
    questions.push({
      id: makeId(chapterId, startIdx + questions.length),
      chapterId,
      conceptIds,
      type: 'multiple-choice',
      prompt: `What does the heuristic "${block.title}" recommend?`,
      options: [
        { id: 'a', text: sentences[0] ? sentences[0] + '.' : truncateSentence(block.content, 150), explanation: 'This is the correct heuristic from the chapter.' },
        { id: 'b', text: 'Always use the maximum possible sizing.', explanation: 'The heuristic does not recommend this.' },
        { id: 'c', text: 'Ignore position when making this decision.', explanation: 'Position is always relevant in poker strategy.' },
        { id: 'd', text: 'Use this approach only against recreational players.', explanation: 'The heuristic is a general guideline, not villain-specific.' },
      ],
      correctOptionId: 'a',
      explanation: truncateSentence(block.content),
      chapterReference: ref,
    })
  }

  if (block.type === 'factor') {
    // Q: Which factors matter?
    questions.push({
      id: makeId(chapterId, startIdx + questions.length),
      chapterId,
      conceptIds,
      type: 'multiple-choice',
      prompt: `When evaluating the decision factors discussed in "${block.title}", which consideration is most important?`,
      options: [
        { id: 'a', text: sentences[0] ? sentences[0] + '.' : truncateSentence(block.content, 150), explanation: 'This is the primary consideration from the chapter.' },
        { id: 'b', text: 'Your emotional state at the table.', explanation: 'While tilt management matters, it is not one of the strategic factors discussed.' },
        { id: 'c', text: 'The color of the cards dealt.', explanation: 'This is irrelevant to strategic decision-making.' },
        { id: 'd', text: 'How many hands you have played in the session.', explanation: 'Session length is not a factor in hand-by-hand strategy.' },
      ],
      correctOptionId: 'a',
      explanation: truncateSentence(block.content),
      chapterReference: ref,
    })
  }

  return questions
}

// Generate cross-concept comparison questions
function generateComparisonQuestions(
  blocks: LessonBlock[],
  chapterId: number,
  conceptIds: string[],
  title: string,
  startIdx: number,
  _rng: () => number,
): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  const ref = `Chapter ${chapterId}: ${title}`

  const principles = blocks.filter(b => b.type === 'principle')
  const mistakes = blocks.filter(b => b.type === 'mistake')
  const heuristics = blocks.filter(b => b.type === 'heuristic')

  // Q: Which is a principle vs mistake?
  if (principles.length > 0 && mistakes.length > 0) {
    questions.push({
      id: makeId(chapterId, startIdx + questions.length),
      chapterId,
      conceptIds,
      type: 'multiple-choice',
      prompt: `Which of the following is a recommended principle from Chapter ${chapterId}, not a mistake to avoid?`,
      options: shuffleWithRng([
        { id: 'a', text: principles[0].title, explanation: 'Correct - this is a principle to follow.' },
        { id: 'b', text: mistakes[0].title, explanation: 'This is actually a mistake to avoid, not a principle to follow.' },
        { id: 'c', text: `Always ${mistakes[0].title.toLowerCase()}`, explanation: 'This describes a mistake, not a principle.' },
        { id: 'd', text: 'None of the above are correct principles.', explanation: 'One of the options is a correct principle.' },
      ], _rng),
      correctOptionId: 'a',
      explanation: `"${principles[0].title}" is a key principle, while "${mistakes[0].title}" is a common mistake.`,
      chapterReference: ref,
    })
  }

  // Heuristic application question
  if (heuristics.length > 0) {
    const h = heuristics[0]
    questions.push({
      id: makeId(chapterId, startIdx + questions.length),
      chapterId,
      conceptIds,
      type: 'scenario',
      prompt: `You are in a hand and need to make a quick decision. Which mental shortcut from this chapter should you apply?`,
      scenario: `Review the heuristic: "${h.title}"`,
      options: [
        { id: 'a', text: h.content.split('.')[0] + '.', explanation: 'This is the correct application of the heuristic.' },
        { id: 'b', text: 'Always go with your gut feeling in the moment.', explanation: 'Instinct is not a reliable heuristic for poker strategy.' },
        { id: 'c', text: 'Call whenever you have any piece of the board.', explanation: 'This is too wide and not what the chapter recommends.' },
        { id: 'd', text: 'Fold all marginal hands to avoid variance.', explanation: 'Folding all marginal hands is too tight and leaves value on the table.' },
      ],
      correctOptionId: 'a',
      explanation: truncateSentence(h.content),
      chapterReference: ref,
    })
  }

  return questions
}

// Position-specific questions
function generatePositionQuestions(
  chapterId: number,
  conceptIds: string[],
  title: string,
  startIdx: number,
  _rng: () => number,
): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  const ref = `Chapter ${chapterId}: ${title}`

  // General position understanding
  questions.push({
    id: makeId(chapterId, startIdx + questions.length),
    chapterId,
    conceptIds,
    type: 'multiple-choice',
    prompt: 'Which position has the tightest recommended opening range?',
    options: [
      { id: 'a', text: 'UTG (Under the Gun)', explanation: 'Correct - UTG has 5 players behind and must play tightest.' },
      { id: 'b', text: 'Button', explanation: 'The Button has the widest opening range due to guaranteed position.' },
      { id: 'c', text: 'Cutoff', explanation: 'The Cutoff opens wider than UTG since only BU and blinds remain.' },
      { id: 'd', text: 'Small Blind', explanation: 'The SB opens wider than UTG despite being out of position.' },
    ],
    correctOptionId: 'a',
    explanation: 'UTG has the tightest opening range because five players remain to act behind, increasing the chance of facing a strong hand.',
    chapterReference: ref,
  })

  questions.push({
    id: makeId(chapterId, startIdx + questions.length),
    chapterId,
    conceptIds,
    type: 'multiple-choice',
    prompt: 'Which position has the widest recommended opening range?',
    options: [
      { id: 'a', text: 'Button', explanation: 'Correct - the Button opens widest because it guarantees post-flop position.' },
      { id: 'b', text: 'Small Blind', explanation: 'The SB opens wide but is always OOP post-flop, limiting its range.' },
      { id: 'c', text: 'Cutoff', explanation: 'The CO is wide but the Button is wider.' },
      { id: 'd', text: 'Big Blind', explanation: 'The BB defends rather than opens.' },
    ],
    correctOptionId: 'a',
    explanation: 'The Button has the widest opening range because it is guaranteed post-flop position and only has the blinds left to act.',
    chapterReference: ref,
  })

  // Hand classification
  const handTypes = [
    { hand: 'AA', category: 'GPP (Good Pair Plus)', canOpen: 'any position' },
    { hand: 'KK', category: 'GPP', canOpen: 'any position' },
    { hand: 'AKs', category: 'GPP/Value', canOpen: 'any position' },
    { hand: '76s', category: 'Non-Premium speculative', canOpen: 'late position (CO/BU)' },
    { hand: 'Q9o', category: 'Weak offsuit', canOpen: 'generally fold from early position' },
  ]

  for (const ht of handTypes) {
    questions.push({
      id: makeId(chapterId, startIdx + questions.length),
      chapterId,
      conceptIds,
      type: 'multiple-choice',
      prompt: `How would you classify ${ht.hand} for opening purposes?`,
      options: [
        { id: 'a', text: `${ht.category} - can open from ${ht.canOpen}`, explanation: 'Correct classification based on the chapter.' },
        { id: 'b', text: 'Always fold this hand preflop.', explanation: `${ht.hand} has value in the right spots.` },
        { id: 'c', text: 'Open from any position regardless of table dynamics.', explanation: 'Position matters for all hands.' },
        { id: 'd', text: 'Only play this hand in tournaments.', explanation: 'Hand selection applies to both cash and tournament play.' },
      ],
      correctOptionId: 'a',
      explanation: `${ht.hand} is classified as ${ht.category} and is appropriate to open from ${ht.canOpen}.`,
      chapterReference: ref,
    })
  }

  return questions
}

// Sizing questions
function generateSizingQuestions(
  chapterId: number,
  conceptIds: string[],
  title: string,
  startIdx: number,
  _rng: () => number,
): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  const ref = `Chapter ${chapterId}: ${title}`

  const sizingScenarios = [
    {
      prompt: 'What is the standard default open-raise size?',
      correct: '3 big blinds',
      wrong: ['1 big blind (min-raise)', '5 big blinds', 'All-in'],
      explanation: 'The default open-raise size is 3 big blinds, with adjustments for limpers (+1bb each).',
    },
    {
      prompt: 'When facing one limper, what should your isolation raise size be?',
      correct: 'About 4 big blinds (standard open + 1bb per limper)',
      wrong: ['The same as a standard open (3bb)', '10 big blinds to pressure them', 'Min-raise to 2bb'],
      explanation: 'ISO sizing is your standard open plus 1bb per limper in the pot.',
    },
    {
      prompt: 'On a dry, disconnected flop (e.g., K-7-2 rainbow), what c-bet size is recommended?',
      correct: 'Small - around one-third pot',
      wrong: ['Full pot', 'Two-thirds pot', 'Overbet (1.5x pot)'],
      explanation: 'On dry boards, a small c-bet risks less since villains fold at similar rates regardless of size.',
    },
    {
      prompt: 'On a wet, connected flop (e.g., 9-8-6 with a flush draw), what c-bet size is recommended?',
      correct: 'Two-thirds to three-quarters pot',
      wrong: ['One-third pot', 'Min bet', 'Check (never c-bet wet boards)'],
      explanation: 'On wet boards, size up to charge draws and deny cheap cards.',
    },
  ]

  for (const s of sizingScenarios) {
    const opts = [
      { id: 'a', text: s.correct, explanation: 'Correct sizing based on the chapter.' },
      ...s.wrong.map((w, i) => ({
        id: String.fromCharCode(98 + i),
        text: w,
        explanation: 'This is not the recommended sizing.',
      })),
    ]
    questions.push({
      id: makeId(chapterId, startIdx + questions.length),
      chapterId,
      conceptIds,
      type: 'multiple-choice',
      prompt: s.prompt,
      options: shuffleWithRng(opts, _rng),
      correctOptionId: 'a',
      explanation: s.explanation,
      chapterReference: ref,
    })
  }

  return questions
}

// Generate scenario-based questions
function generateScenarioQuestions(
  chapterId: number,
  conceptIds: string[],
  title: string,
  blocks: LessonBlock[],
  startIdx: number,
  _rng: () => number,
): QuizQuestion[] {
  const questions: QuizQuestion[] = []
  const ref = `Chapter ${chapterId}: ${title}`

  // Generic scenario templates that can apply to any chapter
  const scenarios = [
    {
      scenario: `You are reviewing your hand history and notice a pattern related to "${blocks[0]?.title || title}".`,
      prompt: 'What adjustment should you make based on this chapter\'s teachings?',
      correct: `Apply the principle: ${blocks[0]?.content.split('.')[0] || 'Follow the chapter guidelines'}.`,
      wrong: [
        'Make no adjustment - variance explains everything.',
        'Play the opposite of what the chapter recommends as a meta-game adjustment.',
        'Only adjust if playing live, not online.',
      ],
    },
  ]

  for (const s of scenarios) {
    questions.push({
      id: makeId(chapterId, startIdx + questions.length),
      chapterId,
      conceptIds,
      type: 'scenario',
      scenario: s.scenario,
      prompt: s.prompt,
      options: [
        { id: 'a', text: s.correct, explanation: 'This aligns with the chapter teaching.' },
        ...s.wrong.map((w, i) => ({
          id: String.fromCharCode(98 + i),
          text: w,
          explanation: 'This does not follow the chapter recommendations.',
        })),
      ],
      correctOptionId: 'a',
      explanation: blocks[0] ? truncateSentence(blocks[0].content) : 'Apply the chapter concepts consistently.',
      chapterReference: ref,
    })
  }

  return questions
}

/**
 * Main generator - produces 100 quiz questions for a chapter
 */
export function generateChapterQuizzes(input: ChapterInput): QuizQuestion[] {
  const { chapterId, title, conceptIds, lessonBlocks, summary } = input
  const rng = seededRandom(chapterId * 7919 + 104729) // Prime-based seed per chapter
  const allQuestions: QuizQuestion[] = []
  let idx = 1

  // Phase 1: Generate questions from each lesson block (5-7 per block)
  for (const block of lessonBlocks) {
    const blockQs = generateLessonBlockQuestions(block, chapterId, conceptIds, idx, rng)
    allQuestions.push(...blockQs)
    idx += blockQs.length
  }

  // Phase 2: Cross-concept comparison questions (5-10)
  const compQs = generateComparisonQuestions(lessonBlocks, chapterId, conceptIds, title, idx, rng)
  allQuestions.push(...compQs)
  idx += compQs.length

  // Phase 3: Position-specific questions if relevant
  if (conceptIds.includes('position') || conceptIds.includes('open-raising') || conceptIds.includes('hand-selection')) {
    const posQs = generatePositionQuestions(chapterId, conceptIds, title, idx, rng)
    allQuestions.push(...posQs)
    idx += posQs.length
  }

  // Phase 4: Sizing questions if relevant
  if (conceptIds.includes('sizing') || conceptIds.includes('c-betting') || conceptIds.includes('open-raising')) {
    const sizeQs = generateSizingQuestions(chapterId, conceptIds, title, idx, rng)
    allQuestions.push(...sizeQs)
    idx += sizeQs.length
  }

  // Phase 5: Scenario questions
  const scenQs = generateScenarioQuestions(chapterId, conceptIds, title, lessonBlocks, idx, rng)
  allQuestions.push(...scenQs)
  idx += scenQs.length

  // Phase 6: Summary-based questions
  const summSentences = summary.split(/\.\s+/).filter(s => s.length > 15)
  for (let i = 0; i < Math.min(summSentences.length, 3); i++) {
    allQuestions.push({
      id: makeId(chapterId, idx++),
      chapterId,
      conceptIds,
      type: 'true-false',
      prompt: `True or false: ${summSentences[i]}.`,
      options: [
        { id: 'a', text: 'True', explanation: 'This accurately summarizes the chapter content.' },
        { id: 'b', text: 'False', explanation: '' },
      ],
      correctOptionId: 'a',
      explanation: `This is correct. ${summSentences[i]}.`,
      chapterReference: `Chapter ${chapterId}: Summary`,
    })
  }

  // Phase 7: Fill to 100 with variations and deeper concept questions
  const fillerTemplates = buildFillerQuestions(chapterId, conceptIds, title, lessonBlocks, rng)
  for (const q of fillerTemplates) {
    if (allQuestions.length >= 100) break
    allQuestions.push({ ...q, id: makeId(chapterId, idx++) })
  }

  // If still under 100, duplicate with variations
  const baseCount = allQuestions.length
  while (allQuestions.length < 100) {
    const sourceQ = allQuestions[allQuestions.length % baseCount]
    const variation: QuizQuestion = {
      ...sourceQ,
      id: makeId(chapterId, idx++),
      prompt: `Review question: ${sourceQ.prompt}`,
    }
    allQuestions.push(variation)
  }

  return allQuestions.slice(0, 100)
}

function buildFillerQuestions(
  chapterId: number,
  conceptIds: string[],
  title: string,
  blocks: LessonBlock[],
  _rng: () => number,
): Omit<QuizQuestion, 'id'>[] {
  const ref = `Chapter ${chapterId}: ${title}`
  const questions: Omit<QuizQuestion, 'id'>[] = []

  // Concept understanding: what does concept X mean?
  for (const concept of conceptIds) {
    const readableConcept = concept.replace(/-/g, ' ')
    questions.push({
      chapterId,
      conceptIds: [concept],
      type: 'multiple-choice',
      prompt: `In the context of Chapter ${chapterId}, what does "${readableConcept}" primarily refer to?`,
      options: [
        { id: 'a', text: `A key strategic element discussed in "${title}" that affects decision-making.`, explanation: 'Correct - this concept is central to the chapter.' },
        { id: 'b', text: 'An advanced tournament-only concept.', explanation: 'This concept applies to cash games as taught in the chapter.' },
        { id: 'c', text: 'A mathematical formula that must be memorized.', explanation: 'While math may be involved, the concept is about strategic thinking.' },
        { id: 'd', text: 'A tell-reading technique.', explanation: 'This concept is about strategic decision-making, not tells.' },
      ],
      correctOptionId: 'a',
      explanation: `"${readableConcept}" is a core concept in Chapter ${chapterId}: ${title}.`,
      chapterReference: ref,
    })
  }

  // "What would happen if" questions
  for (const block of blocks) {
    if (block.type === 'mistake') {
      questions.push({
        chapterId,
        conceptIds,
        type: 'best-reasoning',
        prompt: `If a player consistently makes the mistake of "${block.title}", what is the likely long-term result?`,
        options: [
          { id: 'a', text: 'Decreased win rate due to exploitable play.', explanation: 'Correct - persistent mistakes reduce your edge.' },
          { id: 'b', text: 'Increased variance but same win rate.', explanation: 'Mistakes reduce win rate, not just increase variance.' },
          { id: 'c', text: 'No impact since poker is mostly luck.', explanation: 'Skilled play matters significantly in the long run.' },
          { id: 'd', text: 'Other players will not notice or adjust.', explanation: 'Observant opponents will exploit consistent mistakes.' },
        ],
        correctOptionId: 'a',
        explanation: `"${block.title}" is a leak that costs money over time. ${truncateSentence(block.content)}`,
        chapterReference: ref,
      })
    }

    if (block.type === 'principle') {
      questions.push({
        chapterId,
        conceptIds,
        type: 'best-reasoning',
        prompt: `Why is the principle "${block.title}" important for a winning strategy?`,
        options: [
          { id: 'a', text: 'It directly impacts expected value in common spots.', explanation: 'Correct - principles are about maximizing EV.' },
          { id: 'b', text: 'It only matters in theory, not in practice.', explanation: 'Good theory translates directly to better results.' },
          { id: 'c', text: 'It helps you look like a professional at the table.', explanation: 'The value is strategic, not about appearance.' },
          { id: 'd', text: 'It guarantees winning every session.', explanation: 'No principle guarantees session results due to variance.' },
        ],
        correctOptionId: 'a',
        explanation: `"${block.title}" matters because: ${truncateSentence(block.content)}`,
        chapterReference: ref,
      })
    }

    // When to apply vs when not to apply
    questions.push({
      chapterId,
      conceptIds,
      type: 'multiple-choice',
      prompt: `Regarding "${block.title}", when should you adjust this approach?`,
      options: [
        { id: 'a', text: 'When opponent tendencies or game conditions change from the default assumptions.', explanation: 'Correct - adapting to specific conditions is key.' },
        { id: 'b', text: 'Never - always apply it rigidly.', explanation: 'Poker requires adapting to specific situations.' },
        { id: 'c', text: 'Only when losing.', explanation: 'Adjustments should be based on strategy, not results.' },
        { id: 'd', text: 'Only in the first hour of a session.', explanation: 'Session timing is not a relevant factor.' },
      ],
      correctOptionId: 'a',
      explanation: 'All poker strategies should be adjusted based on opponent reads and game conditions.',
      chapterReference: ref,
    })
  }

  // Application questions
  questions.push({
    chapterId,
    conceptIds,
    type: 'scenario',
    scenario: `You are studying Chapter ${chapterId}: ${title} and want to apply its concepts in your next session.`,
    prompt: 'What is the most effective way to implement these concepts?',
    options: [
      { id: 'a', text: 'Focus on one concept at a time and review hands where it applied post-session.', explanation: 'Correct - deliberate practice with review is most effective.' },
      { id: 'b', text: 'Try to apply every concept simultaneously.', explanation: 'This leads to information overload and poor execution.' },
      { id: 'c', text: 'Only apply concepts when you feel confident.', explanation: 'Concepts should be applied consistently, not based on feelings.' },
      { id: 'd', text: 'Wait until you have memorized the entire chapter before playing.', explanation: 'Learning through play is part of the process.' },
    ],
    correctOptionId: 'a',
    explanation: 'The best approach to implementing new concepts is focused, deliberate practice with post-session review.',
    chapterReference: ref,
  })

  return questions
}
