import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoginForm from '@/components/auth/LoginForm'

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })
})
