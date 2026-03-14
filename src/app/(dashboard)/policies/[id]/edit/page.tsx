import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, PencilLine } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { updatePolicyAction } from '@/actions/policies'
import PolicyForm from '@/components/policies/PolicyForm'
import { buttonVariants } from '@/components/ui/button'

export default async function EditPolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: policy }, { data: clients }] = await Promise.all([
    supabase.from('policies').select('*').eq('id', id).single(),
    supabase.from('clients').select('*').order('client_id'),
  ])

  if (!policy) notFound()

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Update Coverage</p>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight text-slate-900">
              <PencilLine className="h-6 w-6 text-cyan-700" /> Edit Policy
            </h1>
          </div>
          <Link href={`/policies/${id}`} className={buttonVariants({ variant: 'outline' })}><ArrowLeft className="h-4 w-4" /> Back</Link>
        </div>
      </div>
      <PolicyForm action={updatePolicyAction.bind(null, id)} clients={clients || []} initialData={policy} submitText="Save Changes" />
    </div>
  )
}
