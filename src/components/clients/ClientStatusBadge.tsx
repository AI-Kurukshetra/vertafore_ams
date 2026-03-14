import { Badge } from '@/components/ui/badge'
import type { ClientStatus } from '@/types'

const statusStyles: Record<ClientStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  inactive: 'bg-slate-100 text-slate-700 border border-slate-200',
  prospect: 'bg-sky-100 text-sky-700 border border-sky-200',
  churned: 'bg-red-100 text-red-700 border border-red-200',
}

export default function ClientStatusBadge({ status }: { status: ClientStatus }) {
  return <Badge className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles[status]}`}>{status}</Badge>
}
