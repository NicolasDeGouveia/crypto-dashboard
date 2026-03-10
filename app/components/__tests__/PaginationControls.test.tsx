import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PaginationControls from '../PaginationControls'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=2'),
  usePathname: () => '/',
}))

describe('PaginationControls', () => {
  it('renders Prev and Next buttons', () => {
    render(<PaginationControls currentPage={2} totalPages={5} />)
    expect(screen.getByText('← Prev')).toBeInTheDocument()
    expect(screen.getByText('Next →')).toBeInTheDocument()
  })

  it('Prev link has correct ?page= URL', () => {
    render(<PaginationControls currentPage={2} totalPages={5} />)
    const prevLink = screen.getByText('← Prev').closest('a')
    expect(prevLink).toHaveAttribute('href', expect.stringContaining('page=1'))
  })

  it('Next link has correct ?page= URL', () => {
    render(<PaginationControls currentPage={2} totalPages={5} />)
    const nextLink = screen.getByText('Next →').closest('a')
    expect(nextLink).toHaveAttribute('href', expect.stringContaining('page=3'))
  })

  it('disables Prev on page 1', () => {
    render(<PaginationControls currentPage={1} totalPages={5} />)
    const prevLink = screen.getByText('← Prev').closest('a, span')
    expect(prevLink?.tagName).not.toBe('A')
  })

  it('disables Next on last page', () => {
    render(<PaginationControls currentPage={5} totalPages={5} />)
    const nextLink = screen.getByText('Next →').closest('a, span')
    expect(nextLink?.tagName).not.toBe('A')
  })
})
