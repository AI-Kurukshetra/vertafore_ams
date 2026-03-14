import Link from 'next/link'
import { ArrowLeft, ShieldPlus } from 'lucide-react'
import { addPolicyAction } from '@/actions/policies'
import { createClient } from '@/lib/supabase/server'
import PolicyForm from '@/components/policies/PolicyForm'
import { buttonVariants } from '@/components/ui/button'

export default async function AddPolicyPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase.from('clients').select('*').order('client_id')

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Create Coverage</p>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight text-slate-900">
              <ShieldPlus className="h-6 w-6 text-cyan-700" /> Add Policy
            </h1>
          </div>
          <Link href="/policies" className={buttonVariants({ variant: 'outline' })}><ArrowLeft className="h-4 w-4" /> Back</Link>
        </div>
      </div>
      <PolicyForm action={addPolicyAction} clients={clients || []} />
    </div>
  )
}
