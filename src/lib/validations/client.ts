import { z } from 'zod'

const CLIENT_STATUSES = ['active', 'inactive', 'prospect', 'churned'] as const
const GENDERS = ['male', 'female', 'other'] as const

export const clientSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters').max(50),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number').optional().or(z.literal('')),
  date_of_birth: z.string().optional().or(z.literal('')),
  gender: z.enum(GENDERS).optional(),
  address: z.string().max(200).optional().or(z.literal('')),
  city: z.string().max(50).optional().or(z.literal('')),
  state: z.string().max(50).optional().or(z.literal('')),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode').optional().or(z.literal('')),
  occupation: z.string().max(100).optional().or(z.literal('')),
  company_name: z.string().max(100).optional().or(z.literal('')),
  status: z.enum(CLIENT_STATUSES).default('active'),
  notes: z.string().max(500).optional().or(z.literal('')),
})

export type ClientInput = z.infer<typeof clientSchema>
