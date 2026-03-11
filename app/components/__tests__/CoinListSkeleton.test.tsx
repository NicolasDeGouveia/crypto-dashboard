import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import CoinListSkeleton from '../coin/CoinListSkeleton'
import { PAGE_SIZE } from '@/app/_lib/constants'

describe('CoinListSkeleton', () => {
  it(`renders exactly PAGE_SIZE (${PAGE_SIZE}) skeleton rows`, () => {
    const { container: c } = render(<CoinListSkeleton />)
    // Each skeleton row has a data-testid or a consistent class
    const rows = c.querySelectorAll('[data-testid="skeleton-row"]')
    expect(rows).toHaveLength(PAGE_SIZE)
  })

  it('renders skeleton rows with animate-pulse class', () => {
    const { container: c } = render(<CoinListSkeleton />)
    const pulseElements = c.querySelectorAll('.animate-pulse')
    expect(pulseElements.length).toBeGreaterThan(0)
  })
})
