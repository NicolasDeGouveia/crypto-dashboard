import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCoinsPrices, getCoinDetails, getCoinMarkets } from '../api'

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

  describe('getCoinMarkets', () => {
    it('should construct correct URL with default params', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => [] })
      await getCoinMarkets()
      const url = fetchMock.mock.calls[0][0] as string
      expect(url).toContain('/coins/markets')
      expect(url).toContain('vs_currency=usd')
      expect(url).toContain('order=market_cap_desc')
      expect(url).toContain('per_page=50')
      expect(url).toContain('page=1')
    })

    it('should include ids param when provided', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => [] })
      await getCoinMarkets({ ids: ['bitcoin', 'ethereum'] })
      const url = fetchMock.mock.calls[0][0] as string
      expect(url).toContain('ids=bitcoin%2Cethereum')
    })

    it('should return CoinMarketSummary array on success', async () => {
      const mockData = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://example.com/btc.png',
          current_price: 50000,
          market_cap: 1000000000000,
          market_cap_rank: 1,
          total_volume: 30000000000,
          price_change_percentage_24h: 2.5,
          circulating_supply: 19000000,
          total_supply: 21000000,
          max_supply: 21000000,
          ath: 69000,
          ath_date: '2021-11-10T14:24:11.849Z',
        },
      ]
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => mockData })
      const result = await getCoinMarkets()
      expect(result).toEqual(mockData)
      expect(result![0].id).toBe('bitcoin')
      expect(result![0].market_cap).toBe(1000000000000)
    })

    it('should return null on API error', async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 429 })
      const result = await getCoinMarkets()
      expect(result).toBeNull()
    })

    it('should return null on network error', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'))
      const result = await getCoinMarkets()
      expect(result).toBeNull()
    })

    it('should use custom sort and page params', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => [] })
      await getCoinMarkets({ page: 2, sort: 'volume_desc', perPage: 25 })
      const url = fetchMock.mock.calls[0][0] as string
      expect(url).toContain('order=volume_desc')
      expect(url).toContain('per_page=25')
      expect(url).toContain('page=2')
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
      fetchMock.mockResolvedValueOnce({ ok: false, status: 404 })
      const result = await getCoinDetails('invalid-coin')
      expect(result).toBeNull()
    })

    it('should use correct URL with sparkline and localization params', async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      await getCoinDetails('bitcoin')
      const url = fetchMock.mock.calls[0][0] as string
      expect(url).toContain('localization=false')
      expect(url).toContain('tickers=false')
      expect(url).toContain('sparkline=true')
    })

    it('should return full CoinDetail shape including sparkline', async () => {
      const mockData = {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: { thumb: '', small: '', large: '' },
        description: { en: 'Bitcoin description' },
        market_data: {
          current_price: { usd: 50000 },
          high_24h: { usd: 52000 },
          low_24h: { usd: 48000 },
          price_change_percentage_24h: 5.25,
          price_change_percentage_7d: 10.5,
          price_change_percentage_30d: -2.1,
          market_cap: { usd: 1000000000000 },
          total_volume: { usd: 30000000000 },
          circulating_supply: 19000000,
          total_supply: 21000000,
          max_supply: 21000000,
          ath: { usd: 69000 },
          ath_date: { usd: '2021-11-10' },
          sparkline_7d: { price: [45000, 47000, 50000] },
        },
      }
      fetchMock.mockResolvedValueOnce({ ok: true, json: async () => mockData })
      const result = await getCoinDetails('bitcoin')
      expect(result?.market_data.sparkline_7d?.price).toHaveLength(3)
      expect(result?.market_data.price_change_percentage_7d).toBe(10.5)
    })
  })
})
