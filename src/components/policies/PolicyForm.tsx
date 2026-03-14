'use client'

import { useActionState } from 'react'
import { CalendarClock, Loader2, NotebookPen, Shield, Wallet } from 'lucide-react'
import type { Client, Policy } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type State = { error?: string; fieldErrors?: Record<string, string[]> }
const initialState: State = {}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section className="glass-panel hover-glow reveal-item rounded-2xl p-4 md:p-5">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-cyan-700" /> {title}
      </h3>
      {children}
    </section>
  )
}

export default function PolicyForm({ action, clients, initialData, submitText = 'Add Policy' }: {
  action: (state: State, formData: FormData) => Promise<State>
  clients: Client[]
  initialData?: Partial<Policy>
  submitText?: string
}) {
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <Section title="Policy Details" icon={Shield}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label>Client*</Label>
            <Select name="client_id" defaultValue={initialData?.client_id || undefined}>
              <SelectTrigger className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85"><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>{client.client_id} {client.first_name} {client.last_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Policy Type*</Label>
            <Select name="policy_type" defaultValue={initialData?.policy_type || undefined}>
              <SelectTrigger className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="life">Life</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="liability">Liability</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Carrier Name*</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" name="carrier_name" defaultValue={initialData?.carrier_name || ''} required /></div>
          <div>
            <Label>Status</Label>
            <Select name="status" defaultValue={initialData?.status || 'active'}>
              <SelectTrigger className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="renewed">Renewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Dates" icon={CalendarClock}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div><Label>Effective Date*</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" type="date" name="effective_date" defaultValue={initialData?.effective_date || ''} required /></div>
          <div><Label>Expiration Date*</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" type="date" name="expiration_date" defaultValue={initialData?.expiration_date || ''} required /></div>
        </div>
      </Section>

      <Section title="Financial Details" icon={Wallet}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div><Label>Annual Premium (₹)*</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" type="number" name="premium_amount" defaultValue={String(initialData?.premium_amount || '')} required /></div>
          <div><Label>Coverage Amount (₹)</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" type="number" name="coverage_amount" defaultValue={String(initialData?.coverage_amount || '')} /></div>
          <div><Label>Deductible (₹)</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" type="number" name="deductible" defaultValue={String(initialData?.deductible || '')} /></div>
        </div>
      </Section>

      <Section title="Additional Notes" icon={NotebookPen}>
        <Textarea className="rounded-xl border-slate-200 bg-white/85" name="notes" defaultValue={initialData?.notes || ''} />
      </Section>

      {state.error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending} className="min-w-40">
          {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{submitText.includes('Save') ? 'Saving changes...' : 'Adding policy...'}</> : submitText}
        </Button>
      </div>
    </form>
  )
}
