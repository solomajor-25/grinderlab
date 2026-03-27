import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  color?: 'forest' | 'gold' | 'success'
}

const colorMap = {
  forest: 'bg-forest',
  gold: 'bg-gold',
  success: 'bg-success',
}

export function ProgressBar({ value, max = 100, className, showLabel, color = 'forest' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="progress-bar flex-1">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorMap[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-micro text-ink/60 dark:text-ink/60 min-w-[3ch] text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  )
}
