import Link from 'next/link'
import { Plus, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ClientTable from '@/components/clients/ClientTable'
import EmptyClientsState from '@/components/clients/EmptyClientsState'
import { buttonVariants } from '@/components/ui/button'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase.from('clients').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-5">
      <section className="glass-panel rounded-2xl p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Client Operations</p>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight text-slate-900">
              <Users className="h-6 w-6 text-cyan-700" /> Clients
            </h1>
            <p className="mt-1 text-sm text-slate-600">Track relationships, contact details, lifecycle stages, and account ownership.</p>
          </div>
          <Link href="/clients/add" className={buttonVariants({ size: 'lg' })}><Plus className="h-4 w-4" /> Add Client</Link>
        </div>
      </section>
      {!clients?.length ? <EmptyClientsState /> : <ClientTable clients={clients} />}
    </div>
  )
}
