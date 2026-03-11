export type Coin = {
  id: string;
  symbol: string;
  name: string;
};

export type CoinPrice = {
  usd: number;
  usd_24h_change: number;
};

export type CoinPriceResponse = {
  [key: string]: CoinPrice;
};

// From /coins/markets endpoint
export type CoinMarketSummary = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_date: string | null;
};

export type CoinMarketsParams = {
  page?: number;
  sort?: string;
  perPage?: number;
  ids?: string[]; // joined to comma-string inside getCoinMarkets
  query?: string;
};

// From /coins/{id}?localization=false&tickers=false&sparkline=true
export type CoinDetail = {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  description: {
    en: string;
  };
  market_data: {
    current_price: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_percentage_24h: number | null;
    price_change_percentage_7d: number | null;
    price_change_percentage_30d: number | null;
    market_cap: { usd: number | null };
    total_volume: { usd: number | null };
    circulating_supply: number | null;
    total_supply: number | null;
    max_supply: number | null;
    ath: { usd: number | null };
    ath_date: { usd: string | null };
    sparkline_7d: {
      price: number[];
    } | null;
  };
};

// From /coins/{id}/market_chart?vs_currency=usd&days=N
export type CoinMarketChart = {
  prices: [number, number][]; // [timestamp_ms, price]
};

export type ChartPeriod = "1" | "7" | "30" | "90" | "365";

// Legacy type kept for backward compat (maps to CoinDetail shape)
export type CoinDetails = CoinDetail;

// ─── Server Action result types ───────────────────────────────────────────────

export type ActionErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_COIN_ID"
  | "DB_ERROR"
  | "RATE_LIMITED"
  | "INVALID_EMAIL"
  | "PASSWORD_TOO_SHORT"
  | "EMAIL_IN_USE";

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: ActionErrorCode };

export const ACTION_ERROR_MESSAGES: Record<ActionErrorCode, string> = {
  UNAUTHENTICATED: "You must be logged in to do this.",
  INVALID_COIN_ID: "Invalid coin.",
  DB_ERROR: "Something went wrong. Please try again.",
  RATE_LIMITED: "Too many attempts. Please try again in 15 minutes.",
  INVALID_EMAIL: "Please enter a valid email address.",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters.",
  EMAIL_IN_USE: "An account with this email already exists.",
};
