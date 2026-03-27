import { useState } from 'react'
import { Link } from 'react-router-dom'
import { StickyNote, Search, BookOpen, Trash2 } from 'lucide-react'
import { getNotes, deleteNote } from '@/lib/storage'

const chapterNames: Record<number, string> = {
  2: 'Opening the Pot', 3: 'When Someone Limps', 4: 'C-Betting',
  5: 'Value Betting', 6: 'Calling Opens', 7: 'Facing Bets: End of Action',
  8: 'Facing Bets: Open Action', 9: 'Combos and Blockers', 10: '3-Betting',
  11: 'Facing 3-Bets', 12: 'Bluffing Turn and River',
  13: '3-Bet Pots and Balance', 14: 'Stack Depth',
}

export function PersonalNotes() {
  const [search, setSearch] = useState('')
  const [filterChapter, setFilterChapter] = useState<number | null>(null)

  const allNotes = getNotes()
  const filtered = allNotes.filter(n => {
    if (filterChapter && n.chapterId !== filterChapter) return false
    if (search && !n.content.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleDelete = (noteId: string) => {
    deleteNote(noteId)
    window.location.reload()
  }

  // Group by chapter
  const grouped = filtered.reduce<Record<number, typeof filtered>>((acc, note) => {
    if (!acc[note.chapterId]) acc[note.chapterId] = []
    acc[note.chapterId].push(note)
    return acc
  }, {})

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">Personal Notes</h1>
        <p className="text-body-lg text-ink/60 mt-1">
          Your private poker workbook. Capture heuristics, reminders, and adjustments.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-transparent border border-slate-border dark:border-slate-border rounded-lg pl-10 pr-3 py-2 text-body focus:outline-none focus:border-forest"
          />
        </div>
        <select
          value={filterChapter ?? ''}
          onChange={e => setFilterChapter(e.target.value ? Number(e.target.value) : null)}
          className="bg-transparent border border-slate-border dark:border-slate-border rounded-lg px-3 py-2 text-body focus:outline-none focus:border-forest"
        >
          <option value="">All chapters</option>
          {Object.entries(chapterNames).map(([id, name]) => (
            <option key={id} value={id}>Ch {id}: {name}</option>
          ))}
        </select>
      </div>

      {/* Notes grouped by chapter */}
      {Object.keys(grouped).length > 0 ? (
        Object.entries(grouped)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([chapterId, notes]) => (
            <div key={chapterId} className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-forest" />
                <Link
                  to={`/chapters/${chapterId}`}
                  className="text-h4 font-semibold hover:text-forest transition-colors"
                >
                  Chapter {chapterId}: {chapterNames[Number(chapterId)]}
                </Link>
                <span className="text-micro text-ink/40">({notes.length})</span>
              </div>
              {notes.map(note => (
                <div key={note.id} className="card">
                  <p className="text-body whitespace-pre-wrap">{note.content}</p>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-border/50 dark:border-slate-border/50">
                    <span className="text-micro text-ink/30">
                      {new Date(note.updatedAt).toLocaleDateString()} at{' '}
                      {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-micro text-ink/30 hover:text-error transition-colors inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
      ) : (
        <div className="text-center py-12">
          <StickyNote className="w-12 h-12 text-ink/20 mx-auto mb-4" />
          <h3 className="text-h3 font-semibold mb-2">
            {allNotes.length === 0 ? 'No notes yet' : 'No matching notes'}
          </h3>
          <p className="text-body text-ink/50 mb-4">
            {allNotes.length === 0
              ? 'Open a chapter and add notes as you study.'
              : 'Try adjusting your search or filter.'}
          </p>
          {allNotes.length === 0 && (
            <Link to="/chapters" className="btn-primary">Browse Chapters</Link>
          )}
        </div>
      )}
    </div>
  )
}
