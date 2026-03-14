'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { Loader2, Search, X } from 'lucide-react'
import type { Policy, PolicyStatus, PolicyType } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button, buttonVariants } from '@/components/ui/button'
import PolicyStatusBadge from '@/components/policies/PolicyStatusBadge'
import PolicyTypeBadge from '@/components/policies/PolicyTypeBadge'
import PolicyCard from '@/components/policies/PolicyCard'
import DeletePolicyDialog from '@/components/policies/DeletePolicyDialog'

export default function PolicyTable({ policies }: { policies: Policy[] }) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<PolicyType | 'all'>('all')
  const [status, setStatus] = useState<PolicyStatus | 'all'>('all')
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return policies.filter((p) => {
      const inSearch = [p.policy_number, p.carrier_name, `${p.client?.first_name || ''} ${p.client?.last_name || ''}`].some((v) => v.toLowerCase().includes(q))
      const inType = type === 'all' || p.policy_type === type
      const inStatus = status === 'all' || p.status === status
      return inSearch && inType && inStatus
    })
  }, [policies, search, type, status])

  const update = (setter: (v: never) => void, value: string | null) => {
    startTransition(() => setter((value ?? 'all') as never))
  }

  const clearFilters = () => {
    setSearch('')
    setType('all')
    setStatus('all')
  }

  return (
    <div className="space-y-4">
      <div className="animated-border p-[1px] rounded-2xl reveal-item" style={{ ['--stagger' as string]: '40ms' }}>
        <div className="glass-panel rounded-2xl p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative md:max-w-md md:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search by policy #, carrier, client..." value={search} onChange={(e) => update(setSearch as never, e.target.value)} className="h-11 rounded-xl border-slate-200 bg-white/85 pl-9" />
          </div>
          <Select value={type} onValueChange={(v) => update(setType as never, v)}>
            <SelectTrigger className="h-11 min-w-40 rounded-xl border-slate-200 bg-white/85"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Type</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="life">Life</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="liability">Liability</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => update(setStatus as never, v)}>
            <SelectTrigger className="h-11 min-w-40 rounded-xl border-slate-200 bg-white/85"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="renewed">Renewed</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" size="sm" onClick={clearFilters}><X className="h-4 w-4" /> Clear</Button>
        </div>
        </div>
      </div>

      <p className="text-sm text-slate-600">Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of {policies.length} policies</p>

      <div className="md:hidden space-y-3">
        {filtered.map((policy) => <PolicyCard key={policy.id} policy={policy} />)}
      </div>

      <div className="hidden md:block relative glass-panel reveal-item rounded-2xl p-2" style={{ ['--stagger' as string]: '100ms' }}>
        {isPending && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-2xl">
            <div className="flex items-center gap-2 text-cyan-700">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Loading...</span>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200/70">
              <TableHead className="text-slate-600">Policy #</TableHead>
              <TableHead className="text-slate-600">Type</TableHead>
              <TableHead className="text-slate-600">Client</TableHead>
              <TableHead className="text-slate-600">Carrier</TableHead>
              <TableHead className="text-slate-600">Premium</TableHead>
              <TableHead className="text-slate-600">Expires</TableHead>
              <TableHead className="text-slate-600">Status</TableHead>
              <TableHead className="text-slate-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((policy, idx) => (
              <TableRow key={policy.id} className="reveal-item border-b border-slate-200/60 bg-white/40 hover:bg-cyan-50/45" style={{ ['--stagger' as string]: `${120 + idx * 24}ms` }}>
                <TableCell><Link href={`/policies/${policy.id}`} className="font-semibold text-cyan-700 hover:text-cyan-800">{policy.policy_number}</Link></TableCell>
                <TableCell><PolicyTypeBadge type={policy.policy_type} /></TableCell>
                <TableCell className="font-semibold text-slate-900">{policy.client?.first_name} {policy.client?.last_name}</TableCell>
                <TableCell className="text-slate-600">{policy.carrier_name}</TableCell>
                <TableCell className="text-slate-700">₹{Number(policy.premium_amount).toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-slate-600">{policy.expiration_date}</TableCell>
                <TableCell><PolicyStatusBadge status={policy.status} /></TableCell>
                <TableCell className="space-x-2">
                  <Link className={buttonVariants({ size: 'sm', variant: 'outline' })} href={`/policies/${policy.id}/edit`}>Edit</Link>
                  <DeletePolicyDialog policyId={policy.id} label={`\"${policy.policy_number}\"`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
