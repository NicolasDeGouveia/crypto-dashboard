export const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export const PAGE_SIZE = 50;
export const DEFAULT_SORT = 'market_cap_desc';

export const SORT_OPTIONS: Record<string, string> = {
  market_cap_desc: 'Market Cap ↓',
  market_cap_asc: 'Market Cap ↑',
  volume_desc: 'Volume ↓',
  volume_asc: 'Volume ↑',
  price_change_percentage_24h_desc: '24h Change ↓',
  price_change_percentage_24h_asc: '24h Change ↑',
  name_asc: 'Name A→Z',
  name_desc: 'Name Z→A',
  price_asc: 'Price ↑',
  price_desc: 'Price ↓',
};
