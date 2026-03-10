# Quickstart: Full Crypto Dashboard with Authentication & Favourites

**Branch**: `002-crypto-dashboard-auth` | **Date**: 2026-03-10

Use this guide to validate that the feature is working end-to-end after implementation.
Each step can be performed independently to verify a user story in isolation.

---

## Prerequisites

1. Node.js 20.9.0 or higher installed
2. A CoinGecko Demo API key (free — see README)
3. A Neon database created and connection string available
4. All environment variables set (see below)

## Environment Variables

Create or update `.env` at the project root:

```bash
# Existing
COINGECKO_API_KEY=your_demo_api_key_here

# New — Auth.js
AUTH_SECRET=<generate with: openssl rand -base64 32>
AUTH_URL=http://localhost:3000   # Change to production URL when deploying

# New — Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

## Setup

```bash
npm install
npm run db:migrate   # Run Drizzle migrations to create users + favourites tables
npm run dev
```

---

## Validation Steps

### User Story 1 — Browse the Full Coin List

1. Open `http://localhost:3000` without logging in.
2. **Verify**: More than 5 coins are listed (at least 50 on page 1).
3. **Verify**: Each row shows name, symbol, price (USD), and 24h change %.
4. **Verify**: Coin logo images are displayed in each row.
5. **Verify**: Pagination controls are visible. Click "Next page".
6. **Verify**: URL changes to `/?page=2` and a different set of coins is shown.
7. **Verify**: Clicking a coin row navigates to `/coins/[id]`.
8. **Verify**: The loading skeleton shows the correct number of rows while navigating.

**Sort test**:
- Click the "Market Cap" column header.
- **Verify**: URL changes to `/?sort=market_cap_asc` and coins reorder.

**Search test**:
- Type "ethereum" in the search box.
- **Verify**: URL updates to `/?q=ethereum` and the list filters to matching coins.
- Clear the search box.
- **Verify**: Full list is restored.

---

### User Story 2 — Rich Coin Detail Page

1. Click any coin from the list (or navigate to `/coins/bitcoin`).
2. **Verify**: The following fields are all displayed:
   - Current price (USD)
   - 24h high and 24h low
   - 24h price change (% and absolute)
   - Market capitalisation
   - 24h trading volume
   - Circulating supply
   - Total supply (and max supply if applicable)
   - All-time high price and date
   - Coin logo (large image)
   - Coin description/summary text
3. **Verify**: The "← Back to Dashboard" link returns to the list page.

**Error state test** (optional):
- Navigate to `/coins/this-coin-does-not-exist`.
- **Verify**: An error message is shown with a back link; no broken layout.

---

### User Story 3 — User Registration & Login

**Registration**:

1. Navigate to `/register`.
2. Enter a new email and a password of at least 8 characters.
3. Click "Register".
4. **Verify**: You are redirected to the dashboard and shown as logged in
   (e.g., user email or avatar visible in the header).

**Duplicate email**:

1. Navigate to `/register` again.
2. Enter the same email used above.
3. **Verify**: An error message appears; no new account is created.

**Short password**:

1. Try registering with a 6-character password.
2. **Verify**: Validation error shown; form not submitted.

**Login / Logout**:

1. If logged in, click "Log out".
2. **Verify**: Redirected to home page as a guest.
3. Navigate to `/login`.
4. Enter your email and correct password.
5. **Verify**: Logged in and redirected to the dashboard.
6. Refresh the page.
7. **Verify**: You are still logged in (session persists).

**Wrong credentials**:

1. Navigate to `/login`.
2. Enter a valid email with a wrong password.
3. **Verify**: A generic error message is shown (not "wrong password" or "email not found").

---

### User Story 4 — Manage Favourite Coins

**Adding a favourite**:

1. Log in.
2. On the coin list, click the favourite toggle (star/heart icon) on any coin.
3. **Verify**: The toggle icon changes to "active/filled" state immediately.
4. Navigate to a coin detail page.
5. Click the favourite toggle on that page.
6. **Verify**: Toggle reflects saved state immediately.

**My Favourites page**:

1. Navigate to `/favourites`.
2. **Verify**: All previously favourited coins are shown with live price data.
3. **Verify**: Each coin shows name, symbol, current price, and 24h change %.

**Removing a favourite**:

1. On the `/favourites` page, click the favourite toggle on one coin.
2. **Verify**: The coin is removed from the list immediately without a full page reload.

**Cross-session persistence**:

1. Add a coin to favourites.
2. Log out.
3. Log in again (from the same or a different browser).
4. Navigate to `/favourites`.
5. **Verify**: The favourited coin still appears.

**Guest user**:

1. Log out.
2. On the coin list, click the favourite toggle.
3. **Verify**: Redirected to `/login` (or a login prompt is shown).

**Empty state**:

1. Remove all coins from favourites.
2. Navigate to `/favourites`.
3. **Verify**: An empty-state message is shown with a link to explore coins.

---

## Common Issues

| Symptom | Likely cause |
|---------|-------------|
| No coins on list page | Missing `COINGECKO_API_KEY` or rate limit hit (HTTP 429) |
| Login fails silently | Missing or incorrect `AUTH_SECRET` |
| Favourites not persisting | `DATABASE_URL` not set or migrations not run |
| Images not loading | `assets.coingecko.com` not in `next.config.ts` `images.remotePatterns` |
| Session not restored after refresh | `AUTH_URL` not set to correct domain |
