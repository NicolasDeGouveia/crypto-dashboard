import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PriceChangeTable from '../coin/PriceChangeTable'

describe('PriceChangeTable', () => {
  const props = {
    change24h: 2.5,
    change7d: -5.1,
    change30d: 10.3,
  }

  it('renders period labels', () => {
    render(<PriceChangeTable {...props} />)
    expect(screen.getByText('24h')).toBeInTheDocument()
    expect(screen.getByText('7d')).toBeInTheDocument()
    expect(screen.getByText('30d')).toBeInTheDocument()
  })

  it('renders positive values with + prefix', () => {
    render(<PriceChangeTable {...props} />)
    expect(screen.getByText('+2.50%')).toBeInTheDocument()
    expect(screen.getByText('+10.30%')).toBeInTheDocument()
  })

  it('renders negative values with - prefix', () => {
    render(<PriceChangeTable {...props} />)
    expect(screen.getByText('-5.10%')).toBeInTheDocument()
  })

  it('renders em dash for null values', () => {
    render(<PriceChangeTable change24h={null} change7d={null} change30d={null} />)
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThanOrEqual(3)
  })
})
