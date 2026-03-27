export type Suit = 's' | 'h' | 'd' | 'c'
export type Rank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'

export interface Card {
  rank: Rank
  suit: Suit
}

export type Position = 'UTG' | 'HJ' | 'CO' | 'BU' | 'SB' | 'BB'

export type VillainType = 'nitty' | 'reg' | 'loose-passive' | 'aggro-fish' | 'custom'

export interface VillainPreset {
  id: string
  name: string
  type: VillainType
  vpip: number
  pfr: number
  description: string
}

export type ConceptId = string

export interface Concept {
  id: ConceptId
  name: string
  description: string
  chapterIds: number[]
  category: 'preflop' | 'postflop' | 'general'
}

export interface LessonBlock {
  type: 'principle' | 'mistake' | 'heuristic' | 'factor'
  title: string
  content: string
}

export interface Chapter {
  id: number
  title: string
  subtitle: string
  sections: string[]
  lessonBlocks: LessonBlock[]
  conceptIds: ConceptId[]
  summary: string
}

export type QuizType = 'multiple-choice' | 'true-false' | 'best-reasoning' | 'scenario'

export interface QuizOption {
  id: string
  text: string
  explanation: string
}

export interface QuizQuestion {
  id: string
  chapterId: number
  conceptIds: ConceptId[]
  type: QuizType
  prompt: string
  scenario?: string
  options: QuizOption[]
  correctOptionId: string
  explanation: string
  chapterReference: string
}

export type ActionType = 'fold' | 'check' | 'call' | 'bet' | 'raise'

export type Difficulty = 'fundamentals' | 'standard' | 'exploitative' | 'advanced'

export interface PracticeHandScenario {
  id: string
  chapterId: number
  conceptIds: ConceptId[]
  difficulty: Difficulty
  title: string
  description: string
  heroPosition: Position
  heroCards: [Card, Card]
  villainPosition: Position
  villainType: VillainType
  board: Card[]
  potSize: number
  heroStack: number
  villainStack: number
  street: 'preflop' | 'flop' | 'turn' | 'river'
  priorAction: string
  correctAction: ActionType
  correctSizing?: number
  alternativeActions?: { action: ActionType; quality: 'acceptable' | 'suboptimal' | 'bad' }[]
  explanation: string
  factors: string[]
  replayVariant?: {
    description: string
    change: string
  }
}

export type ActionClass = 'open' | 'marginal-open' | 'exploit-open' | 'fold' | 'call' | '3bet-value' | '3bet-bluff'

export interface PreflopSpot {
  hand: string
  position: Position
  actionClass: ActionClass
  explanation: string
  factors: string[]
}

export interface Attempt {
  id: string
  type: 'quiz' | 'practice' | 'preflop'
  chapterId: number
  conceptIds: ConceptId[]
  correct: boolean
  timestamp: number
  details?: string
}

export interface ChapterProgress {
  completion: number
  reviewDone: boolean
  quizScore: number
  quizTotal: number
  practiceScore: number
  practiceTotal: number
  confidence: 'low' | 'medium' | 'high'
  lastStudied?: number
}

export interface PersonalNote {
  id: string
  chapterId: number
  content: string
  createdAt: number
  updatedAt: number
}

export interface Bookmark {
  id: string
  type: 'lesson' | 'concept' | 'quiz'
  referenceId: string
  chapterId: number
  label: string
  createdAt: number
}

export interface StudyStreak {
  currentStreak: number
  longestStreak: number
  lastStudyDate: string
}

export interface UserPreferences {
  theme: 'dark' | 'light'
  studyMode: 'chapter' | 'daily' | 'preflop'
  favoriteChapters: number[]
  villainPresets: VillainPreset[]
  lastChapterId?: number
  lastMode?: string
}
