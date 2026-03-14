import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, PencilLine } from 'lucide-react'
import { updateClientAction } from '@/actions/clients'
import { createClient } from '@/lib/supabase/server'
import ClientForm from '@/components/clients/ClientForm'
import { buttonVariants } from '@/components/ui/button'

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: client } = await supabase.from('clients').select('*').eq('id', id).single()

  if (!client) notFound()

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Update Profile</p>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight text-slate-900">
              <PencilLine className="h-6 w-6 text-cyan-700" /> Edit Client
            </h1>
          </div>
          <Link href={`/clients/${id}`} className={buttonVariants({ variant: 'outline' })}><ArrowLeft className="h-4 w-4" /> Back</Link>
        </div>
      </div>
      <ClientForm action={updateClientAction.bind(null, id)} initialData={client} submitText="Save Changes" />
    </div>
  )
}
