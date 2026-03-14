import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PolicyStatusBadge from '@/components/policies/PolicyStatusBadge'

describe('PolicyStatusBadge', () => {
  it('renders expired badge', () => {
    render(<PolicyStatusBadge status="expired" />)
    const badge = screen.getByText(/expired/i)
    expect(badge.className).toContain('red')
  })
})
