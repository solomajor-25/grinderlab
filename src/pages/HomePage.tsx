import { Link } from 'react-router-dom'
import { BookOpen, Spade, TrendingUp } from 'lucide-react'
import { getPreferences, getProgress, getAttempts } from '@/lib/storage'
import { ProgressBar } from '@/components/ui/ProgressBar'

export function HomePage() {
  const prefs = getPreferences()
  const progress = getProgress()
  const attempts = getAttempts()

  const lastChapter = prefs.lastChapterId || 2
  const recentAttempts = attempts.slice(-20)
  const recentCorrect = recentAttempts.filter(a => a.correct).length
  const recentAccuracy = recentAttempts.length > 0 ? recentCorrect / recentAttempts.length : 0

  // Find weakest concepts
  const conceptMisses: Record<string, number> = {}
  attempts.filter(a => !a.correct).forEach(a => {
    a.conceptIds.forEach(c => {
      conceptMisses[c] = (conceptMisses[c] || 0) + 1
    })
  })
  const weakConcepts = Object.entries(conceptMisses)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  // Chapter progress summary
  const chapterIds = Array.from({ length: 13 }, (_, i) => i + 2)
  const totalCompletion = chapterIds.reduce((sum, id) => {
    return sum + (progress[id]?.completion || 0)
  }, 0) / chapterIds.length

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold tracking-tight">Your Study Lab</h1>
        <p className="text-body-lg text-ink/60 dark:text-ink/60 mt-1">
          Build stronger decisions one spot at a time.
        </p>
      </div>

      {/* Primary CTAs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to={`/chapters/${lastChapter}`} className="card-hover group p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-forest/15 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-forest" />
            </div>
            <div>
              <h3 className="text-h4 font-semibold">Continue Chapter</h3>
              <p className="text-caption text-ink/50">Chapter {lastChapter}</p>
            </div>
          </div>
          <p className="text-body text-ink/60 dark:text-ink/60">
            Pick up where you left off in your study path.
          </p>
        </Link>

        <Link to="/preflop" className="card-hover group p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-info/15 flex items-center justify-center">
              <Spade className="w-5 h-5 text-info" />
            </div>
            <div>
              <h3 className="text-h4 font-semibold">Preflop Trainer</h3>
              <p className="text-caption text-ink/50">Positions & Ranges</p>
            </div>
          </div>
          <p className="text-body text-ink/60 dark:text-ink/60">
            Train preflop decisions with structured feedback.
          </p>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-micro text-ink/50 uppercase tracking-wider">Accuracy</span>
          </div>
          <p className="text-h2 font-bold">
            {recentAttempts.length > 0 ? `${Math.round(recentAccuracy * 100)}%` : '---'}
          </p>
          <p className="text-micro text-ink/40">Last 20 attempts</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-forest" />
            <span className="text-micro text-ink/50 uppercase tracking-wider">Progress</span>
          </div>
          <p className="text-h2 font-bold">{Math.round(totalCompletion)}%</p>
          <p className="text-micro text-ink/40">Overall completion</p>
        </div>
      </div>

      {/* Chapter Progress Overview */}
      <div className="card">
        <h2 className="text-h3 font-semibold mb-4">Chapter Progress</h2>
        <div className="space-y-3">
          {chapterIds.map(id => {
            const p = progress[id]
            return (
              <Link key={id} to={`/chapters/${id}`} className="flex items-center gap-3 group">
                <span className="text-caption text-ink/40 w-6 text-right">{id}</span>
                <ProgressBar value={p?.completion || 0} className="flex-1" />
                <span className="text-micro text-ink/40 w-10 text-right">
                  {p?.completion ? `${Math.round(p.completion)}%` : '---'}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Weak Spots */}
      {weakConcepts.length > 0 && (
        <div className="card">
          <h2 className="text-h3 font-semibold mb-4">Recent Weak Spots</h2>
          <div className="space-y-2">
            {weakConcepts.map(([concept, count]) => (
              <Link
                key={concept}
                to="/concepts"
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-card dark:hover:bg-slate-card transition-colors"
              >
                <span className="text-body capitalize">{concept.replace(/-/g, ' ')}</span>
                <span className="badge-error">{count} miss{count > 1 ? 'es' : ''}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Motivational footer */}
      <p className="text-caption text-ink/30 text-center py-4">
        You're improving where it matters: repeatable decisions.
      </p>
    </div>
  )
}
