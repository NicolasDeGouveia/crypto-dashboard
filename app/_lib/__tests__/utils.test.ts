import { describe, it, expect } from 'vitest'
import { formatPrice } from '../utils'

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
