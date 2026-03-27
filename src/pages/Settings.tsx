import { useState } from 'react'
import { Settings as SettingsIcon, Moon, Sun, RotateCcw, Heart, Users } from 'lucide-react'
import { getPreferences, savePreferences, resetAllData, getDefaultVillainPresets } from '@/lib/storage'
import { useTheme } from '@/hooks/useTheme'

const chapterList = [
  { id: 2, title: 'Opening the Pot' },
  { id: 3, title: 'When Someone Limps' },
  { id: 4, title: 'C-Betting' },
  { id: 5, title: 'Value Betting' },
  { id: 6, title: 'Calling Opens' },
  { id: 7, title: 'Facing Bets: End of Action' },
  { id: 8, title: 'Facing Bets: Open Action' },
  { id: 9, title: 'Combos and Blockers' },
  { id: 10, title: '3-Betting' },
  { id: 11, title: 'Facing 3-Bets' },
  { id: 12, title: 'Bluffing Turn and River' },
  { id: 13, title: '3-Bet Pots and Balance' },
  { id: 14, title: 'Stack Depth' },
]

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [prefs, setPrefs] = useState(getPreferences)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  const villainPresets = getDefaultVillainPresets()

  const updateStudyMode = (mode: 'chapter' | 'daily' | 'preflop') => {
    const updated = { ...prefs, studyMode: mode }
    setPrefs(updated)
    savePreferences({ studyMode: mode })
  }

  const toggleFavorite = (chapterId: number) => {
    const favorites = prefs.favoriteChapters.includes(chapterId)
      ? prefs.favoriteChapters.filter(id => id !== chapterId)
      : [...prefs.favoriteChapters, chapterId]
    const updated = { ...prefs, favoriteChapters: favorites }
    setPrefs(updated)
    savePreferences({ favoriteChapters: favorites })
  }

  const handleReset = () => {
    resetAllData()
    setShowResetConfirm(false)
    setResetDone(true)
    setTimeout(() => setResetDone(false), 3000)
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-h1 font-bold tracking-tight">Settings</h1>
        <p className="text-body-lg text-ink/60 mt-1">
          Customize your study experience.
        </p>
      </div>

      {/* Theme */}
      <div className="card">
        <h2 className="text-h3 font-semibold mb-4 flex items-center gap-2">
          {theme === 'dark' ? <Moon className="w-5 h-5 text-forest" /> : <Sun className="w-5 h-5 text-gold" />}
          Appearance
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
              theme === 'dark'
                ? 'border-forest bg-forest/10'
                : 'border-slate-border hover:border-ink/20'
            }`}
          >
            <Moon className="w-5 h-5 mx-auto mb-2" />
            <p className="text-body font-medium text-center">Dark</p>
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
              theme === 'light'
                ? 'border-forest bg-forest/10'
                : 'border-slate-border hover:border-ink/20'
            }`}
          >
            <Sun className="w-5 h-5 mx-auto mb-2" />
            <p className="text-body font-medium text-center">Light</p>
          </button>
        </div>
      </div>

      {/* Preferred Study Mode */}
      <div className="card">
        <h2 className="text-h3 font-semibold mb-4 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-forest" />
          Default Study Mode
        </h2>
        <p className="text-caption text-ink/50 mb-3">
          Sets the default mode when you click "Start Studying" from the homepage.
        </p>
        <div className="flex gap-3">
          {[
            { value: 'chapter' as const, label: 'Chapter Review' },
            { value: 'daily' as const, label: 'Daily Training' },
            { value: 'preflop' as const, label: 'Preflop Trainer' },
          ].map(mode => (
            <button
              key={mode.value}
              onClick={() => updateStudyMode(mode.value)}
              className={`flex-1 py-2.5 px-3 rounded-lg border-2 text-body font-medium transition-colors ${
                prefs.studyMode === mode.value
                  ? 'border-forest bg-forest/10 text-forest'
                  : 'border-slate-border hover:border-ink/20'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Favorite Chapters */}
      <div className="card">
        <h2 className="text-h3 font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-error" />
          Favorite Chapters
        </h2>
        <p className="text-caption text-ink/50 mb-3">
          Favorited chapters appear first in your daily training recommendations.
        </p>
        <div className="space-y-1">
          {chapterList.map(ch => {
            const isFav = prefs.favoriteChapters.includes(ch.id)
            return (
              <button
                key={ch.id}
                onClick={() => toggleFavorite(ch.id)}
                className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg text-left transition-colors ${
                  isFav ? 'bg-forest/10' : 'hover:bg-ink/5'
                }`}
              >
                <Heart className={`w-4 h-4 shrink-0 ${isFav ? 'text-error fill-error' : 'text-ink/20'}`} />
                <span className="text-body">
                  Ch {ch.id}: {ch.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Villain Presets */}
      <div className="card">
        <h2 className="text-h3 font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-forest" />
          Villain Presets
        </h2>
        <p className="text-caption text-ink/50 mb-3">
          Default villain profiles used in the Preflop Trainer.
        </p>
        <div className="space-y-3">
          {villainPresets.map(v => (
            <div key={v.id} className="flex items-start gap-3 py-2">
              <div className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center shrink-0">
                <span className="text-body font-bold text-forest">
                  {v.vpip}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-body font-medium">{v.name}</p>
                <p className="text-caption text-ink/50">{v.description}</p>
                <p className="text-micro text-ink/30 mt-1">
                  VPIP: {v.vpip}% / PFR: {v.pfr}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Data */}
      <div className="card border-error/20">
        <h2 className="text-h3 font-semibold mb-4 flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-error" />
          Reset Study Data
        </h2>
        <p className="text-caption text-ink/50 mb-4">
          Permanently erase all progress, notes, bookmarks, and streaks. This cannot be undone.
        </p>

        {resetDone ? (
          <p className="text-body text-success font-medium">All data has been reset.</p>
        ) : showResetConfirm ? (
          <div className="flex items-center gap-3">
            <span className="text-body text-error font-medium">Are you sure?</span>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-error text-white text-body font-medium hover:bg-error/90 transition-colors"
            >
              Yes, erase everything
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="btn-ghost text-body"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-lg border border-error/30 text-error text-body font-medium hover:bg-error/10 transition-colors"
          >
            Reset All Data
          </button>
        )}
      </div>
    </div>
  )
}
