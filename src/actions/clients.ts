'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { clientSchema } from '@/lib/validations/client'

export type EntityActionState = {
  error?: string
  fieldErrors?: Record<string, string[]>
}

function normalizeOptional(value: FormDataEntryValue | null) {
  if (!value) return null
  const str = String(value).trim()
  return str.length > 0 ? str : null
}

export async function addClientAction(_prev: EntityActionState, formData: FormData): Promise<EntityActionState> {
  const parsed = clientSchema.safeParse({
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    date_of_birth: formData.get('date_of_birth'),
    gender: formData.get('gender') || undefined,
    address: formData.get('address'),
    city: formData.get('city'),
    state: formData.get('state'),
    pincode: formData.get('pincode'),
    occupation: formData.get('occupation'),
    company_name: formData.get('company_name'),
    status: formData.get('status') || 'active',
    notes: formData.get('notes'),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const [{ count }, userResult] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.auth.getUser(),
  ])

  const clientId = `CLT-${String((count ?? 0) + 1).padStart(3, '0')}`

  const { error } = await supabase.from('clients').insert({
    ...parsed.data,
    client_id: clientId,
    created_by: userResult.data.user?.id ?? null,
    phone: normalizeOptional(formData.get('phone')),
    date_of_birth: normalizeOptional(formData.get('date_of_birth')),
    address: normalizeOptional(formData.get('address')),
    city: normalizeOptional(formData.get('city')),
    state: normalizeOptional(formData.get('state')),
    pincode: normalizeOptional(formData.get('pincode')),
    occupation: normalizeOptional(formData.get('occupation')),
    company_name: normalizeOptional(formData.get('company_name')),
    notes: normalizeOptional(formData.get('notes')),
  })

  if (error) return { error: error.message }

  revalidatePath('/clients')
  redirect('/clients?success=client-added')
}

export async function updateClientAction(id: string, _prev: EntityActionState, formData: FormData): Promise<EntityActionState> {
  const parsed = clientSchema.safeParse({
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    date_of_birth: formData.get('date_of_birth'),
    gender: formData.get('gender') || undefined,
    address: formData.get('address'),
    city: formData.get('city'),
    state: formData.get('state'),
    pincode: formData.get('pincode'),
    occupation: formData.get('occupation'),
    company_name: formData.get('company_name'),
    status: formData.get('status') || 'active',
    notes: formData.get('notes'),
  })

  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase
    .from('clients')
    .update({
      ...parsed.data,
      phone: normalizeOptional(formData.get('phone')),
      date_of_birth: normalizeOptional(formData.get('date_of_birth')),
      address: normalizeOptional(formData.get('address')),
      city: normalizeOptional(formData.get('city')),
      state: normalizeOptional(formData.get('state')),
      pincode: normalizeOptional(formData.get('pincode')),
      occupation: normalizeOptional(formData.get('occupation')),
      company_name: normalizeOptional(formData.get('company_name')),
      notes: normalizeOptional(formData.get('notes')),
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/clients')
  revalidatePath(`/clients/${id}`)
  redirect(`/clients/${id}?success=client-updated`)
}

export async function deleteClientAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) {
    throw new Error(error.message)
  }
  revalidatePath('/clients')
  redirect('/clients?success=client-deleted')
}
