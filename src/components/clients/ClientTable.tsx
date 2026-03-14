'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { Loader2, Search, X } from 'lucide-react'
import type { Client, ClientStatus, Gender } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button, buttonVariants } from '@/components/ui/button'
import ClientStatusBadge from '@/components/clients/ClientStatusBadge'
import ClientCard from '@/components/clients/ClientCard'
import DeleteClientDialog from '@/components/clients/DeleteClientDialog'

export default function ClientTable({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ClientStatus | 'all'>('all')
  const [gender, setGender] = useState<Gender | 'all'>('all')
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return clients.filter((c) => {
      const inSearch = [c.client_id, c.first_name, c.last_name, c.email, c.company_name || ''].some((v) => v.toLowerCase().includes(q))
      const inStatus = status === 'all' || c.status === status
      const inGender = gender === 'all' || c.gender === gender
      return inSearch && inStatus && inGender
    })
  }, [clients, search, status, gender])

  const update = (setter: (v: never) => void, value: string | null) => {
    startTransition(() => setter((value ?? 'all') as never))
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('all')
    setGender('all')
  }

  return (
    <div className="space-y-4">
      <div className="animated-border p-[1px] rounded-2xl reveal-item" style={{ ['--stagger' as string]: '40ms' }}>
        <div className="glass-panel rounded-2xl p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative md:max-w-md md:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search by name, email, ID..." value={search} onChange={(e) => update(setSearch as never, e.target.value)} className="h-11 rounded-xl border-slate-200 bg-white/85 pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => update(setStatus as never, v)}>
            <SelectTrigger className="h-11 min-w-40 rounded-xl border-slate-200 bg-white/85"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="churned">Churned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={gender} onValueChange={(v) => update(setGender as never, v)}>
            <SelectTrigger className="h-11 min-w-40 rounded-xl border-slate-200 bg-white/85"><SelectValue placeholder="Gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Gender</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" size="sm" onClick={clearFilters}><X className="h-4 w-4" /> Clear</Button>
        </div>
        </div>
      </div>

      <p className="text-sm text-slate-600">Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of {clients.length} clients</p>

      <div className="md:hidden space-y-3">
        {filtered.map((client) => <ClientCard key={client.id} client={client} />)}
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
              <TableHead className="text-slate-600">Client ID</TableHead>
              <TableHead className="text-slate-600">Name</TableHead>
              <TableHead className="text-slate-600">Email</TableHead>
              <TableHead className="text-slate-600">Company</TableHead>
              <TableHead className="text-slate-600">Status</TableHead>
              <TableHead className="text-slate-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((client, idx) => (
              <TableRow key={client.id} className="reveal-item border-b border-slate-200/60 bg-white/40 hover:bg-cyan-50/45" style={{ ['--stagger' as string]: `${120 + idx * 24}ms` }}>
                <TableCell className="font-medium text-slate-700">{client.client_id}</TableCell>
                <TableCell className="font-semibold text-slate-900">{client.first_name} {client.last_name}</TableCell>
                <TableCell className="text-slate-600">{client.email}</TableCell>
                <TableCell className="text-slate-600">{client.company_name || 'N/A'}</TableCell>
                <TableCell><ClientStatusBadge status={client.status} /></TableCell>
                <TableCell className="space-x-2">
                  <Link className={buttonVariants({ size: 'sm', variant: 'outline' })} href={`/clients/${client.id}`}>View</Link>
                  <Link className={buttonVariants({ size: 'sm', variant: 'outline' })} href={`/clients/${client.id}/edit`}>Edit</Link>
                  <DeleteClientDialog clientId={client.id} label={`\"${client.first_name} ${client.last_name}\" (${client.client_id})`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
