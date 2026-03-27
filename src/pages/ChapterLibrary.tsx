import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, HelpCircle, Headphones } from 'lucide-react'
import { getProgress, getAudioProgress } from '@/lib/storage'
import { ProgressBar } from '@/components/ui/ProgressBar'

// Chapter metadata - will be replaced by full data when chapters.ts is loaded
const chapterList = [
  { id: 2, title: 'Opening the Pot', subtitle: 'Positions, starting hands, and ranges' },
  { id: 3, title: 'When Someone Limps', subtitle: 'Isolation, sizing, and limping behind' },
  { id: 4, title: 'C-Betting', subtitle: 'Light c-bet factors and sizing' },
  { id: 5, title: 'Value Betting', subtitle: 'Relative strength, thick and thin value' },
  { id: 6, title: 'Calling Opens', subtitle: 'IP, OOP, and blind vs blind calls' },
  { id: 7, title: 'Facing Bets: End of Action', subtitle: 'Required equity and thought process' },
  { id: 8, title: 'Facing Bets: Open Action', subtitle: 'Defending flop and turn, donk bets' },
  { id: 9, title: 'Combos and Blockers', subtitle: 'Combo counting and blocker effects' },
  { id: 10, title: '3-Betting', subtitle: 'Polar vs linear ranges, squeezing' },
  { id: 11, title: 'Facing 3-Bets', subtitle: 'Flatting, defence ranges, adjustments' },
  { id: 12, title: 'Bluffing Turn and River', subtitle: 'Double barrel, triple barrel, probing' },
  { id: 13, title: '3-Bet Pots and Balance', subtitle: 'Aggressor and defender strategy' },
  { id: 14, title: 'Stack Depth', subtitle: 'Deep and shallow stack adjustments' },
]

const confidenceColors = {
  low: 'text-error',
  medium: 'text-warning',
  high: 'text-success',
}

export function ChapterLibrary() {
  const progress = getProgress()
  const audioProgress = getAudioProgress()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">Chapter Library</h1>
        <p className="text-body-lg text-ink/60 dark:text-ink/60 mt-1">
          Follow the manual's progression. Each chapter builds on the last.
        </p>
      </div>

      <div className="grid gap-4">
        {chapterList.map((ch, idx) => {
          const p = progress[ch.id]
          const isComplete = p && p.completion >= 100

          return (
            <Link
              key={ch.id}
              to={`/chapters/${ch.id}`}
              className="card-hover p-5 flex items-start gap-4 group"
            >
              {/* Chapter number */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                isComplete ? 'bg-success/15' : 'bg-forest/10'
              }`}>
                {isComplete ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <span className="text-h4 font-bold text-forest">{ch.id}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-h4 font-semibold truncate">{ch.title}</h3>
                  {idx === 0 && !p && (
                    <span className="badge-forest">Start here</span>
                  )}
                </div>
                <p className="text-caption text-ink/50 mb-3">{ch.subtitle}</p>

                <div className="flex items-center gap-6">
                  <ProgressBar value={p?.completion || 0} className="flex-1 max-w-[200px]" showLabel />

                  <div className="flex items-center gap-4 text-micro text-ink/40">
                    {audioProgress[ch.id] && (
                      <span className="flex items-center gap-1">
                        <Headphones className="w-3 h-3" /> {audioProgress[ch.id].percent}%
                      </span>
                    )}
                    {p?.reviewDone && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Reviewed
                      </span>
                    )}
                    {p?.quizTotal ? (
                      <span>Quiz: {p.quizScore}/{p.quizTotal}</span>
                    ) : null}
                    {p?.practiceTotal ? (
                      <span>Practice: {p.practiceScore}/{p.practiceTotal}</span>
                    ) : null}
                    {p?.confidence && (
                      <span className={`flex items-center gap-1 ${confidenceColors[p.confidence]}`}>
                        <HelpCircle className="w-3 h-3" />
                        {p.confidence}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
