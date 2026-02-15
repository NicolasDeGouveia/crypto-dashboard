import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCoinsPrices, getCoinDetails } from '../api'

const fetchMock = vi.fn()
global.fetch = fetchMock

describe('API functions', () => {
  beforeEach(() => {
    fetchMock.mockClear()
  })

  describe('getCoinsPrices', () => {
    it('should fetch and return coin prices successfully', async () => {
      const mockData = {
        bitcoin: { usd: 50000, usd_24h_change: 5.25 },
        ethereum: { usd: 3000, usd_24h_change: -2.5 },
      }

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await getCoinsPrices()

      expect(result).toEqual(mockData)
    })

    it('should return null when API call fails', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const result = await getCoinsPrices()

      expect(result).toBeNull()
    })
  })

  describe('getCoinDetails', () => {
    it('should fetch and return coin details successfully', async () => {
      const mockData = {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        market_data: {
          current_price: { usd: 50000 },
          high_24h: { usd: 52000 },
          low_24h: { usd: 48000 },
          price_change_percentage_24h: 5.25,
        },
      }

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await getCoinDetails('bitcoin')

      expect(result).toEqual(mockData)
    })

    it('should return null when API call fails', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await getCoinDetails('invalid-coin')

      expect(result).toBeNull()
    })
  })
})
