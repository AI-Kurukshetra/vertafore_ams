import Link from 'next/link'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { Sparkles, Users, FileCheck, CalendarClock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import StatsCard from '@/components/dashboard/StatsCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type SearchParamValue = string | string[] | undefined
type DashboardPageProps = {
  searchParams?: Promise<Record<string, SearchParamValue>> | Record<string, SearchParamValue>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = searchParams instanceof Promise ? await searchParams : (searchParams ?? {})
  const authParam = resolvedSearchParams.auth
  const authState = Array.isArray(authParam) ? authParam[0] : authParam

  const supabase = await createClient()

  const [clientsRes, policiesRes] = await Promise.all([
    supabase.from('clients').select('*').order('created_at', { ascending: false }),
    supabase.from('policies').select('*, client:clients(*)').order('created_at', { ascending: false }),
  ])

  const clients = clientsRes.data || []
  const policies = policiesRes.data || []

  const monthStart = startOfMonth(new Date())
  const monthEnd = endOfMonth(new Date())
  const currentTimestamp = new Date().getTime()

  const expiringThisMonth = policies.filter((p) => {
    const d = new Date(p.expiration_date)
    return d >= monthStart && d <= monthEnd
  }).length

  const totalAnnualPremium = policies.reduce((sum, p) => sum + Number(p.premium_amount || 0), 0)

  return (
    <div className="space-y-6">
      {authState === 'verified' && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800">
          Email verification successful. Your account is now active.
        </div>
      )}
      {authState === 'success' && (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 px-4 py-3 text-sm text-cyan-800">
          Authentication successful.
        </div>
      )}

      <div className="glass-panel reveal-item rounded-2xl p-5 md:p-6" style={{ ['--stagger' as string]: '20ms' }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
              <Sparkles className="h-3.5 w-3.5" /> Command Center
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Agency Performance Overview</h1>
            <p className="mt-1 text-sm text-slate-600">Track clients, policies, renewals, and annual premium at a glance.</p>
          </div>
          <div className="rounded-xl border border-slate-200/70 bg-white/85 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total Annual Premium</p>
            <p className="text-2xl font-semibold text-slate-900">₹{totalAnnualPremium.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div style={{ ['--stagger' as string]: '70ms' }}><StatsCard title="Total Clients" value={clients.length} tone="cyan" subtitle="Across all statuses" /></div>
        <div style={{ ['--stagger' as string]: '120ms' }}><StatsCard title="Active Clients" value={clients.filter((c) => c.status === 'active').length} tone="emerald" subtitle="Currently retained" /></div>
        <div style={{ ['--stagger' as string]: '170ms' }}><StatsCard title="Active Policies" value={policies.filter((p) => p.status === 'active').length} tone="cyan" subtitle="In-force coverage" /></div>
        <div style={{ ['--stagger' as string]: '220ms' }}><StatsCard title="Expiring This Month" value={expiringThisMonth} tone="amber" subtitle="Needs renewal outreach" /></div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="glass-panel hover-float reveal-item rounded-2xl border-slate-200/70 py-0" style={{ ['--stagger' as string]: '240ms' }}>
          <CardHeader className="py-4">
            <CardTitle className="flex items-center gap-2 text-slate-900"><Users className="h-4 w-4 text-cyan-700" /> Recent Clients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            {clients.slice(0, 5).map((client) => (
                <Link key={client.id} href={`/clients/${client.id}`} className="block rounded-xl border border-slate-200/70 bg-white/85 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-sm">
                <p className="font-semibold text-slate-900">{client.first_name} {client.last_name}</p>
                <p className="text-sm text-slate-600">{client.client_id} • {client.email}</p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel hover-float reveal-item rounded-2xl border-slate-200/70 py-0" style={{ ['--stagger' as string]: '290ms' }}>
          <CardHeader className="py-4">
            <CardTitle className="flex items-center gap-2 text-slate-900"><CalendarClock className="h-4 w-4 text-amber-600" /> Expiring Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pb-4">
            {policies
              .filter((policy) => {
                const expiry = new Date(policy.expiration_date)
                const diff = (expiry.getTime() - currentTimestamp) / (1000 * 60 * 60 * 24)
                return diff >= 0 && diff <= 30
              })
              .slice(0, 5)
              .map((policy) => (
                <Link key={policy.id} href={`/policies/${policy.id}`} className="block rounded-xl border border-slate-200/70 bg-white/85 p-3 transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-sm">
                  <p className="font-semibold text-slate-900">{policy.policy_number} • {policy.carrier_name}</p>
                  <p className="text-sm text-slate-600">Expires {format(new Date(policy.expiration_date), 'dd MMM yyyy')}</p>
                </Link>
              ))}
            {policies.filter((policy) => {
              const expiry = new Date(policy.expiration_date)
              const diff = (expiry.getTime() - currentTimestamp) / (1000 * 60 * 60 * 24)
              return diff >= 0 && diff <= 30
            }).length === 0 && (
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3 py-4 text-sm text-emerald-800">
                <p className="flex items-center gap-2"><FileCheck className="h-4 w-4" />No policies expiring in the next 30 days.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
