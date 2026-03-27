import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'

export function AppShell() {
  const { pathname } = useLocation()
  const isFullWidth = pathname === '/solver'

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className={cn('flex-1', isFullWidth ? 'overflow-hidden' : 'overflow-y-auto')}>
        <div className={cn(
          isFullWidth
            ? 'px-4 py-3 h-full'
            : 'max-w-5xl mx-auto px-6 py-8',
        )}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
