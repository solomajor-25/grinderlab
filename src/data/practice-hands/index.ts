import type { PracticeHandScenario } from '@/types'
import { chapter2Hands } from './chapter-2'
import { chapter3Hands } from './chapter-3'
import { chapter4Hands } from './chapter-4'
import { chapter5Hands } from './chapter-5'
import { chapter6Hands } from './chapter-6'
import { chapter7Hands } from './chapter-7'
import { chapter8Hands } from './chapter-8'
import { chapter9Hands } from './chapter-9'
import { chapter10Hands } from './chapter-10'
import { chapter11Hands } from './chapter-11'
import { chapter12Hands } from './chapter-12'
import { chapter13Hands } from './chapter-13'
import { chapter14Hands } from './chapter-14'

export const practiceHands: PracticeHandScenario[] = [
  ...chapter2Hands,
  ...chapter3Hands,
  ...chapter4Hands,
  ...chapter5Hands,
  ...chapter6Hands,
  ...chapter7Hands,
  ...chapter8Hands,
  ...chapter9Hands,
  ...chapter10Hands,
  ...chapter11Hands,
  ...chapter12Hands,
  ...chapter13Hands,
  ...chapter14Hands,
]

export function getPracticeHandsByChapter(chapterId: number): PracticeHandScenario[] {
  return practiceHands.filter(h => h.chapterId === chapterId)
}

export function getPracticeHandsByDifficulty(difficulty: PracticeHandScenario['difficulty']): PracticeHandScenario[] {
  return practiceHands.filter(h => h.difficulty === difficulty)
}
