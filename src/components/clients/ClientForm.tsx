'use client'

import { useActionState } from 'react'
import { Loader2, UserRound, Building2, MapPin, FileText } from 'lucide-react'
import type { Client } from '@/types'
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

export default function ClientForm({ action, initialData, submitText = 'Add Client' }: {
  action: (state: State, formData: FormData) => Promise<State>
  initialData?: Partial<Client>
  submitText?: string
}) {
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <Section title="Personal Information" icon={UserRound}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div><Label>First Name*</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" name="first_name" defaultValue={initialData?.first_name || ''} required /></div>
          <div><Label>Last Name*</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" name="last_name" defaultValue={initialData?.last_name || ''} required /></div>
          <div><Label>Email*</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" name="email" type="email" defaultValue={initialData?.email || ''} required /></div>
          <div><Label>Phone</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" name="phone" defaultValue={initialData?.phone || ''} /></div>
          <div><Label>Date of Birth</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" name="date_of_birth" type="date" defaultValue={initialData?.date_of_birth || ''} /></div>
          <div>
            <Label>Gender</Label>
            <Select name="gender" defaultValue={initialData?.gender || undefined}>
              <SelectTrigger className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85"><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Professional Information" icon={Building2}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div><Label>Occupation</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" name="occupation" defaultValue={initialData?.occupation || ''} /></div>
          <div><Label>Company Name</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" name="company_name" defaultValue={initialData?.company_name || ''} /></div>
          <div>
            <Label>Status</Label>
            <Select name="status" defaultValue={initialData?.status || 'active'}>
              <SelectTrigger className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="churned">Churned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section title="Address" icon={MapPin}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2"><Label>Address</Label><Textarea className="mt-1 rounded-xl border-slate-200 bg-white/85" name="address" defaultValue={initialData?.address || ''} /></div>
          <div><Label>City</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" name="city" defaultValue={initialData?.city || ''} /></div>
          <div><Label>State</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" name="state" defaultValue={initialData?.state || ''} /></div>
          <div><Label>Pincode</Label><Input className="mt-1 h-11 rounded-xl border-slate-200 bg-white/85" name="pincode" defaultValue={initialData?.pincode || ''} /></div>
        </div>
      </Section>

      <Section title="Additional Notes" icon={FileText}>
        <div><Textarea className="rounded-xl border-slate-200 bg-white/85" name="notes" defaultValue={initialData?.notes || ''} /></div>
      </Section>

      {state.error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending} className="min-w-40">
          {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{submitText.includes('Save') ? 'Saving changes...' : 'Adding client...'}</> : submitText}
        </Button>
      </div>
    </form>
  )
}
