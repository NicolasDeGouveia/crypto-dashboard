import { describe, it, expect } from 'vitest'
import { formatPrice, formatMarketCap, formatVolume, formatSupply, formatPercent, formatDate, sortCoins } from '../utils'

describe('formatPrice', () => {
  it('should format regular prices correctly', () => {
    expect(formatPrice(1234.56)).toBe('$1,234.56')
    expect(formatPrice(50)).toBe('$50.00')
    expect(formatPrice(0.99)).toBe('$0.99')
  })

  it('should format large numbers with thousands separator', () => {
    expect(formatPrice(1000000)).toBe('$1,000,000.00')
    expect(formatPrice(50000.123)).toBe('$50,000.12')
  })
})

describe('formatMarketCap', () => {
  it('formats trillions correctly', () => {
    expect(formatMarketCap(1_230_000_000_000)).toBe('$1.23T')
    expect(formatMarketCap(1_000_000_000_000)).toBe('$1.00T')
  })

  it('formats billions correctly', () => {
    expect(formatMarketCap(456_700_000_000)).toBe('$456.70B')
    expect(formatMarketCap(1_500_000_000)).toBe('$1.50B')
  })

  it('formats millions correctly', () => {
    expect(formatMarketCap(123_400_000)).toBe('$123.40M')
  })

  it('formats small values without suffix', () => {
    expect(formatMarketCap(500_000)).toBe('$500,000')
  })
})

describe('formatVolume', () => {
  it('formats large volumes in billions', () => {
    expect(formatVolume(30_000_000_000)).toBe('$30.00B')
  })

  it('formats millions', () => {
    expect(formatVolume(5_000_000)).toBe('$5.00M')
  })
})

describe('formatSupply', () => {
  it('returns em dash for null', () => {
    expect(formatSupply(null)).toBe('—')
  })

  it('formats millions with M suffix', () => {
    expect(formatSupply(19_000_000)).toBe('19.00M')
  })

  it('formats billions with B suffix', () => {
    expect(formatSupply(1_000_000_000)).toBe('1.00B')
  })
})

describe('formatPercent', () => {
  it('formats positive percent with + prefix', () => {
    expect(formatPercent(5.25)).toBe('+5.25%')
  })

  it('formats negative percent without extra minus', () => {
    expect(formatPercent(-2.5)).toBe('-2.50%')
  })

  it('formats zero as positive', () => {
    expect(formatPercent(0)).toBe('+0.00%')
  })
})

describe('formatDate', () => {
  it('formats ISO date string to locale date', () => {
    const result = formatDate('2021-11-10T14:24:11.849Z')
    expect(result).toMatch(/Nov|11/)  // locale-agnostic check
  })
})

describe('sortCoins', () => {
  const coins = [
    { name: 'Solana', current_price: 100 },
    { name: 'Bitcoin', current_price: 60000 },
    { name: 'Ethereum', current_price: 3000 },
    { name: 'Dogecoin', current_price: 0.1 },
    { name: 'Cardano', current_price: 0.5 },
  ]

  it('sorts name_asc A→Z', () => {
    const result = sortCoins(coins, 'name_asc')
    expect(result.map((c) => c.name)).toEqual([
      'Bitcoin', 'Cardano', 'Dogecoin', 'Ethereum', 'Solana',
    ])
  })

  it('sorts name_desc Z→A', () => {
    const result = sortCoins(coins, 'name_desc')
    expect(result.map((c) => c.name)).toEqual([
      'Solana', 'Ethereum', 'Dogecoin', 'Cardano', 'Bitcoin',
    ])
  })

  it('sorts price_asc lowest→highest', () => {
    const result = sortCoins(coins, 'price_asc')
    expect(result.map((c) => c.current_price)).toEqual([0.1, 0.5, 100, 3000, 60000])
  })

  it('sorts price_desc highest→lowest', () => {
    const result = sortCoins(coins, 'price_desc')
    expect(result.map((c) => c.current_price)).toEqual([60000, 3000, 100, 0.5, 0.1])
  })

  it('places null prices at the bottom regardless of direction', () => {
    const withNull = [
      { name: 'A', current_price: 100 },
      { name: 'B', current_price: null },
      { name: 'C', current_price: 50 },
    ]
    const asc = sortCoins(withNull, 'price_asc')
    expect(asc[2].name).toBe('B')
    const desc = sortCoins(withNull, 'price_desc')
    expect(desc[2].name).toBe('B')
  })

  it('returns original order for API-handled sort keys (market_cap_desc)', () => {
    const result = sortCoins(coins, 'market_cap_desc')
    expect(result.map((c) => c.name)).toEqual(coins.map((c) => c.name))
  })

  it('does not mutate the original array', () => {
    const original = [...coins]
    sortCoins(coins, 'name_asc')
    expect(coins.map((c) => c.name)).toEqual(original.map((c) => c.name))
  })
})
