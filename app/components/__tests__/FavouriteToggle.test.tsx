import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@/app/_lib/db', () => ({ db: {} }))
vi.mock('@/app/_lib/auth', () => ({
  auth: vi.fn().mockResolvedValue(null),
}))
vi.mock('@/app/_actions/favourites', () => ({
  addFavourite: vi.fn().mockResolvedValue({ success: true }),
  removeFavourite: vi.fn().mockResolvedValue({ success: true }),
}))

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

import FavouriteToggle from '../FavouriteToggle'
import { addFavourite, removeFavourite } from '@/app/_actions/favourites'

describe('FavouriteToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPush.mockClear()
  })

  it('renders filled icon when isFavourited is true', () => {
    render(<FavouriteToggle coinId="bitcoin" isFavourited={true} isAuthenticated={true} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', expect.stringContaining('Remove'))
  })

  it('renders outline icon when isFavourited is false', () => {
    render(<FavouriteToggle coinId="bitcoin" isFavourited={false} isAuthenticated={true} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', expect.stringContaining('Add'))
  })

  it('calls addFavourite when not favourited and authenticated', async () => {
    render(<FavouriteToggle coinId="bitcoin" isFavourited={false} isAuthenticated={true} />)
    fireEvent.click(screen.getByRole('button'))
    await vi.waitFor(() => expect(addFavourite).toHaveBeenCalledWith('bitcoin'))
  })

  it('calls removeFavourite when favourited and authenticated', async () => {
    render(<FavouriteToggle coinId="bitcoin" isFavourited={true} isAuthenticated={true} />)
    fireEvent.click(screen.getByRole('button'))
    await vi.waitFor(() => expect(removeFavourite).toHaveBeenCalledWith('bitcoin'))
  })

  it('redirects to /login when unauthenticated', () => {
    render(<FavouriteToggle coinId="bitcoin" isFavourited={false} isAuthenticated={false} />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})
