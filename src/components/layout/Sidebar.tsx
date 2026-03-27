import { NavLink } from 'react-router-dom'
import {
  Home,
  BookOpen,
  Spade,
  Calculator,
  Cpu,
  ClipboardCheck,
  StickyNote,
  BarChart3,
  Settings,
  Crosshair,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/chapters', icon: BookOpen, label: 'Chapters' },
  { to: '/preflop', icon: Spade, label: 'Preflop' },
  { to: '/equity', icon: Calculator, label: 'Equity' },
  { to: '/solver', icon: Cpu, label: 'Solver' },
  { to: '/review', icon: ClipboardCheck, label: 'Hand Review' },
  { to: '/notes', icon: StickyNote, label: 'Notes' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  return (
    <nav className="w-16 lg:w-56 shrink-0 flex flex-col items-center lg:items-stretch border-r border-slate-border dark:border-slate-border py-6 px-2 lg:px-4 gap-1">
      <div className="flex items-center gap-2 px-2 mb-8">
        <Crosshair className="w-6 h-6 text-forest" />
        <span className="hidden lg:block text-h4 font-semibold tracking-tight">GrinderLab</span>
      </div>

      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.9375rem] transition-colors',
              isActive
                ? 'bg-forest/15 text-forest-light font-medium'
                : 'text-ink/60 dark:text-ink/60 hover:text-ink hover:bg-slate-card dark:hover:bg-slate-card light:text-graphite/60 light:hover:text-graphite light:hover:bg-ivory-card'
            )
          }
        >
          <Icon className="w-5 h-5 shrink-0" />
          <span className="hidden lg:block">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
