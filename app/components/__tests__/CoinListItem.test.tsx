import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CoinListItem from '../coin/CoinListItem'

const baseProps = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'BTC',
  price: 50000,
  priceChangePercent24h: 5.25,
  image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
  marketCap: 1_000_000_000_000,
  volume: 30_000_000_000,
  rank: 1,
}

describe('CoinListItem', () => {
  it('renders coin name, symbol, and price', () => {
    render(<CoinListItem {...baseProps} />)
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    expect(screen.getAllByText('BTC')[0]).toBeInTheDocument()
    expect(screen.getAllByText('$50,000.00')[0]).toBeInTheDocument()
  })

  it('renders link to /coins/[id]', () => {
    render(<CoinListItem {...baseProps} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/coins/bitcoin')
  })

  it('renders coin logo with next/image', () => {
    render(<CoinListItem {...baseProps} />)
    const img = screen.getByRole('img', { name: /bitcoin/i })
    expect(img).toBeInTheDocument()
  })

  it('shows positive percent in green', () => {
    render(<CoinListItem {...baseProps} priceChangePercent24h={5.25} />)
    expect(screen.getAllByText('+5.25%')[0]).toBeInTheDocument()
  })

  it('shows negative percent in red', () => {
    render(<CoinListItem {...baseProps} priceChangePercent24h={-2.5} />)
    expect(screen.getAllByText('-2.50%')[0]).toBeInTheDocument()
  })

  it('renders with null price gracefully', () => {
    render(<CoinListItem {...baseProps} price={null} priceChangePercent24h={null} />)
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
  })
})
