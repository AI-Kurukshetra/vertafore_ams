import { Badge } from '@/components/ui/badge'
import type { PolicyType } from '@/types'

const typeStyles: Record<PolicyType, string> = {
  auto: 'bg-blue-100 text-blue-700 border border-blue-200',
  home: 'bg-green-100 text-green-700 border border-green-200',
  life: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  health: 'bg-teal-100 text-teal-700 border border-teal-200',
  commercial: 'bg-orange-100 text-orange-700 border border-orange-200',
  liability: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
}

export default function PolicyTypeBadge({ type }: { type: PolicyType }) {
  return <Badge className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${typeStyles[type]}`}>{type}</Badge>
}
