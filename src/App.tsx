import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/pages/HomePage'
import { ChapterLibrary } from '@/pages/ChapterLibrary'
import { ChapterWorkspace } from '@/pages/ChapterWorkspace'
import { QuizMode } from '@/pages/QuizMode'
import { PracticeHands } from '@/pages/PracticeHands'
import { PreflopTrainer } from '@/pages/PreflopTrainer'
import { HandReviewPage } from '@/pages/HandReviewPage'
import { PersonalNotes } from '@/pages/PersonalNotes'
import { Analytics } from '@/pages/Analytics'
import { SettingsPage } from '@/pages/Settings'
import { EquityCalculator } from '@/pages/EquityCalculator'
import { SolverPage } from '@/pages/SolverPage'

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="chapters" element={<ChapterLibrary />} />
            <Route path="chapters/:id" element={<ChapterWorkspace />} />
            <Route path="quiz/:chapterId" element={<QuizMode />} />
            <Route path="practice/:chapterId" element={<PracticeHands />} />
            <Route path="preflop" element={<PreflopTrainer />} />
            <Route path="equity" element={<EquityCalculator />} />
            <Route path="solver" element={<SolverPage />} />
            <Route path="review" element={<HandReviewPage />} />
            <Route path="notes" element={<PersonalNotes />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}
