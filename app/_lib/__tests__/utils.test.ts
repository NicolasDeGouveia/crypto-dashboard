import { describe, it, expect } from 'vitest'
import { formatPrice, formatMarketCap, formatVolume, formatSupply, formatPercent, formatDate } from '../utils'

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
