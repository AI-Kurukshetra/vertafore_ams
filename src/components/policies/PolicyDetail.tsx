import Link from 'next/link'
import { differenceInMonths, format } from 'date-fns'
import { CalendarDays, CircleDollarSign, FileCheck2, Shield, UserRound, Sparkles } from 'lucide-react'
import type { Policy } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PolicyStatusBadge from '@/components/policies/PolicyStatusBadge'
import PolicyTypeBadge from '@/components/policies/PolicyTypeBadge'

export default function PolicyDetail({ policy }: { policy: Policy }) {
  const durationMonths = Math.max(0, differenceInMonths(new Date(policy.expiration_date), new Date(policy.effective_date)))

  return (
    <div className="space-y-5">
      <section className="glass-panel reveal-item rounded-2xl p-5 md:p-6" style={{ ['--stagger' as string]: '20ms' }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
              <Sparkles className="h-3.5 w-3.5" /> Policy Profile
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{policy.policy_type.toUpperCase()} Insurance • {policy.policy_number}</h1>
            <p className="mt-1 text-sm text-slate-600">{policy.carrier_name} • {policy.client?.first_name} {policy.client?.last_name}</p>
          </div>
          <PolicyStatusBadge status={policy.status} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200/70 bg-white/85 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Annual Premium</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">₹{Number(policy.premium_amount).toLocaleString('en-IN')}</p>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-white/85 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Coverage</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">₹{Number(policy.coverage_amount || 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-white/85 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Duration</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{durationMonths} months</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="glass-panel reveal-item rounded-2xl py-0" style={{ ['--stagger' as string]: '70ms' }}>
          <CardHeader className="py-4"><CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4 text-cyan-700" /> Policy Information</CardTitle></CardHeader>
          <CardContent className="space-y-3 pb-4 text-sm text-slate-700">
            <p className="flex items-center gap-2">Type: <PolicyTypeBadge type={policy.policy_type} /></p>
            <p>Carrier: {policy.carrier_name}</p>
            <p className="flex items-center gap-2">Status: <PolicyStatusBadge status={policy.status} /></p>
            <p>Policy #: {policy.policy_number}</p>
          </CardContent>
        </Card>

        <Card className="glass-panel reveal-item rounded-2xl py-0" style={{ ['--stagger' as string]: '110ms' }}>
          <CardHeader className="py-4"><CardTitle className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-cyan-700" /> Financial Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 pb-4 text-sm text-slate-700">
            <p>Annual Premium: ₹{Number(policy.premium_amount).toLocaleString('en-IN')}</p>
            <p>Coverage: ₹{Number(policy.coverage_amount || 0).toLocaleString('en-IN')}</p>
            <p>Deductible: ₹{Number(policy.deductible || 0).toLocaleString('en-IN')}</p>
          </CardContent>
        </Card>

        <Card className="glass-panel reveal-item rounded-2xl py-0" style={{ ['--stagger' as string]: '150ms' }}>
          <CardHeader className="py-4"><CardTitle className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-cyan-700" /> Coverage Dates</CardTitle></CardHeader>
          <CardContent className="space-y-3 pb-4 text-sm text-slate-700">
            <p>Effective: {format(new Date(policy.effective_date), 'dd MMM yyyy')}</p>
            <p>Expires: {format(new Date(policy.expiration_date), 'dd MMM yyyy')}</p>
            <p>Duration: {durationMonths} months</p>
          </CardContent>
        </Card>

        <Card className="glass-panel reveal-item rounded-2xl py-0" style={{ ['--stagger' as string]: '190ms' }}>
          <CardHeader className="py-4"><CardTitle className="flex items-center gap-2"><UserRound className="h-4 w-4 text-cyan-700" /> Client</CardTitle></CardHeader>
          <CardContent className="space-y-3 pb-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{policy.client?.first_name} {policy.client?.last_name}</p>
            <p>{policy.client?.email}</p>
            <Link href={`/clients/${policy.client?.id}`} className="inline-flex items-center gap-1 font-semibold text-cyan-700 hover:text-cyan-800">
              <FileCheck2 className="h-4 w-4" /> View Client
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
