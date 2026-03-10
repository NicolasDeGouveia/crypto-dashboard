import { Coin } from "./types";

// Fallback list used for legacy API calls only
export const COINS: Coin[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' }
];

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
};
