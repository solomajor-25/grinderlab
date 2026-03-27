import type {
  Attempt,
  Bookmark,
  ChapterProgress,
  PersonalNote,
  StudyStreak,
  UserPreferences,
  VillainPreset,
} from '@/types'
import { generateId, getToday } from './utils'

const KEYS = {
  preferences: 'grinderlab_preferences',
  progress: 'grinderlab_progress',
  attempts: 'grinderlab_attempts',
  notes: 'grinderlab_notes',
  bookmarks: 'grinderlab_bookmarks',
  streaks: 'grinderlab_streaks',
  audioProgress: 'grinderlab_audio_progress',
} as const

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function set(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

// Preferences
const defaultPreferences: UserPreferences = {
  theme: 'dark',
  studyMode: 'chapter',
  favoriteChapters: [],
  villainPresets: [],
}

export function getPreferences(): UserPreferences {
  return get(KEYS.preferences, defaultPreferences)
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  const current = getPreferences()
  set(KEYS.preferences, { ...current, ...prefs })
}

// Progress
export function getProgress(): Record<number, ChapterProgress> {
  return get(KEYS.progress, {})
}

export function getChapterProgress(chapterId: number): ChapterProgress {
  const progress = getProgress()
  return progress[chapterId] || {
    completion: 0,
    reviewDone: false,
    quizScore: 0,
    quizTotal: 0,
    practiceScore: 0,
    practiceTotal: 0,
    confidence: 'low' as const,
  }
}

export function saveChapterProgress(chapterId: number, update: Partial<ChapterProgress>): void {
  const progress = getProgress()
  const current = progress[chapterId] || {
    completion: 0,
    reviewDone: false,
    quizScore: 0,
    quizTotal: 0,
    practiceScore: 0,
    practiceTotal: 0,
    confidence: 'low' as const,
  }
  progress[chapterId] = { ...current, ...update, lastStudied: Date.now() }
  set(KEYS.progress, progress)
}

// Attempts
export function getAttempts(): Attempt[] {
  return get(KEYS.attempts, [])
}

export function saveAttempt(attempt: Omit<Attempt, 'id' | 'timestamp'>): Attempt {
  const attempts = getAttempts()
  const newAttempt: Attempt = {
    ...attempt,
    id: generateId(),
    timestamp: Date.now(),
  }
  attempts.push(newAttempt)
  set(KEYS.attempts, attempts)
  updateStreak()
  return newAttempt
}

export function getAttemptsByChapter(chapterId: number): Attempt[] {
  return getAttempts().filter(a => a.chapterId === chapterId)
}

export function getAttemptsByConcept(conceptId: string): Attempt[] {
  return getAttempts().filter(a => a.conceptIds.includes(conceptId))
}

export function getRecentAttempts(count: number = 50): Attempt[] {
  return getAttempts().slice(-count)
}

// Notes
export function getNotes(): PersonalNote[] {
  return get(KEYS.notes, [])
}

export function getNotesByChapter(chapterId: number): PersonalNote[] {
  return getNotes().filter(n => n.chapterId === chapterId)
}

export function saveNote(chapterId: number, content: string, noteId?: string): PersonalNote {
  const notes = getNotes()
  if (noteId) {
    const idx = notes.findIndex(n => n.id === noteId)
    if (idx >= 0) {
      notes[idx] = { ...notes[idx], content, updatedAt: Date.now() }
      set(KEYS.notes, notes)
      return notes[idx]
    }
  }
  const note: PersonalNote = {
    id: generateId(),
    chapterId,
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  notes.push(note)
  set(KEYS.notes, notes)
  return note
}

export function deleteNote(noteId: string): void {
  const notes = getNotes().filter(n => n.id !== noteId)
  set(KEYS.notes, notes)
}

// Bookmarks
export function getBookmarks(): Bookmark[] {
  return get(KEYS.bookmarks, [])
}

export function toggleBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): boolean {
  const bookmarks = getBookmarks()
  const existing = bookmarks.findIndex(
    b => b.type === bookmark.type && b.referenceId === bookmark.referenceId
  )
  if (existing >= 0) {
    bookmarks.splice(existing, 1)
    set(KEYS.bookmarks, bookmarks)
    return false
  }
  bookmarks.push({ ...bookmark, id: generateId(), createdAt: Date.now() })
  set(KEYS.bookmarks, bookmarks)
  return true
}

export function isBookmarked(type: string, referenceId: string): boolean {
  return getBookmarks().some(b => b.type === type && b.referenceId === referenceId)
}

// Streaks
export function getStreak(): StudyStreak {
  return get(KEYS.streaks, { currentStreak: 0, longestStreak: 0, lastStudyDate: '' })
}

function updateStreak(): void {
  const streak = getStreak()
  const today = getToday()
  if (streak.lastStudyDate === today) return

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (streak.lastStudyDate === yesterdayStr) {
    streak.currentStreak += 1
  } else {
    streak.currentStreak = 1
  }

  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak
  }
  streak.lastStudyDate = today
  set(KEYS.streaks, streak)
}

// Audio progress
export interface AudioProgress {
  currentTime: number
  duration: number
  percent: number
}

export function getAudioProgress(): Record<number, AudioProgress> {
  return get(KEYS.audioProgress, {})
}

export function getChapterAudioProgress(chapterId: number): AudioProgress | null {
  const all = getAudioProgress()
  return all[chapterId] || null
}

export function saveAudioProgress(chapterId: number, currentTime: number, duration: number): void {
  const all = getAudioProgress()
  const percent = duration > 0 ? Math.round((currentTime / duration) * 100) : 0
  all[chapterId] = { currentTime, duration, percent }
  set(KEYS.audioProgress, all)
}

// Reset
export function resetAllData(): void {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key))
}

// Villain presets
export function getDefaultVillainPresets(): VillainPreset[] {
  return [
    { id: 'nitty', name: 'Nitty Reg', type: 'nitty', vpip: 15, pfr: 12, description: 'Tight player who only enters pots with strong hands. Folds to aggression without premium holdings.' },
    { id: 'reg', name: 'Solid Reg', type: 'reg', vpip: 22, pfr: 18, description: 'Competent regular with balanced ranges. Capable of adjusting to your tendencies.' },
    { id: 'loose-passive', name: 'Loose Passive Fish', type: 'loose-passive', vpip: 45, pfr: 8, description: 'Calls too wide, rarely raises. Stations post-flop. Weak to value betting and isolation.' },
    { id: 'aggro-fish', name: 'Aggro Fish', type: 'aggro-fish', vpip: 40, pfr: 30, description: 'Plays too many hands aggressively. Overbluffs and overvalues marginal hands.' },
  ]
}
