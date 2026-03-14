import Link from 'next/link'
import { format } from 'date-fns'
import { Briefcase, CalendarClock, Mail, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import type { Client, Policy } from '@/types'
import ClientStatusBadge from '@/components/clients/ClientStatusBadge'
import PolicyStatusBadge from '@/components/policies/PolicyStatusBadge'
import PolicyTypeBadge from '@/components/policies/PolicyTypeBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function ClientDetail({ client, policies }: { client: Client; policies: Policy[] }) {
  const activePolicies = policies.filter((p) => p.status === 'active').length
  const annualPremium = policies.reduce((sum, p) => sum + Number(p.premium_amount || 0), 0)

  return (
    <div className="space-y-5">
      <section className="glass-panel reveal-item rounded-2xl p-5 md:p-6" style={{ ['--stagger' as string]: '20ms' }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
              <Sparkles className="h-3.5 w-3.5" /> Client Profile
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{client.first_name} {client.last_name}</h1>
            <p className="mt-1 text-sm text-slate-600">{client.client_id} • {client.occupation || 'Occupation not set'} {client.company_name ? `@ ${client.company_name}` : ''}</p>
          </div>
          <ClientStatusBadge status={client.status} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200/70 bg-white/85 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Policies</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{policies.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-white/85 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Active Policies</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{activePolicies}</p>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-white/85 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-slate-500">Annual Premium</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">₹{annualPremium.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="glass-panel reveal-item rounded-2xl py-0" style={{ ['--stagger' as string]: '70ms' }}>
          <CardHeader className="py-4"><CardTitle className="flex items-center gap-2 text-lg"><Mail className="h-4 w-4 text-cyan-700" /> Personal Information</CardTitle></CardHeader>
          <CardContent className="space-y-3 pb-4 text-sm text-slate-700">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /> {client.email}</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /> {client.phone || 'Not provided'}</p>
            <p className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-slate-400" /> {client.date_of_birth ? format(new Date(client.date_of_birth), 'dd MMM yyyy') : 'DOB not set'}</p>
            <p className="capitalize">Gender: {client.gender || 'Not set'}</p>
          </CardContent>
        </Card>

        <Card className="glass-panel reveal-item rounded-2xl py-0" style={{ ['--stagger' as string]: '110ms' }}>
          <CardHeader className="py-4"><CardTitle className="flex items-center gap-2 text-lg"><Briefcase className="h-4 w-4 text-cyan-700" /> Professional Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 pb-4 text-sm text-slate-700">
            <p>Occupation: {client.occupation || 'Not set'}</p>
            <p>Company: {client.company_name || 'Not set'}</p>
            <p className="flex items-center gap-2">Status: <ClientStatusBadge status={client.status} /></p>
            <p>Client Since: {format(new Date(client.created_at), 'dd MMM yyyy')}</p>
          </CardContent>
        </Card>

        <Card className="glass-panel reveal-item rounded-2xl py-0 md:col-span-2" style={{ ['--stagger' as string]: '150ms' }}>
          <CardHeader className="py-4"><CardTitle className="flex items-center gap-2 text-lg"><MapPin className="h-4 w-4 text-cyan-700" /> Address</CardTitle></CardHeader>
          <CardContent className="pb-4 text-sm text-slate-700">{[client.address, client.city, client.state, client.pincode].filter(Boolean).join(', ') || 'Address not provided'}</CardContent>
        </Card>
      </div>

      <section className="glass-panel reveal-item rounded-2xl p-2 md:p-3" style={{ ['--stagger' as string]: '200ms' }}>
        <div className="mb-3 flex items-center justify-between px-2 pt-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900"><ShieldCheck className="h-4 w-4 text-cyan-700" /> Policies ({policies.length})</h2>
          <Link href="/policies/add" className="text-sm font-semibold text-cyan-700 hover:text-cyan-800">+ Add Policy</Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200/70">
              <TableHead className="text-slate-600">Policy #</TableHead>
              <TableHead className="text-slate-600">Type</TableHead>
              <TableHead className="text-slate-600">Carrier</TableHead>
              <TableHead className="text-slate-600">Premium</TableHead>
              <TableHead className="text-slate-600">Expires</TableHead>
              <TableHead className="text-slate-600">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id} className="border-b border-slate-200/60 bg-white/40 hover:bg-cyan-50/45">
                <TableCell><Link className="font-semibold text-cyan-700 hover:text-cyan-800" href={`/policies/${policy.id}`}>{policy.policy_number}</Link></TableCell>
                <TableCell><PolicyTypeBadge type={policy.policy_type} /></TableCell>
                <TableCell className="text-slate-700">{policy.carrier_name}</TableCell>
                <TableCell className="text-slate-700">₹{Number(policy.premium_amount).toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-slate-600">{format(new Date(policy.expiration_date), 'dd MMM yy')}</TableCell>
                <TableCell><PolicyStatusBadge status={policy.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
