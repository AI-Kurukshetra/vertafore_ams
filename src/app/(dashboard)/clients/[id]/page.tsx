import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, PencilLine } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ClientDetail from '@/components/clients/ClientDetail'
import DeleteClientDialog from '@/components/clients/DeleteClientDialog'
import { buttonVariants } from '@/components/ui/button'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: client }, { data: policies }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).single(),
    supabase.from('policies').select('*').eq('client_id', id).order('created_at', { ascending: false }),
  ])

  if (!client) notFound()

  return (
    <div className="space-y-4">
      <div className="reveal-item flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" style={{ ['--stagger' as string]: '10ms' }}>
        <Link href="/clients" className={buttonVariants({ variant: 'outline' })}><ArrowLeft className="h-4 w-4" /> Back to Clients</Link>
        <div className="flex flex-wrap gap-2">
          <Link href={`/clients/${id}/edit`} className={buttonVariants({ variant: 'outline' })}><PencilLine className="h-4 w-4" /> Edit Client</Link>
          <DeleteClientDialog clientId={id} label={`\"${client.first_name} ${client.last_name}\" (${client.client_id})`} />
        </div>
      </div>
      <ClientDetail client={client} policies={policies || []} />
    </div>
  )
}
