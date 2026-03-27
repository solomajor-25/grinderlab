/**
 * Displays equity percentage with a colored bar.
 */

import { cn } from '@/lib/utils'

interface EquityDisplayProps {
  equity: number       // 0-1
  label?: string       // e.g., "Your hand vs this range"
  wins?: number
  ties?: number
  total?: number
  className?: string
}

export function EquityDisplay({
  equity,
  label,
  wins,
  ties,
  total,
  className,
}: EquityDisplayProps) {
  const pct = Math.round(equity * 1000) / 10 // one decimal
  const color = equity >= 0.55
    ? 'bg-success text-success'
    : equity >= 0.45
    ? 'bg-gold text-gold'
    : 'bg-error text-error'

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <p className="text-caption text-ink/60">{label}</p>
      )}
      <div className="flex items-center gap-3">
        <span className={cn('text-h3 font-bold tabular-nums', color.split(' ')[1])}>
          {pct}%
        </span>
        <div className="flex-1 h-3 bg-slate-card rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', color.split(' ')[0])}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {total !== undefined && total > 0 && (
        <p className="text-micro text-ink/40">
          {wins !== undefined && `W: ${wins}`}
          {ties !== undefined && ` T: ${ties}`}
          {` / ${total} matchups`}
        </p>
      )}
    </div>
  )
}
