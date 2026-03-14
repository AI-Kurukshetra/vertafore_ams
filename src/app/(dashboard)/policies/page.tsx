import Link from 'next/link'
import { Plus, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PolicyTable from '@/components/policies/PolicyTable'
import EmptyPoliciesState from '@/components/policies/EmptyPoliciesState'
import { buttonVariants } from '@/components/ui/button'

export default async function PoliciesPage() {
  const supabase = await createClient()
  const { data: policies } = await supabase
    .from('policies')
    .select('*, client:clients(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-5">
      <section className="glass-panel rounded-2xl p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Coverage Operations</p>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight text-slate-900">
              <ShieldCheck className="h-6 w-6 text-cyan-700" /> Policies
            </h1>
            <p className="mt-1 text-sm text-slate-600">Manage policy lifecycle, premiums, coverage values, and renewal readiness.</p>
          </div>
          <Link href="/policies/add" className={buttonVariants({ size: 'lg' })}><Plus className="h-4 w-4" /> Add Policy</Link>
        </div>
      </section>
      {!policies?.length ? <EmptyPoliciesState /> : <PolicyTable policies={policies} />}
    </div>
  )
}
