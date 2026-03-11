import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import UserNav from '../UserNav'

// UserNav is a Server Component that calls auth() — mock it
vi.mock('@/app/_lib/auth', () => ({
  auth: vi.fn(),
  signOut: vi.fn(),
}))

describe('UserNav', () => {
  it('renders Login link when no session', async () => {
    const { auth } = await import('@/app/_lib/auth')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(auth as any).mockResolvedValue(null)

    const Component = await UserNav()
    render(Component)
    expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/login')
  })

  it('renders user email when session is active', async () => {
    const { auth } = await import('@/app/_lib/auth')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1', email: 'alice@example.com', name: 'Alice' },
      expires: '2099-01-01',
    } as never)

    const Component = await UserNav()
    render(Component)
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('renders Log out button when session is active', async () => {
    const { auth } = await import('@/app/_lib/auth')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1', email: 'alice@example.com', name: 'Alice' },
      expires: '2099-01-01',
    } as never)

    const Component = await UserNav()
    render(Component)
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument()
  })

  it('renders My Favourites link when session is active', async () => {
    const { auth } = await import('@/app/_lib/auth')
    vi.mocked(auth).mockResolvedValue({
      user: { id: 'user-1', email: 'alice@example.com', name: 'Alice' },
      expires: '2099-01-01',
    } as never)

    const Component = await UserNav()
    render(Component)
    expect(screen.getByRole('link', { name: /my favourites/i })).toHaveAttribute('href', '/favourites')
  })
})
