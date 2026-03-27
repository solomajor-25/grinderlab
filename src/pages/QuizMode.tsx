import { useParams, Link } from 'react-router-dom'
import { useState, useCallback, useMemo } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react'
import { getQuizzesByChapter } from '@/data/quizzes'
import { saveChapterProgress } from '@/lib/storage'
import { cn } from '@/lib/utils'
import type { QuizQuestion, QuizOption } from '@/types'

// ---------------------------------------------------------------------------
// QuizMode — Interactive quiz page for each chapter
// ---------------------------------------------------------------------------

export function QuizMode() {
  const { chapterId: chapterParam } = useParams()
  const chapterId = Number(chapterParam)

  const questions = useMemo(() => getQuizzesByChapter(chapterId), [chapterId])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({})
  const [finished, setFinished] = useState(false)

  const question = questions[currentIdx] as QuizQuestion | undefined
  const totalQuestions = questions.length
  const answeredCount = Object.keys(answers).length
  const correctCount = Object.values(answers).filter(a => a.correct).length

  // Select an answer — reveals correct/incorrect immediately
  const handleSelect = useCallback((optionId: string) => {
    if (revealed) return // already answered this question
    setSelectedId(optionId)
    setRevealed(true)
    const isCorrect = optionId === question?.correctOptionId
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: { selected: optionId, correct: isCorrect },
    }))
  }, [revealed, currentIdx, question])

  // Navigate to next question
  const handleNext = useCallback(() => {
    if (currentIdx < totalQuestions - 1) {
      const nextIdx = currentIdx + 1
      setCurrentIdx(nextIdx)
      // Restore previous answer if revisiting
      const prev = answers[nextIdx]
      if (prev) {
        setSelectedId(prev.selected)
        setRevealed(true)
      } else {
        setSelectedId(null)
        setRevealed(false)
      }
    } else if (answeredCount === totalQuestions) {
      // All answered — show results
      setFinished(true)
      saveChapterProgress(chapterId, {
        quizScore: correctCount,
        quizTotal: totalQuestions,
      })
    }
  }, [currentIdx, totalQuestions, answers, answeredCount, correctCount, chapterId])

  // Navigate to previous question
  const handlePrev = useCallback(() => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1
      setCurrentIdx(prevIdx)
      const prev = answers[prevIdx]
      if (prev) {
        setSelectedId(prev.selected)
        setRevealed(true)
      } else {
        setSelectedId(null)
        setRevealed(false)
      }
    }
  }, [currentIdx, answers])

  // Restart quiz
  const handleRestart = useCallback(() => {
    setCurrentIdx(0)
    setSelectedId(null)
    setRevealed(false)
    setAnswers({})
    setFinished(false)
  }, [])

  // No questions available
  if (!questions.length) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <h2 className="text-h2 font-bold mb-2">No Quiz Available</h2>
        <p className="text-body text-ink/60 mb-6">
          Chapter {chapterId} quiz content is being developed.
        </p>
        <Link to={`/chapters/${chapterId}`} className="btn-primary">
          Back to Chapter
        </Link>
      </div>
    )
  }

  // Results screen
  if (finished) {
    const pct = Math.round((correctCount / totalQuestions) * 100)
    const grade =
      pct >= 90 ? 'Excellent' : pct >= 70 ? 'Good' : pct >= 50 ? 'Needs Work' : 'Review Chapter'
    const gradeColor =
      pct >= 90
        ? 'text-green-400'
        : pct >= 70
          ? 'text-forest'
          : pct >= 50
            ? 'text-amber-400'
            : 'text-red-400'

    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-in">
        <div className="bg-slate-card border border-felt/30 rounded-lg p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-400" />
          <h2 className="text-h2 font-bold mb-2">Quiz Complete</h2>
          <p className="text-body text-ink/60 mb-6">Chapter {chapterId}</p>

          <div className="text-5xl font-bold mb-2">
            {correctCount}/{totalQuestions}
          </div>
          <div className={cn('text-xl font-semibold mb-6', gradeColor)}>
            {pct}% — {grade}
          </div>

          {/* Question breakdown */}
          <div className="grid grid-cols-5 gap-2 mb-8 max-w-xs mx-auto">
            {questions.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-8 h-8 rounded flex items-center justify-center text-xs font-bold',
                  answers[i]?.correct
                    ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40',
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={handleRestart} className="btn-secondary inline-flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Retry Quiz
            </button>
            <Link to={`/chapters/${chapterId}`} className="btn-primary inline-flex items-center gap-2">
              Back to Chapter
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!question) return null

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to={`/chapters/${chapterId}`}
          className="text-ink/50 hover:text-ink transition-colors inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Chapter
        </Link>
        <span className="text-ink/50 text-sm font-mono">
          {currentIdx + 1} / {totalQuestions}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-felt/30 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-forest rounded-full transition-all duration-300"
          style={{ width: `${((answeredCount) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="bg-slate-card border border-felt/30 rounded-lg p-6 mb-6">
        <p className="text-xs text-ink/40 uppercase tracking-wider mb-3 font-mono">
          {question.chapterReference}
        </p>
        <h3 className="text-lg font-semibold leading-relaxed mb-6">
          {question.prompt}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt: QuizOption) => {
            const isSelected = selectedId === opt.id
            const isCorrect = opt.id === question.correctOptionId
            const showCorrect = revealed && isCorrect
            const showWrong = revealed && isSelected && !isCorrect

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={revealed}
                className={cn(
                  'w-full text-left rounded-lg border p-4 transition-all',
                  !revealed && 'hover:border-forest/60 hover:bg-forest/5 cursor-pointer',
                  !revealed && 'border-felt/30 bg-slate-card/60',
                  showCorrect && 'border-green-500/60 bg-green-500/10',
                  showWrong && 'border-red-500/60 bg-red-500/10',
                  revealed && !showCorrect && !showWrong && 'border-felt/20 opacity-50',
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Letter badge */}
                  <span
                    className={cn(
                      'shrink-0 w-7 h-7 rounded flex items-center justify-center text-xs font-bold uppercase',
                      showCorrect && 'bg-green-500/30 text-green-400',
                      showWrong && 'bg-red-500/30 text-red-400',
                      !showCorrect && !showWrong && 'bg-felt/20 text-ink/60',
                    )}
                  >
                    {opt.id}
                  </span>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn('font-medium', showCorrect && 'text-green-400', showWrong && 'text-red-400')}>
                        {opt.text}
                      </span>
                      {showCorrect && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
                      {showWrong && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                    </div>

                    {/* Explanation — shown after reveal */}
                    {revealed && (
                      <p className={cn(
                        'text-sm mt-2 leading-relaxed',
                        showCorrect ? 'text-green-400/80' : showWrong ? 'text-red-400/70' : 'text-ink/40',
                      )}>
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Overall explanation after reveal */}
        {revealed && (
          <div className="mt-6 pt-4 border-t border-felt/20">
            <p className="text-sm text-ink/60 leading-relaxed">
              <span className="font-semibold text-ink/80">Explanation: </span>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className={cn(
            'btn-secondary inline-flex items-center gap-2 text-sm',
            currentIdx === 0 && 'opacity-30 cursor-not-allowed',
          )}
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!revealed}
          className={cn(
            'btn-primary inline-flex items-center gap-2 text-sm',
            !revealed && 'opacity-30 cursor-not-allowed',
          )}
        >
          {currentIdx === totalQuestions - 1 && answeredCount === totalQuestions
            ? 'See Results'
            : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
