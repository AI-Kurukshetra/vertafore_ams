import Link from 'next/link'
import { CalendarClock, IndianRupee, UserRound } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import PolicyStatusBadge from '@/components/policies/PolicyStatusBadge'
import PolicyTypeBadge from '@/components/policies/PolicyTypeBadge'
import type { Policy } from '@/types'

export default function PolicyCard({ policy }: { policy: Policy }) {
  return (
    <div className="reveal-item hover-float hover-glow rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900">{policy.policy_number}</h3>
        <PolicyTypeBadge type={policy.policy_type} />
      </div>

      <div className="mt-3 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2"><UserRound className="h-4 w-4 text-slate-400" />{policy.client?.first_name} {policy.client?.last_name}</p>
        <p className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-slate-400" />{policy.carrier_name} • {Number(policy.premium_amount).toLocaleString('en-IN')}/yr</p>
        <p className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-slate-400" />Expires: {policy.expiration_date}</p>
      </div>

      <div className="mt-3"><PolicyStatusBadge status={policy.status} /></div>

      <div className="mt-4 flex gap-2">
        <Link className={buttonVariants({ size: 'sm', variant: 'outline' })} href={`/policies/${policy.id}`}>View</Link>
        <Link className={buttonVariants({ size: 'sm', variant: 'outline' })} href={`/policies/${policy.id}/edit`}>Edit</Link>
      </div>
    </div>
  )
}
