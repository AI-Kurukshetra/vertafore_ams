import { describe, it, expect } from 'vitest'
import { policySchema } from '@/lib/validations/policy'

const valid = {
  client_id: '550e8400-e29b-41d4-a716-446655440000',
  policy_type: 'auto' as const,
  carrier_name: 'ICICI Lombard',
  premium_amount: 12500,
  effective_date: '2025-01-01',
  expiration_date: '2026-01-01',
  status: 'active' as const,
}

describe('policySchema', () => {
  it('valid policy passes', () => {
    expect(policySchema.safeParse(valid).success).toBe(true)
  })

  it('expiration before effective fails', () => {
    const r = policySchema.safeParse({ ...valid, expiration_date: '2024-01-01' })
    expect(r.success).toBe(false)
  })
})
