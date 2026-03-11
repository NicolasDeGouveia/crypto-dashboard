import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SortableColumnHeader from '../SortableColumnHeader'

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('sort=market_cap_desc&page=2'),
  usePathname: () => '/',
}))

describe('SortableColumnHeader', () => {
  it('renders column label', () => {
    render(
      <SortableColumnHeader label="Market Cap" sortKey="market_cap_desc" />
    )
    expect(screen.getByText(/Market Cap/)).toBeInTheDocument()
  })

  it('shows directional indicator for active sort column', () => {
    render(
      <SortableColumnHeader label="Market Cap" sortKey="market_cap_desc" />
    )
    expect(screen.getByText(/↓/)).toBeInTheDocument()
  })

  it('link resets page to 1 when sort changes', () => {
    render(
      <SortableColumnHeader label="Volume" sortKey="volume_desc" />
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', expect.stringContaining('page=1'))
    expect(link).toHaveAttribute('href', expect.stringContaining('sort=volume_desc'))
  })

  it('does not show indicator for inactive sort column', () => {
    render(
      <SortableColumnHeader label="Volume" sortKey="volume_desc" />
    )
    // Active sort is market_cap_desc, not volume_desc — no indicator expected
    expect(screen.queryByText(/↓|↑/)).not.toBeInTheDocument()
  })
})
