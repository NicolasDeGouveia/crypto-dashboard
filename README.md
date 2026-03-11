# Cryptocurrency Price Dashboard

A Next.js dashboard displaying real-time cryptocurrency prices using the CoinGecko API, with user authentication and personalised favourite coins.

## Prerequisites

- Node.js 20.9.0 or higher
- npm
- A [Neon](https://neon.tech) PostgreSQL database (free tier)
- An [Upstash](https://upstash.com) Redis instance (free tier, for rate limiting)

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file at the project root (copy from `.env.example`):
```bash
cp .env.example .env
```

Fill in the required values:
```bash
COINGECKO_API_KEY=your_demo_api_key_here     # https://www.coingecko.com/en/api/pricing
DATABASE_URL=postgresql://...                 # https://neon.tech (free tier)
AUTH_SECRET=$(openssl rand -base64 32)        # Must be set in all environments
AUTH_URL=http://localhost:3000               # Set to your domain in production
UPSTASH_REDIS_REST_URL=https://...           # https://upstash.com (free tier)
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

> **Note:** In production (e.g. Vercel), also set `AUTH_TRUST_HOST=true` if you are behind a reverse proxy.

3. Run database migrations:
```bash
npm run db:migrate
```

4. Run the app:
```bash
# Development mode
npm run dev

# Production build
npm run build && npm start
```

5. Open [http://localhost:3000](http://localhost:3000)

## Running Tests

```bash
npm test                 # Watch mode (Vitest)
npm test -- --run        # Run once and exit
npm run test:coverage    # Coverage report
```

The test suite covers utilities, API helpers, Server Actions, and all UI components (93 tests).

## Database Commands

```bash
npm run db:migrate   # Apply migrations to the database
npm run db:studio    # Open Drizzle Studio (visual DB browser)
```

## Assumptions

- **Top 100 coins**: Paginated list of top cryptocurrencies by market cap (50 per page)
- **CoinGecko Demo API**: Uses free Demo tier endpoints — rate limit 30 calls/min
- **USD only**: Prices displayed in USD
- **Email + password auth**: No social login in this iteration
- **Password reset**: Out of scope for this iteration

## Design Decisions

- **Server-side rendering**: All pages use SSR for optimal performance and SEO
- **Data caching**: 60s revalidation on list/favourites, 120s on detail pages
- **JWT sessions**: No DB read per request — validated at edge in middleware
- **Batch API calls**: One `GET /coins/markets` call for all favourites (never per-coin loops)
- **Atomic components**: Reusable `StatCard`, `CoinListItem`, `ErrorMessage` primitives
