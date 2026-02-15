# Cryptocurrency Price Dashboard

A Next.js dashboard displaying real-time cryptocurrency prices using the CoinGecko API.

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your CoinGecko API key (required) at the root of the project:
```bash
COINGECKO_API_KEY=your_demo_api_key_here
```
Get a free demo API key at [coingecko.com/en/api](https://www.coingecko.com/en/api/pricing)

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Assumptions

- **Fixed coin list**: 5 predefined cryptocurrencies as per requirements (Bitcoin, Ethereum, Dogecoin, Cardano, Solana)
- **Demo API tier**: Using CoinGecko demo API with rate limits (10-50 calls/min)
- **USD only**: Prices displayed in USD (currency not specified in requirements)

## Design Decisions

- **Server-side rendering**: All pages use SSR for optimal performance and SEO
- **No caching**: Real-time data with `cache: 'no-store'`
- **Atomic components**: Reusable `StatCard` and `CoinListItem` components
