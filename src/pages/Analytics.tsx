import { Link } from 'react-router-dom'
import { BarChart3, Target, TrendingUp, BookOpen } from 'lucide-react'
import { getAttempts, getProgress } from '@/lib/storage'
import { concepts } from '@/data/concepts'
import { ProgressBar } from '@/components/ui/ProgressBar'

const chapterNames: Record<number, string> = {
  2: 'Opening the Pot', 3: 'When Someone Limps', 4: 'C-Betting',
  5: 'Value Betting', 6: 'Calling Opens', 7: 'Facing Bets: End of Action',
  8: 'Facing Bets: Open Action', 9: 'Combos and Blockers', 10: '3-Betting',
  11: 'Facing 3-Bets', 12: 'Bluffing Turn and River',
  13: '3-Bet Pots and Balance', 14: 'Stack Depth',
}

export function Analytics() {
  const attempts = getAttempts()
  const progress = getProgress()
  // Overall stats
  const totalAttempts = attempts.length
  const correctAttempts = attempts.filter(a => a.correct).length
  const overallAccuracy = totalAttempts > 0 ? correctAttempts / totalAttempts : 0

  // Attempts by type
  const quizAttempts = attempts.filter(a => a.type === 'quiz')
  const practiceAttempts = attempts.filter(a => a.type === 'practice')
  const preflopAttempts = attempts.filter(a => a.type === 'preflop')

  const quizAccuracy = quizAttempts.length > 0
    ? quizAttempts.filter(a => a.correct).length / quizAttempts.length : 0
  const practiceAccuracy = practiceAttempts.length > 0
    ? practiceAttempts.filter(a => a.correct).length / practiceAttempts.length : 0
  const preflopAccuracy = preflopAttempts.length > 0
    ? preflopAttempts.filter(a => a.correct).length / preflopAttempts.length : 0

  // Per-chapter accuracy
  const chapterAccuracy = Object.keys(chapterNames).map(id => {
    const chId = Number(id)
    const chAttempts = attempts.filter(a => a.chapterId === chId)
    const correct = chAttempts.filter(a => a.correct).length
    const total = chAttempts.length
    return { id: chId, name: chapterNames[chId], correct, total, accuracy: total > 0 ? correct / total : -1 }
  })

  // Top weak concepts (lowest accuracy with >0 attempts)
  const conceptStats = concepts.map(c => {
    const related = attempts.filter(a => a.conceptIds.includes(c.id))
    const total = related.length
    const correct = related.filter(a => a.correct).length
    return { ...c, total, correct, accuracy: total > 0 ? correct / total : -1 }
  }).filter(c => c.total > 0).sort((a, b) => a.accuracy - b.accuracy)

  const weakConcepts = conceptStats.slice(0, 5)
  const strongConcepts = [...conceptStats].sort((a, b) => b.accuracy - a.accuracy).slice(0, 5)

  // Chapters completed
  const chaptersReviewed = Object.values(progress).filter(p => p.reviewDone).length
  const totalChapters = 13

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">Analytics</h1>
        <p className="text-body-lg text-ink/60 mt-1">
          Track your progress and identify areas for improvement.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <Target className="w-6 h-6 text-forest mx-auto mb-2" />
          <p className="text-h2 font-bold">{Math.round(overallAccuracy * 100)}%</p>
          <p className="text-micro text-ink/40">Overall Accuracy</p>
          <p className="text-micro text-ink/30 mt-1">{correctAttempts}/{totalAttempts} correct</p>
        </div>
        <div className="card text-center">
          <BookOpen className="w-6 h-6 text-success mx-auto mb-2" />
          <p className="text-h2 font-bold">{chaptersReviewed}/{totalChapters}</p>
          <p className="text-micro text-ink/40">Chapters Reviewed</p>
          <p className="text-micro text-ink/30 mt-1">{Math.round(chaptersReviewed / totalChapters * 100)}% complete</p>
        </div>
      </div>

      {/* Accuracy by Mode */}
      <div className="card">
        <h2 className="text-h3 font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-forest" />
          Accuracy by Mode
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-body mb-1">
              <span>Quiz</span>
              <span className="text-ink/50">{quizAttempts.filter(a => a.correct).length}/{quizAttempts.length}</span>
            </div>
            <ProgressBar value={Math.round(quizAccuracy * 100)} color={quizAccuracy >= 0.8 ? 'success' : 'forest'} />
          </div>
          <div>
            <div className="flex justify-between text-body mb-1">
              <span>Practice Hands</span>
              <span className="text-ink/50">{practiceAttempts.filter(a => a.correct).length}/{practiceAttempts.length}</span>
            </div>
            <ProgressBar value={Math.round(practiceAccuracy * 100)} color={practiceAccuracy >= 0.8 ? 'success' : 'forest'} />
          </div>
          <div>
            <div className="flex justify-between text-body mb-1">
              <span>Preflop Trainer</span>
              <span className="text-ink/50">{preflopAttempts.filter(a => a.correct).length}/{preflopAttempts.length}</span>
            </div>
            <ProgressBar value={Math.round(preflopAccuracy * 100)} color={preflopAccuracy >= 0.8 ? 'success' : 'forest'} />
          </div>
        </div>
      </div>

      {/* Chapter Accuracy */}
      <div className="card">
        <h2 className="text-h3 font-semibold mb-4">Accuracy by Chapter</h2>
        <div className="space-y-3">
          {chapterAccuracy.map(ch => (
            <div key={ch.id} className="flex items-center gap-3">
              <Link
                to={`/chapters/${ch.id}`}
                className="text-body w-48 truncate hover:text-forest transition-colors shrink-0"
              >
                Ch {ch.id}: {ch.name}
              </Link>
              <div className="flex-1">
                {ch.total > 0 ? (
                  <ProgressBar
                    value={Math.round(ch.accuracy * 100)}
                    color={ch.accuracy >= 0.8 ? 'success' : 'forest'}
                    showLabel
                  />
                ) : (
                  <span className="text-micro text-ink/30">No attempts</span>
                )}
              </div>
              <span className="text-micro text-ink/40 w-16 text-right shrink-0">
                {ch.total > 0 ? `${ch.correct}/${ch.total}` : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weak and Strong Concepts */}
      <div className="grid md:grid-cols-2 gap-4">
        {weakConcepts.length > 0 && (
          <div className="card">
            <h2 className="text-h3 font-semibold mb-4 text-error">Weakest Concepts</h2>
            <div className="space-y-3">
              {weakConcepts.map(c => (
                <div key={c.id} className="flex items-center justify-between py-1">
                  <div className="min-w-0">
                    <p className="text-body font-medium truncate">{c.name}</p>
                    <p className="text-micro text-ink/40">{c.correct}/{c.total} correct</p>
                  </div>
                  <span className="text-h4 font-bold text-error shrink-0 ml-3">
                    {Math.round(c.accuracy * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {strongConcepts.length > 0 && (
          <div className="card">
            <h2 className="text-h3 font-semibold mb-4 text-success">Strongest Concepts</h2>
            <div className="space-y-3">
              {strongConcepts.map(c => (
                <div key={c.id} className="flex items-center justify-between py-1">
                  <div className="min-w-0">
                    <p className="text-body font-medium truncate">{c.name}</p>
                    <p className="text-micro text-ink/40">{c.correct}/{c.total} correct</p>
                  </div>
                  <span className="text-h4 font-bold text-success shrink-0 ml-3">
                    {Math.round(c.accuracy * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {totalAttempts === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-ink/20 mx-auto mb-4" />
          <h3 className="text-h3 font-semibold mb-2">No data yet</h3>
          <p className="text-body text-ink/50 mb-4">
            Complete quizzes, practice hands, or preflop drills to see your analytics.
          </p>
          <Link to="/chapters" className="btn-primary">Start Studying</Link>
        </div>
      )}
    </div>
  )
}
