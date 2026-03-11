import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock the db and auth modules before importing RegisterForm,
// so that the DATABASE_URL guard in db/index.ts does not throw.
vi.mock('@/app/_lib/db', () => ({ db: {} }))
vi.mock('@/app/_lib/auth', () => ({
  auth: vi.fn().mockResolvedValue(null),
  signIn: vi.fn(),
}))
vi.mock('@/app/_actions/auth', () => ({
  register: vi.fn().mockResolvedValue({ success: true }),
}))

import RegisterForm from '../auth/RegisterForm'

describe('RegisterForm', () => {
  it('renders email and password fields', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<RegisterForm />)
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('shows client-side error for password < 8 chars on submit', async () => {
    render(<RegisterForm />)
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'short' },
    })
    fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form')!)
    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument()
  })

  it('shows link to login page', () => {
    render(<RegisterForm />)
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
  })
})
