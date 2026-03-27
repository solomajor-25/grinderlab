import { useParams, Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { ArrowRight, BookOpen, X } from 'lucide-react'
import { HandDisplay } from '@/components/ui/PokerCard'
import { saveAttempt, saveChapterProgress, getChapterProgress } from '@/lib/storage'
import { getPracticeHandsByChapter } from '@/data/practice-hands'
import type { ActionType, PracticeHandScenario } from '@/types'

const actionLabels: Record<ActionType, string> = {
  fold: 'Fold',
  check: 'Check',
  call: 'Call',
  bet: 'Bet',
  raise: 'Raise',
}

const actionColors: Record<ActionType, string> = {
  fold: 'bg-error/40 text-white border-error hover:bg-error/60',
  check: 'bg-info/40 text-white border-info hover:bg-info/60',
  call: 'bg-success/40 text-white border-success hover:bg-success/60',
  bet: 'bg-info/60 text-white border-info font-bold hover:bg-info/80',
  raise: 'bg-info/40 text-white border-info font-bold hover:bg-info/60',
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function PracticeHands() {
  const { chapterId: chapterParam } = useParams()
  const chapterId = Number(chapterParam)

  const allHands = useMemo(() => getPracticeHandsByChapter(chapterId), [chapterId])

  const [hands, setHands] = useState<PracticeHandScenario[]>(() => shuffle(allHands))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [chosenAction, setChosenAction] = useState<ActionType | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)

  // Wrap around to keep going indefinitely
  const hand = hands[currentIdx % hands.length]

  if (allHands.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <h2 className="text-h2 font-bold mb-2">No practice hands yet</h2>
        <p className="text-body text-ink/60 mb-4">Practice hand scenarios for chapter {chapterId} are being prepared.</p>
        <Link to={`/chapters/${chapterId}`} className="btn-primary">Back to Chapter</Link>
      </div>
    )
  }

  const availableActions: ActionType[] = hand.street === 'preflop'
    ? ['fold', 'call', 'raise']
    : ['fold', 'check', 'call', 'bet', 'raise']

  const handleActionClick = (action: ActionType) => {
    if (isRevealed) return
    setChosenAction(action)
    setIsRevealed(true)
    const correct = action === hand.correctAction
    if (correct) setScore(s => s + 1)
    setTotalAnswered(t => t + 1)
    saveAttempt({
      type: 'practice',
      chapterId,
      conceptIds: hand.conceptIds,
      correct,
      details: hand.id,
    })
    const progress = getChapterProgress(chapterId)
    saveChapterProgress(chapterId, {
      practiceScore: (progress.practiceScore || 0) + (correct ? 1 : 0),
      practiceTotal: (progress.practiceTotal || 0) + 1,
      completion: Math.max(progress.completion, 75),
    })
  }

  const handleNext = () => {
    const nextIdx = currentIdx + 1
    // Reshuffle when we've gone through the entire pool
    if (nextIdx >= hands.length) {
      setHands(shuffle(allHands))
      setCurrentIdx(0)
    } else {
      setCurrentIdx(nextIdx)
    }
    setChosenAction(null)
    setIsRevealed(false)
  }

  const isCorrect = chosenAction === hand.correctAction

  return (
    <div className="max-w-3xl mx-auto space-y-3 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-caption text-ink/40">Chapter {chapterId}</p>
          <h1 className="text-h3 font-bold">Hand {currentIdx + 1}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-forest text-xs">{score}/{totalAnswered}</span>
          <Link
            to={`/chapters/${chapterId}`}
            className="btn-ghost text-xs inline-flex items-center gap-1 px-2 py-1"
          >
            <X className="w-3 h-3" /> Finish
          </Link>
        </div>
      </div>

      {/* Hand Context Card — everything in one card */}
      <div className="card space-y-3 !p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-body font-semibold leading-tight">{hand.title}</h3>
          <span className="badge-info capitalize text-[10px] px-1.5 py-0.5">{hand.difficulty}</span>
        </div>

        <p className="text-caption text-ink/70">{hand.description}</p>

        {/* Hand Info Grid — compact */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-slate-card rounded-lg p-2 text-center">
            <p className="text-[10px] text-ink/40 mb-0.5">Hand</p>
            <HandDisplay cards={hand.heroCards} size="md" />
          </div>
          <div className="bg-slate-card rounded-lg p-2 text-center">
            <p className="text-[10px] text-ink/40 mb-0.5">Position</p>
            <p className="text-body font-bold text-forest">{hand.heroPosition}</p>
          </div>
          <div className="bg-slate-card rounded-lg p-2 text-center">
            <p className="text-[10px] text-ink/40 mb-0.5">Pot</p>
            <p className="text-body font-bold">{hand.potSize}bb</p>
          </div>
          <div className="bg-slate-card rounded-lg p-2 text-center">
            <p className="text-[10px] text-ink/40 mb-0.5">Stacks</p>
            <p className="text-body font-bold">{hand.heroStack}bb</p>
          </div>
        </div>

        {/* Board */}
        {hand.board.length > 0 && (
          <div>
            <p className="text-[10px] text-ink/40 mb-1">Board</p>
            <HandDisplay cards={hand.board} size="md" />
          </div>
        )}

        {/* Prior Action + Villain — inline */}
        <div className="flex items-center gap-3 text-caption">
          <span className="bg-info/5 border border-info/20 rounded px-2 py-1 text-info flex-1">{hand.priorAction}</span>
          <span className="text-ink/50 whitespace-nowrap">
            vs {hand.villainPosition} <span className="capitalize">{hand.villainType.replace('-', ' ')}</span>
          </span>
        </div>

        {/* Action Buttons — inline in card */}
        <div>
          <p className="text-[10px] text-ink/40 mb-1.5 font-medium">Your Action</p>
          <div className="flex flex-wrap gap-2">
            {availableActions.map(action => {
              const isChosen = chosenAction === action
              const isCorrectAction = isRevealed && action === hand.correctAction
              let styles = actionColors[action]
              if (isRevealed && isCorrectAction) styles = 'bg-success/30 text-success border-success ring-2 ring-success/50'
              else if (isRevealed && isChosen && !isCorrectAction) styles = 'bg-error/30 text-error border-error ring-2 ring-error/50'
              else if (isRevealed) styles = 'opacity-40 ' + actionColors[action]

              return (
                <button
                  key={action}
                  onClick={() => handleActionClick(action)}
                  disabled={isRevealed}
                  className={`px-5 py-2.5 rounded-lg border-2 font-bold text-sm transition-all ${styles}`}
                >
                  {actionLabels[action]}
                  {hand.correctSizing && action === hand.correctAction && isRevealed && (
                    <span className="text-[10px] ml-1">({hand.correctSizing}bb)</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Feedback — compact */}
      {isRevealed && (
        <div className={`rounded-lg p-3 ${isCorrect ? 'bg-success/5 border border-success/20' : 'bg-error/5 border border-error/20'}`}>
          <p className={`text-sm font-semibold mb-1 ${isCorrect ? 'text-success' : 'text-error'}`}>
            {isCorrect ? 'Correct.' : `Better: ${actionLabels[hand.correctAction]}.`}
          </p>
          <p className="text-caption text-ink/80">{hand.explanation}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {hand.factors.map(f => (
              <span key={f} className="text-[10px] bg-info/10 text-info px-1.5 py-0.5 rounded capitalize">{f.replace(/-/g, ' ')}</span>
            ))}
          </div>
          {hand.replayVariant && (
            <div className="mt-2 text-[11px] text-gold border-t border-gold/10 pt-1.5">
              <span className="font-medium">Replay: </span>{hand.replayVariant.description} — {hand.replayVariant.change}
            </div>
          )}
        </div>
      )}

      {/* Sticky bottom bar */}
      {isRevealed && (
        <div className="fixed bottom-0 left-0 right-0 bg-graphite/95 backdrop-blur border-t border-slate-border p-3 flex justify-between items-center z-50">
          <Link
            to={`/chapters/${chapterId}`}
            className="btn-ghost text-sm inline-flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" /> Finish Practice
          </Link>
          <button onClick={handleNext} className="btn-primary text-sm inline-flex items-center gap-1 px-5 py-2">
            Next Hand <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
