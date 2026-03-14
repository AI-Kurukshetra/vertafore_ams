import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ClientStatusBadge from '@/components/clients/ClientStatusBadge'

describe('ClientStatusBadge', () => {
  it('renders active badge', () => {
    render(<ClientStatusBadge status="active" />)
    expect(screen.getByText(/active/i)).toBeInTheDocument()
  })
})
