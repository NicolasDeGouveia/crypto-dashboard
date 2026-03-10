import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoginForm from '../LoginForm'

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows error message when error prop is passed', () => {
    render(<LoginForm error="Invalid email or password." />)
    expect(screen.getByText('Invalid email or password.')).toBeInTheDocument()
  })

  it('shows link to register page', () => {
    render(<LoginForm />)
    expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute('href', '/register')
  })
})
