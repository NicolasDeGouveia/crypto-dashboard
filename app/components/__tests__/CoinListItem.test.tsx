import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CoinListItem from '../CoinListItem'

describe('CoinListItem', () => {
  it('should render all coin information', () => {
    render(
      <CoinListItem
        id="bitcoin"
        name="Bitcoin"
        symbol="BTC"
        price={50000.00}
        percent={5.25}
      />
    )

    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    expect(screen.getAllByText('BTC')[0]).toBeInTheDocument()
    expect(screen.getAllByText('$50,000.00')[0]).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/coins/bitcoin')
  })
})
