import { z } from 'zod'

const POLICY_TYPES = ['auto', 'home', 'life', 'health', 'commercial', 'liability'] as const
const POLICY_STATUSES = ['active', 'expired', 'cancelled', 'pending', 'renewed'] as const

const optionalNumber = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) return undefined
  return Number(value)
}, z.number().min(0).optional())

export const policySchema = z
  .object({
    client_id: z.string().uuid('Invalid client'),
    policy_type: z.enum(POLICY_TYPES),
    carrier_name: z.string().min(2, 'Carrier name is required').max(100),
    premium_amount: z.coerce.number().min(0, 'Premium must be 0 or more'),
    coverage_amount: optionalNumber,
    deductible: optionalNumber,
    effective_date: z.string().min(1, 'Effective date is required'),
    expiration_date: z.string().min(1, 'Expiration date is required'),
    status: z.enum(POLICY_STATUSES).default('active'),
    notes: z.string().max(500).optional().or(z.literal('')),
  })
  .refine((data) => {
    if (data.effective_date && data.expiration_date) {
      return new Date(data.expiration_date) > new Date(data.effective_date)
    }
    return true
  }, {
    message: 'Expiration date must be after effective date',
    path: ['expiration_date'],
  })

export type PolicyInput = z.infer<typeof policySchema>
