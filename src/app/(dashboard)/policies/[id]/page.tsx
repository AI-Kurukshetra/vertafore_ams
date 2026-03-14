import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, PencilLine } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PolicyDetail from '@/components/policies/PolicyDetail'
import DeletePolicyDialog from '@/components/policies/DeletePolicyDialog'
import { buttonVariants } from '@/components/ui/button'

export default async function PolicyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: policy } = await supabase.from('policies').select('*, client:clients(*)').eq('id', id).single()

  if (!policy) notFound()

  return (
    <div className="space-y-4">
      <div className="reveal-item flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" style={{ ['--stagger' as string]: '10ms' }}>
        <Link href="/policies" className={buttonVariants({ variant: 'outline' })}><ArrowLeft className="h-4 w-4" /> Back to Policies</Link>
        <div className="flex flex-wrap gap-2">
          <Link href={`/policies/${id}/edit`} className={buttonVariants({ variant: 'outline' })}><PencilLine className="h-4 w-4" /> Edit Policy</Link>
          <DeletePolicyDialog policyId={id} label={`\"${policy.policy_number}\" (${policy.policy_type} - ${policy.carrier_name})`} />
        </div>
      </div>
      <PolicyDetail policy={policy} />
    </div>
  )
}
