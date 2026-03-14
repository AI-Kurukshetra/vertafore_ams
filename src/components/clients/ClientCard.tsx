import Link from 'next/link'
import { Building2, Mail, IdCard } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import ClientStatusBadge from '@/components/clients/ClientStatusBadge'
import type { Client } from '@/types'

export default function ClientCard({ client }: { client: Client }) {
  return (
    <div className="reveal-item hover-float hover-glow rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{client.first_name} {client.last_name}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
            <IdCard className="h-3.5 w-3.5" /> {client.client_id}
          </div>
        </div>
        <ClientStatusBadge status={client.status} />
      </div>

      <div className="mt-3 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" />{client.email}</p>
        <p className="flex items-center gap-2"><Building2 className="h-4 w-4 text-slate-400" />{client.company_name || 'No company'}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <Link className={buttonVariants({ size: 'sm', variant: 'outline' })} href={`/clients/${client.id}`}>View</Link>
        <Link className={buttonVariants({ size: 'sm', variant: 'outline' })} href={`/clients/${client.id}/edit`}>Edit</Link>
      </div>
    </div>
  )
}
