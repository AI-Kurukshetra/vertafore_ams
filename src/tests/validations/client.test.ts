import { describe, it, expect } from 'vitest'
import { clientSchema } from '@/lib/validations/client'

const valid = {
  first_name: 'Aarav',
  last_name: 'Shah',
  email: 'aarav.shah@gmail.com',
  status: 'active',
}

describe('clientSchema', () => {
  it('valid client passes', () => {
    expect(clientSchema.safeParse(valid).success).toBe(true)
  })

  it('invalid email fails', () => {
    expect(clientSchema.safeParse({ ...valid, email: 'notanemail' }).success).toBe(false)
  })
})
