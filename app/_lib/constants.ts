export const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' }
] as const;

export const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
