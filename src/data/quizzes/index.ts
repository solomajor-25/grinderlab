import type { QuizQuestion } from '@/types'
import { chapter2Questions } from './chapter-2'
import { chapter3Questions } from './chapter-3'
import { chapter4Questions } from './chapter-4'
import { chapter5Questions } from './chapter-5'
import { chapter6Questions } from './chapter-6'
import { chapter7Questions } from './chapter-7'
import { chapter8Questions } from './chapter-8'
import { chapter9Questions } from './chapter-9'
import { chapter10Questions } from './chapter-10'
import { chapter11Questions } from './chapter-11'
import { chapter12Questions } from './chapter-12'
import { chapter13Questions } from './chapter-13'
import { chapter14Questions } from './chapter-14'

export const quizQuestions: QuizQuestion[] = [
  ...chapter2Questions,
  ...chapter3Questions,
  ...chapter4Questions,
  ...chapter5Questions,
  ...chapter6Questions,
  ...chapter7Questions,
  ...chapter8Questions,
  ...chapter9Questions,
  ...chapter10Questions,
  ...chapter11Questions,
  ...chapter12Questions,
  ...chapter13Questions,
  ...chapter14Questions,
]

export function getQuizzesByChapter(chapterId: number): QuizQuestion[] {
  return quizQuestions.filter(q => q.chapterId === chapterId)
}
