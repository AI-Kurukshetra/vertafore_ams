import { ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function StatsCard({
  title,
  value,
  subtitle,
  tone = 'cyan',
}: {
  title: string
  value: string | number
  subtitle?: string
  tone?: 'cyan' | 'emerald' | 'amber' | 'rose'
}) {
  const toneClass: Record<typeof tone, string> = {
    cyan: 'from-cyan-500/15 to-sky-500/10 text-cyan-700',
    emerald: 'from-emerald-500/15 to-teal-500/10 text-emerald-700',
    amber: 'from-amber-500/15 to-orange-500/10 text-amber-700',
    rose: 'from-rose-500/15 to-red-500/10 text-rose-700',
  }

  return (
    <Card className="glass-panel hover-float hover-glow reveal-item rounded-2xl border-slate-200/70 py-0">
      <CardHeader className="pb-0 pt-4">
        <div className={`inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r px-2.5 py-1 text-[11px] font-semibold ${toneClass[tone]}`}>
          <ArrowUpRight className="h-3 w-3" /> {title}
        </div>
      </CardHeader>
      <CardContent className="pb-4 pt-3">
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
