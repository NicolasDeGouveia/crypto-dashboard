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

export type CoinDetails = {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
    price_change_percentage_24h: number;
  };
};