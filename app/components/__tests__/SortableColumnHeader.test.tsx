import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SortableColumnHeader from '../SortableColumnHeader'

const mockSearchParams = { value: new URLSearchParams('sort=market_cap_desc&page=2') }

vi.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams.value,
  usePathname: () => '/',
}))

describe('SortableColumnHeader', () => {
  it('renders column label', () => {
    mockSearchParams.value = new URLSearchParams('sort=market_cap_desc&page=2')
    render(
      <SortableColumnHeader label="Market Cap" defaultSortKey="market_cap_desc" toggleSortKey="market_cap_asc" />
    )
    expect(screen.getByText(/Market Cap/)).toBeInTheDocument()
  })

  it('shows ↓ indicator when active column is sorted _desc', () => {
    mockSearchParams.value = new URLSearchParams('sort=market_cap_desc&page=1')
    render(
      <SortableColumnHeader label="Market Cap" defaultSortKey="market_cap_desc" toggleSortKey="market_cap_asc" />
    )
    expect(screen.getByText('↓')).toBeInTheDocument()
  })

  it('shows ↑ indicator when active column is sorted _asc', () => {
    mockSearchParams.value = new URLSearchParams('sort=market_cap_asc&page=1')
    render(
      <SortableColumnHeader label="Market Cap" defaultSortKey="market_cap_desc" toggleSortKey="market_cap_asc" />
    )
    expect(screen.getByText('↑')).toBeInTheDocument()
  })

  it('does not show indicator for inactive sort column', () => {
    mockSearchParams.value = new URLSearchParams('sort=market_cap_desc&page=1')
    render(
      <SortableColumnHeader label="Volume" defaultSortKey="volume_desc" toggleSortKey="volume_asc" />
    )
    expect(screen.queryByText(/↓|↑/)).not.toBeInTheDocument()
  })

  it('inactive column link points to its defaultSortKey', () => {
    mockSearchParams.value = new URLSearchParams('sort=market_cap_desc&page=1')
    render(
      <SortableColumnHeader label="Volume" defaultSortKey="volume_desc" toggleSortKey="volume_asc" />
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', expect.stringContaining('sort=volume_desc'))
    expect(link).toHaveAttribute('href', expect.stringContaining('page=1'))
  })

  it('active column on defaultSortKey links to toggleSortKey', () => {
    mockSearchParams.value = new URLSearchParams('sort=market_cap_desc&page=1')
    render(
      <SortableColumnHeader label="Market Cap" defaultSortKey="market_cap_desc" toggleSortKey="market_cap_asc" />
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', expect.stringContaining('sort=market_cap_asc'))
  })

  it('active column on toggleSortKey links back to defaultSortKey', () => {
    mockSearchParams.value = new URLSearchParams('sort=market_cap_asc&page=1')
    render(
      <SortableColumnHeader label="Market Cap" defaultSortKey="market_cap_desc" toggleSortKey="market_cap_asc" />
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', expect.stringContaining('sort=market_cap_desc'))
  })
})
