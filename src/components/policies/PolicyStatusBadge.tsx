import { Badge } from '@/components/ui/badge'
import type { PolicyStatus } from '@/types'

const statusStyles: Record<PolicyStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  expired: 'bg-red-100 text-red-700 border border-red-200',
  cancelled: 'bg-slate-100 text-slate-700 border border-slate-200',
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  renewed: 'bg-sky-100 text-sky-700 border border-sky-200',
}

export default function PolicyStatusBadge({ status }: { status: PolicyStatus }) {
  return <Badge className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles[status]}`}>{status}</Badge>
}
