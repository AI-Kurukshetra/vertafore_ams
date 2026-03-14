'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { policySchema } from '@/lib/validations/policy'

export type PolicyActionState = {
  error?: string
  fieldErrors?: Record<string, string[]>
}

function nullableNumber(value: FormDataEntryValue | null) {
  if (!value) return null
  const str = String(value).trim()
  if (!str) return null
  const num = Number(str)
  return Number.isNaN(num) ? null : num
}

export async function addPolicyAction(_prev: PolicyActionState, formData: FormData): Promise<PolicyActionState> {
  const parsed = policySchema.safeParse({
    client_id: formData.get('client_id'),
    policy_type: formData.get('policy_type'),
    carrier_name: formData.get('carrier_name'),
    premium_amount: formData.get('premium_amount'),
    coverage_amount: formData.get('coverage_amount') || undefined,
    deductible: formData.get('deductible') || undefined,
    effective_date: formData.get('effective_date'),
    expiration_date: formData.get('expiration_date'),
    status: formData.get('status') || 'active',
    notes: formData.get('notes') || '',
  })

  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors }

  const supabase = await createClient()
  const [{ count }, userResult] = await Promise.all([
    supabase.from('policies').select('*', { count: 'exact', head: true }),
    supabase.auth.getUser(),
  ])

  const policyNumber = `POL-${String((count ?? 0) + 1).padStart(3, '0')}`

  const { error } = await supabase.from('policies').insert({
    ...parsed.data,
    policy_number: policyNumber,
    created_by: userResult.data.user?.id ?? null,
    coverage_amount: nullableNumber(formData.get('coverage_amount')),
    deductible: nullableNumber(formData.get('deductible')),
    notes: String(formData.get('notes') || '').trim() || null,
  })

  if (error) return { error: error.message }

  revalidatePath('/policies')
  redirect('/policies?success=policy-added')
}

export async function updatePolicyAction(id: string, _prev: PolicyActionState, formData: FormData): Promise<PolicyActionState> {
  const parsed = policySchema.safeParse({
    client_id: formData.get('client_id'),
    policy_type: formData.get('policy_type'),
    carrier_name: formData.get('carrier_name'),
    premium_amount: formData.get('premium_amount'),
    coverage_amount: formData.get('coverage_amount') || undefined,
    deductible: formData.get('deductible') || undefined,
    effective_date: formData.get('effective_date'),
    expiration_date: formData.get('expiration_date'),
    status: formData.get('status') || 'active',
    notes: formData.get('notes') || '',
  })

  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase
    .from('policies')
    .update({
      ...parsed.data,
      coverage_amount: nullableNumber(formData.get('coverage_amount')),
      deductible: nullableNumber(formData.get('deductible')),
      notes: String(formData.get('notes') || '').trim() || null,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/policies')
  revalidatePath(`/policies/${id}`)
  redirect(`/policies/${id}?success=policy-updated`)
}

export async function deletePolicyAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('policies').delete().eq('id', id)
  if (error) {
    throw new Error(error.message)
  }
  revalidatePath('/policies')
  redirect('/policies?success=policy-deleted')
}
