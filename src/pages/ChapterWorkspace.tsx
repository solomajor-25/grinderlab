import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { BookOpen, HelpCircle, Spade, Bookmark, ChevronRight, CheckCircle, FileText } from 'lucide-react'
import { getChapterProgress, saveChapterProgress, getNotesByChapter, saveNote, deleteNote, savePreferences } from '@/lib/storage'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { AudioPlayer } from '@/components/ui/AudioPlayer'
import { getConceptsByChapter } from '@/data/concepts'

// Inline chapter content for workspace display
const chapterContent: Record<number, {
  title: string
  summary: string
  principles: string[]
  mistakes: string[]
  heuristics: string[]
  factors: string[]
}> = {
  2: {
    title: 'Opening the Pot',
    summary: 'Build default opening ranges for each position, understanding why ranges widen as position improves. The key is thinking in terms of ranges, not individual hands.',
    principles: ['Ranges widen from UTG to BU due to fewer players left to act', 'Rate starting hands by playability, versatility, and nut potential', 'Open to 3bb as a default sizing', 'The SB opens a tighter range than the BU because of being OOP postflop'],
    mistakes: ['Opening too many hands from early position', 'Playing the same range from every position', 'Not adjusting for table dynamics and player types behind', 'Thinking about individual hands instead of ranges'],
    heuristics: ['If unsure, tighten your UTG range and widen your BU range', 'Suited connectors gain value in late position', 'Big offsuit broadway hands play better heads-up from late position', 'When in doubt about a marginal hand UTG, fold it'],
    factors: ['Position relative to remaining players', 'Starting hand quality (GPP, Versatility, Nut Potential)', 'Player types in the blinds', 'Effective stack sizes'],
  },
  3: {
    title: 'When Someone Limps',
    summary: 'Use the ISO Triangle to decide whether to isolate, limp behind, or fold. The three pillars are Frequent Strength, Fold Equity, and Position.',
    principles: ['ISO raise for frequent strength, fold equity, and positional advantage', 'Size isolation raises to 3bb + 1bb per limper', 'Limp behind with speculative hands when pot odds and implied odds are good', 'Position is the tiebreaker for marginal isolation decisions'],
    mistakes: ['Isolating with hands that lack frequent strength', 'Using the same iso-raise size regardless of limpers', 'Never limping behind and missing profitable speculative spots', 'Isolating into multiple limpers without strong hands'],
    heuristics: ['Strong top-pair hands isolate well', 'Small pocket pairs prefer limping behind multiway', 'Suited connectors can limp or iso depending on villain type', 'Against passive fish, isolate wider for value'],
    factors: ['Number of limpers', 'Villain type (passive fish vs reg)', 'Your position relative to the limper', 'Stack depths and implied odds'],
  },
  4: {
    title: 'C-Betting',
    summary: 'Continuation bet based on board texture, equity, fold equity, SDV, number of opponents, future street prospects, and position. Size small on dry boards, larger on wet boards.',
    principles: ['C-bet more on dry textures where villain\'s range misses often', 'Check hands with showdown value that don\'t need protection', 'Size bets smaller on dry boards (1/3 pot), larger on wet boards (2/3-3/4 pot)', 'Check OOP more often as the preflop caller, not the aggressor'],
    mistakes: ['C-betting every flop regardless of texture', 'Betting for value when only better hands call', 'Using the same sizing on every board texture', 'C-betting into multiple opponents without a strong hand'],
    heuristics: ['Dry board + no SDV + heads up = good c-bet spot', 'Wet board + position + equity = bet larger for protection', 'If your hand can\'t beat a call, consider if it needs to bet', 'Multiway pots require tighter c-betting ranges'],
    factors: ['Board texture (dry vs wet)', 'Showdown value of your hand', 'Number of opponents', 'Your equity if called', 'Position', 'Turn and river prospects'],
  },
  5: {
    title: 'Value Betting',
    summary: 'Ask three questions: Is my hand strong relative to their calling range? Do I need to build the pot? Should I slowplay? Then decide on sizing based on hand strength and elasticity.',
    principles: ['Value bet when worse hands call more often than better hands', 'Thick value targets wide calling ranges; thin value targets narrow ones', 'Slowplay only when your hand is invulnerable and the board is dry', 'Size bets according to how elastic the villain\'s calling range is'],
    mistakes: ['Value betting when only better hands continue', 'Missing thin value spots against stations', 'Slowplaying on wet boards where draws can get there', 'Using the same bet size for thin and thick value'],
    heuristics: ['Against fish, lean toward thick value with large sizing', 'Against regs, find thin value spots they underdefend', 'If the board is wet, don\'t slowplay even with sets', 'Required Equity = Risk / (Risk + Reward)'],
    factors: ['Relative hand strength vs calling range', 'Need to build pot vs protection', 'Slowplay criteria: invulnerable hand + dry board', 'Opponent type and tendencies', 'Bet sizing and elasticity'],
  },
  6: {
    title: 'Calling Opens',
    summary: 'Call with hands that have equity against the opener\'s range. Call tighter vs EP openers, looser vs LP. Position, implied odds, and equity realization are key.',
    principles: ['Your hand needs equity against a good portion of their range', 'Call tighter against early position opens, looser against late position', 'In position calls are more profitable due to equity realization', 'Blind vs blind spots are the widest calling situations'],
    mistakes: ['Calling too wide OOP without sufficient equity', 'Not adjusting calling range to opener\'s position', 'Calling with dominated hands like KJo vs UTG open', 'Ignoring implied odds with speculative hands'],
    heuristics: ['Suited connectors and pocket pairs call well IP', 'Big offsuit hands are tighter calls OOP', 'BvB you can defend wider because of pot odds', 'If you can\'t realize your equity OOP, don\'t call'],
    factors: ['Opener\'s position and likely range', 'Your position (IP vs OOP)', 'Pot odds and implied odds', 'Hand playability and equity realization'],
  },
  7: {
    title: 'Facing Bets: End of Action',
    summary: 'Use the two-part thought process: (1) Calculate Required Equity, (2) Determine if you have that equity based on villain\'s value bets, bluffs, and credible representations.',
    principles: ['Required Equity = Call / (Pot + Call)', 'Check if villain value bets worse', 'Check if villain arrives with enough bluffs', 'Check if villain credibly represents better hands'],
    mistakes: ['Calling without calculating required equity', 'Ignoring villain\'s tendencies when evaluating bluff frequency', 'Hero-calling every river bet', 'Not considering what villain represents'],
    heuristics: ['If RE is low (25-30%), you need fewer bluffs in their range to call', 'Fish rarely bluff rivers - fold medium hands', 'Aggro regs bluff enough - call with top of your range', 'If villain\'s bet doesn\'t make sense, lean toward calling'],
    factors: ['Required Equity calculation', 'Villain\'s value betting range', 'Villain\'s bluff frequency', 'How well villain represents strong hands', 'Player type reads'],
  },
  8: {
    title: 'Facing Bets: Open Action',
    summary: 'Evaluate made hands by true equity, outs, vulnerability, and position. Non-made hands choose between chasing (pot odds) and floating (future fold equity).',
    principles: ['Good factors for continuing: true equity, outs when behind, invulnerable SDV, position', 'Bad factors: ghost equity, no outs, vulnerable SDV, out of position', 'Chase draws with sufficient pot odds and implied odds', 'Float with position and future fold equity against weak ranges'],
    mistakes: ['Calling with ghost equity (apparent outs that don\'t help)', 'Floating without position or future fold equity', 'Folding vulnerable hands instead of raising for protection', 'Overvaluing weak draws OOP'],
    heuristics: ['True equity + position = strong continue', 'Ghost equity + OOP = lean toward folding', 'Chase draws multiway, float bluff heads-up', 'Raise with semi-bluffs that have no SDV and good equity'],
    factors: ['True vs ghost equity', 'Outs when behind', 'Showdown value vulnerability', 'Position', 'Pot odds and implied odds', 'Future fold equity'],
  },
  9: {
    title: 'Combos and Blockers',
    summary: 'Count hand combinations to assess range construction. Use blockers to refine your analysis of what opponent can hold.',
    principles: ['Pocket pairs have 6 combos, offsuit hands 12, suited hands 4', 'Blockers reduce opponent\'s combos of specific holdings', 'Holding an Ace reduces AA from 6 to 3, AK from 16 to 12', 'Board cards also block hand combos in opponent\'s range'],
    mistakes: ['Ignoring blocker effects in close decisions', 'Treating all hand combos as equally likely', 'Not accounting for board blockers', 'Overcomplicating simple spots with combo analysis'],
    heuristics: ['When bluff-catching, blockers to villain\'s value range help', 'When bluffing, blockers to villain\'s calling range help', 'Suited hands are 1/3 as likely as offsuit combos', 'Remove combos that conflict with known cards'],
    factors: ['Number of combos for each hand type', 'Cards that block opponent\'s range', 'Board card interactions', 'How blockers shift range analysis'],
  },
  10: {
    title: '3-Betting',
    summary: 'Choose between polar (value + bluffs) and linear (value only) 3-bet ranges based on fold equity. Select bluffs with blockers and board coverage.',
    principles: ['Polar range: 3-bet value hands and selected bluffs, call the middle', 'Linear range: 3-bet your strongest hands, call the rest - no bluffs', 'Use polar when you have fold equity against the opener', 'Use linear when fold equity is low (vs stations, multiway)'],
    mistakes: ['3-bet bluffing against stations who never fold', 'Using a linear range when you have significant fold equity', 'Choosing poor bluff hands without blockers or playability', 'Not adjusting 3-bet range to villain\'s opening position'],
    heuristics: ['Double blockers (AJo, KQo) are fold equity grabbers', 'Suited aces (A5s, A9s) block aces and have good equity when called', 'Suited connectors provide board coverage as 3-bet bluffs', 'Size bigger OOP, smaller IP for 3-bets'],
    factors: ['Fold equity against opener', 'Polar vs linear decision', 'Blocker effects of bluff candidates', 'Position (IP vs OOP)', 'Opponent tendencies'],
  },
  11: {
    title: 'Facing 3-Bets',
    summary: 'Decide between flatting, 4-betting, and folding based on frequent strength, position, versatility, and implied odds.',
    principles: ['Flat with hands that have frequent strength against 3-bet range and position', 'Hands need versatility to navigate complex postflop spots', 'Known postflop weaknesses in villain increase calling value', 'Sufficient implied odds can justify calls with speculative hands'],
    mistakes: ['Flatting OOP with hands that can\'t realize equity', 'Never folding to 3-bets and bleeding chips', '4-betting too light against tight 3-bettors', 'Calling with dominated hands (KJo vs tight 3-bet range)'],
    heuristics: ['Pocket pairs and suited connectors flat well IP', 'AQo and JJ are standard flats against BU/CO 3-bets', 'Fold weak offsuit broadways to 3-bets from tight positions', 'If you can\'t 4-bet or flat profitably, just fold'],
    factors: ['Frequent strength against 3-bet range', 'Position (IP vs OOP)', 'Hand versatility', 'Villain tendencies', 'Implied odds', 'Stack depth'],
  },
  12: {
    title: 'Bluffing Turn and River',
    summary: 'Barrel turns when the card improves your range and you have equity. Triple barrel when river improves range and villain\'s calling range weakens. Use delay c-bets and probes strategically.',
    principles: ['Double barrel when turn card improves your perceived range', 'Triple barrel when river completes draws or threatens villain', 'No showdown value is a prerequisite for multi-street bluffs', 'Delay c-bet when flop c-bet is -EV but turn is profitable'],
    mistakes: ['Barreling without equity as backup', 'Triple barreling against stations', 'Bluffing with hands that have showdown value', 'Not recognizing good delay c-bet opportunities'],
    heuristics: ['Scare cards that hit your range: barrel', 'Against tight regs: barrel more turns and rivers', 'Against fish: only barrel with genuine equity backup', 'Probe when PFR\'s flop check signals weakness'],
    factors: ['Turn/river card improving your range', 'Equity as backup', 'Showdown value', 'Villain type and tendencies', 'River fold equity', 'Board texture evolution'],
  },
  13: {
    title: '3-Bet Pots and Balance',
    summary: 'In 3-bet pots, SPR is lower and ranges are narrower. C-bet smaller and less often. Defenders should check-raise strong hands and call more medium strength.',
    principles: ['Lower SPR in 3-bet pots favors big hands over speculative ones', 'C-bet less frequently but with a more polarized range', 'As the aggressor, range advantage matters more on high cards', 'As the defender, balance check-raises with strong hands and draws'],
    mistakes: ['C-betting too wide in 3-bet pots like single-raised pots', 'Overfolding as the defender on high-card boards', 'Not adjusting to the narrower ranges in play', 'Playing 3-bet pots identically to single-raised pots'],
    heuristics: ['High card flops favor the 3-bettor\'s range', 'Low card flops are better for the defender', 'Use smaller c-bet sizes in 3-bet pots (1/3 pot)', 'With draws, prefer check-raising over calling as defender'],
    factors: ['Stack-to-pot ratio', 'Range advantage by board texture', 'Aggressor vs defender dynamics', 'Balance between value and bluffs'],
  },
  14: {
    title: 'Stack Depth',
    summary: 'Deep stacks increase implied odds for speculative hands. Short stacks reduce postflop play and favor big-card hands that can commit preflop.',
    principles: ['Deep stacked: pocket pairs and suited aces increase in value', 'Short stacked (10-20bb): open smaller, play hands that survive shoves', 'SPR determines how committed you are to the pot postflop', 'Medium stacks (40bb): consider shove/fold ranges with strong broadways'],
    mistakes: ['Set-mining at short stacks where implied odds don\'t exist', 'Opening too large into short stacks that may shove', 'Not adjusting calling ranges for effective stack depth', 'Playing deep-stack strategy at short-stack depths'],
    heuristics: ['Deep: pairs and AXs go up in value as preflop callers', 'Short 10-20bb: open to 2-2.2bb instead of 3bb', 'Short: prefer hands like AQ, KQ that can call shoves', 'Deep: suited connectors and pocket pairs are premium calls'],
    factors: ['Effective stack size', 'Stack-to-pot ratio implications', 'Implied odds at various depths', 'Shove/fold vs postflop decision'],
  },
}

export function ChapterWorkspace() {
  const { id } = useParams()
  const chapterId = Number(id)
  const chapter = chapterContent[chapterId]

  const [activeTab, setActiveTab] = useState<'summary' | 'notes'>('summary')
  const [noteText, setNoteText] = useState('')

  const progress = getChapterProgress(chapterId)
  const notes = getNotesByChapter(chapterId)
  const concepts = getConceptsByChapter(chapterId)

  if (!chapter) {
    return <div className="text-center py-12 text-ink/50">Chapter not found.</div>
  }

  const handleMarkReviewed = () => {
    saveChapterProgress(chapterId, {
      reviewDone: true,
      completion: Math.max(progress.completion, 25),
    })
    savePreferences({ lastChapterId: chapterId })
    window.location.reload()
  }

  const handleSaveNote = () => {
    if (!noteText.trim()) return
    saveNote(chapterId, noteText.trim())
    setNoteText('')
    window.location.reload()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-caption text-ink/40 mb-1">Chapter {chapterId}</p>
          <h1 className="text-h1 font-bold tracking-tight">{chapter.title}</h1>
          <p className="text-body-lg text-ink/60 mt-2">{chapter.summary}</p>
        </div>
      </div>

      {/* Progress + Actions */}
      <div className="flex items-center gap-4 flex-wrap">
        <ProgressBar value={progress.completion} className="flex-1 max-w-[300px]" showLabel />
        {!progress.reviewDone && (
          <button onClick={handleMarkReviewed} className="btn-primary text-sm">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Mark as Reviewed
          </button>
        )}
        <Link to={`/quiz/${chapterId}`} className="btn-secondary text-sm inline-flex items-center gap-1">
          <HelpCircle className="w-4 h-4" /> Quiz
        </Link>
        <Link to={`/practice/${chapterId}`} className="btn-secondary text-sm inline-flex items-center gap-1">
          <Spade className="w-4 h-4" /> Practice
        </Link>
        <a
          href={`/chapters/chapter-${chapterId}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary text-sm inline-flex items-center gap-1"
        >
          <FileText className="w-4 h-4" /> Source Material
        </a>
      </div>

      {/* Audio Player */}
      <AudioPlayer chapterId={chapterId} />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-border dark:border-slate-border pb-0">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 text-body font-medium border-b-2 transition-colors -mb-px ${
            activeTab === 'summary' ? 'border-forest text-forest' : 'border-transparent text-ink/50 hover:text-ink'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 text-body font-medium border-b-2 transition-colors -mb-px ${
            activeTab === 'notes' ? 'border-forest text-forest' : 'border-transparent text-ink/50 hover:text-ink'
          }`}
        >
          Notes ({notes.length})
        </button>
      </div>

      {activeTab === 'summary' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Core Principles */}
          <div className="card">
            <h3 className="text-h4 font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-forest" />
              Core Principles
            </h3>
            <ul className="space-y-2">
              {chapter.principles.map((p, i) => (
                <li key={i} className="text-body text-ink/80 dark:text-ink/80 flex gap-2">
                  <ChevronRight className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div className="card">
            <h3 className="text-h4 font-semibold mb-3 flex items-center gap-2">
              <span className="text-error">!</span>
              Common Mistakes
            </h3>
            <ul className="space-y-2">
              {chapter.mistakes.map((m, i) => (
                <li key={i} className="text-body text-ink/80 dark:text-ink/80 flex gap-2">
                  <span className="text-error shrink-0">-</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Heuristics */}
          <div className="card">
            <h3 className="text-h4 font-semibold mb-3 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-gold" />
              Actionable Heuristics
            </h3>
            <ul className="space-y-2">
              {chapter.heuristics.map((h, i) => (
                <li key={i} className="text-body text-ink/80 dark:text-ink/80 flex gap-2">
                  <span className="text-gold shrink-0">&bull;</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Decision Factors */}
          <div className="card">
            <h3 className="text-h4 font-semibold mb-3 flex items-center gap-2">
              <Spade className="w-4 h-4 text-info" />
              Key Decision Factors
            </h3>
            <ul className="space-y-2">
              {chapter.factors.map((f, i) => (
                <li key={i} className="text-body text-ink/80 dark:text-ink/80 flex gap-2">
                  <span className="text-info shrink-0">&rarr;</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Linked Concepts */}
          <div className="card lg:col-span-2">
            <h3 className="text-h4 font-semibold mb-3">Linked Concepts</h3>
            <div className="flex flex-wrap gap-2">
              {concepts.map(c => (
                <Link
                  key={c.id}
                  to="/concepts"
                  className="badge-forest hover:bg-forest/25 transition-colors cursor-pointer"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Add note */}
          <div className="card">
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add a personal note for this chapter..."
              className="w-full bg-transparent border border-slate-border dark:border-slate-border rounded-lg p-3 text-body resize-y min-h-[100px] focus:outline-none focus:border-forest"
            />
            <div className="flex justify-end mt-2">
              <button onClick={handleSaveNote} className="btn-primary text-sm" disabled={!noteText.trim()}>
                Save Note
              </button>
            </div>
          </div>

          {/* Existing notes */}
          {notes.length === 0 ? (
            <p className="text-center text-ink/40 py-8">
              No notes yet. Add the first shortcut you want to remember.
            </p>
          ) : (
            notes.map(note => (
              <div key={note.id} className="card">
                <p className="text-body whitespace-pre-wrap">{note.content}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-micro text-ink/30">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => { deleteNote(note.id); window.location.reload() }}
                    className="text-micro text-error/60 hover:text-error transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
