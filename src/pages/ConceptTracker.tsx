import { Link } from 'react-router-dom'
import { Target, TrendingDown, BookOpen, ArrowRight } from 'lucide-react'
import { getAttempts } from '@/lib/storage'
import { concepts } from '@/data/concepts'

export function ConceptTracker() {
  const attempts = getAttempts()

  // Aggregate stats per concept
  const conceptStats = concepts.map(concept => {
    const related = attempts.filter(a => a.conceptIds.includes(concept.id))
    const total = related.length
    const correct = related.filter(a => a.correct).length
    const misses = total - correct
    const accuracy = total > 0 ? correct / total : 0
    const recentMisses = related
      .filter(a => !a.correct && a.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000)
      .length

    return { ...concept, total, correct, misses, accuracy, recentMisses }
  })

  const weakConcepts = [...conceptStats]
    .filter(c => c.total > 0)
    .sort((a, b) => a.accuracy - b.accuracy)

  const recentWeakest = [...conceptStats]
    .filter(c => c.recentMisses > 0)
    .sort((a, b) => b.recentMisses - a.recentMisses)
    .slice(0, 5)

  const practiced = conceptStats.filter(c => c.total > 0)
  const unpracticed = conceptStats.filter(c => c.total === 0)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">Concept Tracker</h1>
        <p className="text-body-lg text-ink/60 mt-1">
          Surface weak spots and turn them into focused drills.
        </p>
      </div>

      {/* Most Missed This Week */}
      {recentWeakest.length > 0 && (
        <div className="card">
          <h2 className="text-h3 font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-error" />
            Most Missed This Week
          </h2>
          <div className="space-y-3">
            {recentWeakest.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-body font-medium">{c.name}</p>
                  <p className="text-caption text-ink/50">{c.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge-error">{c.recentMisses} miss{c.recentMisses > 1 ? 'es' : ''}</span>
                  <Link
                    to={`/chapters/${c.chapterIds[0]}`}
                    className="btn-ghost text-sm inline-flex items-center gap-1"
                  >
                    Review <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Practiced Concepts */}
      {practiced.length > 0 && (
        <div className="card">
          <h2 className="text-h3 font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-forest" />
            Concept Performance
          </h2>
          <div className="space-y-3">
            {weakConcepts.map(c => {
              const pct = Math.round(c.accuracy * 100)
              const color = pct >= 80 ? 'text-success' : pct >= 60 ? 'text-warning' : 'text-error'

              return (
                <div key={c.id} className="flex items-center gap-4 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-body font-medium truncate">{c.name}</p>
                      <span className={`badge ${
                        c.category === 'preflop' ? 'badge-forest' :
                        c.category === 'postflop' ? 'badge-info' : 'badge-gold'
                      }`}>
                        {c.category}
                      </span>
                    </div>
                    <p className="text-caption text-ink/40 truncate">{c.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-h4 font-bold ${color}`}>{pct}%</p>
                    <p className="text-micro text-ink/40">{c.correct}/{c.total}</p>
                  </div>
                  <Link
                    to={`/quiz/${c.chapterIds[0]}`}
                    className="btn-ghost text-sm shrink-0"
                  >
                    Drill
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Unpracticed Concepts */}
      {unpracticed.length > 0 && (
        <div className="card">
          <h2 className="text-h3 font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-ink/40" />
            Not Yet Practiced ({unpracticed.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {unpracticed.map(c => (
              <Link
                key={c.id}
                to={`/chapters/${c.chapterIds[0]}`}
                className="badge bg-slate-card dark:bg-slate-card text-ink/50 hover:text-ink transition-colors cursor-pointer"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {practiced.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-ink/20 mx-auto mb-4" />
          <h3 className="text-h3 font-semibold mb-2">No data yet</h3>
          <p className="text-body text-ink/50 mb-4">
            Start a few quizzes or practice hands and we'll surface the patterns.
          </p>
          <Link to="/chapters" className="btn-primary">Start Studying</Link>
        </div>
      )}
    </div>
  )
}
