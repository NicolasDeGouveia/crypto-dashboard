# Cryptocurrency Price Dashboard

A Next.js dashboard displaying real-time cryptocurrency prices using the CoinGecko API.

## Prerequisites

- Node.js 20.9.0 or higher
- npm

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your CoinGecko demo API key (required) at the root of the project:
```bash
COINGECKO_API_KEY=your_demo_api_key_here
```
Get a Demo API key at [coingecko.com/en/api/pricing](https://www.coingecko.com/en/api/pricing) (free tier)

3. Run the app:
```bash
# Development mode
npm run dev

# Production build
npm run build && npm start
```

4. Open [http://localhost:3000](http://localhost:3000)

## Assumptions

- **Fixed coin list**: 5 predefined cryptocurrencies as per requirements (Bitcoin, Ethereum, Dogecoin, Cardano, Solana)
- **CoinGecko Demo API**: Uses free Demo tier endpoints due to [rate limits](https://docs.coingecko.com/docs/common-errors-rate-limit) (10-30 calls/min)
- **USD only**: Prices displayed in USD (currency not specified in requirements)

## Design Decisions

- **Server-side rendering**: All pages use SSR for optimal performance and SEO
- **Data caching**: 60-second revalidation to respect API rate limits while maintaining fresh data
- **Atomic components**: Reusable `StatCard` and `CoinListItem` components
