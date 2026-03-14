import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '@/lib/validations/auth'

describe('loginSchema', () => {
  it('valid credentials pass', () => {
    expect(loginSchema.safeParse({ email: 'test@test.com', password: 'Pass1' }).success).toBe(true)
  })
  it('empty email fails', () => {
    const r = loginSchema.safeParse({ email: '', password: 'Pass1' })
    expect(r.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const valid = {
    full_name: 'Rohan Agent',
    email: 'rohan@test.com',
    password: 'Password1',
    confirm_password: 'Password1',
  }

  it('valid data passes', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })

  it('mismatched passwords fail', () => {
    const r = registerSchema.safeParse({ ...valid, confirm_password: 'Different1' })
    expect(r.success).toBe(false)
  })
})
