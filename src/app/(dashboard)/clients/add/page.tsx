import Link from 'next/link'
import { ArrowLeft, UserPlus2 } from 'lucide-react'
import { addClientAction } from '@/actions/clients'
import ClientForm from '@/components/clients/ClientForm'
import { buttonVariants } from '@/components/ui/button'

export default function AddClientPage() {
  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Create Client</p>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight text-slate-900">
              <UserPlus2 className="h-6 w-6 text-cyan-700" /> Add Client
            </h1>
          </div>
          <Link href="/clients" className={buttonVariants({ variant: 'outline' })}><ArrowLeft className="h-4 w-4" /> Back</Link>
        </div>
      </div>
      <ClientForm action={addClientAction} />
    </div>
  )
}
