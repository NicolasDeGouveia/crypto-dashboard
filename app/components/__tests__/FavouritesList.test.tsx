import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

vi.mock('@/app/_actions/favourites', () => ({
  addFavourite: vi.fn(),
  removeFavourite: vi.fn(),
}))

import FavouritesList from '../FavouritesList'
import type { CoinMarketSummary } from '@/app/_lib/types'

const mockCoins: CoinMarketSummary[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 50000,
    market_cap: 1_000_000_000_000,
    market_cap_rank: 1,
    total_volume: 30_000_000_000,
    price_change_percentage_24h: 2.5,
    circulating_supply: 19_000_000,
    total_supply: 21_000_000,
    max_supply: 21_000_000,
    ath: 69000,
    ath_date: '2021-11-10',
  },
]

describe('FavouritesList', () => {
  it('renders list of favourite coins', () => {
    render(
      <FavouritesList
        coins={mockCoins}
        favouriteIds={['bitcoin']}
        isAuthenticated={true}
      />
    )
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
  })

  it('shows empty state with link when list is empty', () => {
    render(
      <FavouritesList
        coins={[]}
        favouriteIds={[]}
        isAuthenticated={true}
      />
    )
    expect(screen.getByText(/no favourites/i)).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/')
  })

  it('shows data unavailable for coin with null price', () => {
    const coinsWithNull = [{ ...mockCoins[0], current_price: null }]
    render(
      <FavouritesList
        coins={coinsWithNull}
        favouriteIds={['bitcoin']}
        isAuthenticated={true}
      />
    )
    expect(screen.getByText(/unavailable/i)).toBeInTheDocument()
  })
})
