# Feature Specification: Full Crypto Dashboard with Authentication & Favourites

**Feature Branch**: `002-crypto-dashboard-auth`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Le but de cette application est de faire un dashboard complet permettant une vue sur un grand nombre de cryptocurrency. Il y a pour le moment une page details qui contient quelques informations qu'il faudra par la suite rendre plus riche et complete. Il faudra également un systeme d'authentification ce qui permettra à un utilisateur de pouvoir avoir sa liste de coin favorite (nous verrons ensuite pour d'autre feature) (peut-etre une bdd)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse the Full Coin List (Priority: P1)

A visitor (unauthenticated) opens the dashboard and sees a paginated list of
cryptocurrencies — not just the 5 hardcoded coins but a broad market view covering
the top coins by market capitalisation. They can scroll through pages and click any
coin to see its detail page.

**Why this priority**: This is the core value of the app. It works for anonymous
users and unblocks all other stories. Without it, the dashboard remains a
5-coin prototype.

**Independent Test**: Navigate to the home page without logging in. Verify that more
than 5 coins are listed, that pagination controls are visible and functional, and
that clicking a coin opens its detail page.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the home page, **When** the page loads, **Then** a
   list of at least 50 cryptocurrencies is displayed, each showing name, symbol,
   current price (USD), and 24-hour price change percentage.
2. **Given** the coin list is displayed, **When** the visitor navigates to the next
   page, **Then** the next batch of coins is shown and the URL reflects the current
   page number.
3. **Given** the coin list is displayed, **When** the visitor clicks a coin row,
   **Then** they are taken to that coin's detail page.
4. **Given** the API is unavailable, **When** the page loads, **Then** a clear error
   message is shown and no broken layout is visible.

---

### User Story 2 - Rich Coin Detail Page (Priority: P2)

A visitor clicks on any coin and lands on an enriched detail page that goes well
beyond the current price/24h high-low display. They see market capitalisation,
trading volume, circulating supply, all-time high, a coin logo, and a description.

**Why this priority**: The detail page exists today but is sparse. Enriching it
directly increases the informational value of the app for all visitors without
requiring authentication.

**Independent Test**: Navigate directly to `/coins/bitcoin`. Verify that all enriched
data fields are displayed — including market cap, volume, supply, and ATH — without
needing to be logged in.

**Acceptance Scenarios**:

1. **Given** a visitor opens a coin detail page, **When** the data loads, **Then**
   the page displays: current price, 24h high, 24h low, 24h change %, market
   capitalisation, 24h trading volume, circulating supply, all-time high (price and
   date), and the coin's name, symbol, and logo.
2. **Given** a coin has a textual description available, **When** the detail page
   loads, **Then** the description is shown on the page.
3. **Given** the coin does not exist or the API returns an error, **When** the detail
   page loads, **Then** a clear error message is shown with a link back to the
   dashboard.

---

### User Story 3 - User Registration & Login (Priority: P3)

A new visitor creates an account using their email address and a password. They can
then log in and out. Their session persists across page refreshes. Existing users can
log back in without re-registering.

**Why this priority**: Authentication is the prerequisite for saving favourites
(User Story 4). The dashboard delivers standalone value without it, but auth unlocks
personalisation.

**Independent Test**: Register a new account, log out, log back in, and verify that
the session is restored. Verify that registration with a duplicate email shows a
clear error.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the registration page, **When** they submit a
   valid email and a password of at least 8 characters, **Then** their account is
   created and they are logged in automatically and redirected to the dashboard.
2. **Given** a visitor tries to register with an already-used email, **When** they
   submit the form, **Then** a clear error is shown and no duplicate account is
   created.
3. **Given** a registered user navigates to the login page, **When** they submit
   correct credentials, **Then** they are logged in and redirected to the dashboard.
4. **Given** a logged-in user clicks "Log out", **When** the action completes,
   **Then** their session is ended and they are returned to the home page as a guest.
5. **Given** a user submits incorrect credentials, **When** the login form is
   submitted, **Then** a generic error message is shown (not revealing whether the
   email or password was wrong individually).

---

### User Story 4 - Manage Favourite Coins (Priority: P4)

A logged-in user can mark any coin as a favourite from the coin list or detail page.
They can view a dedicated "My Favourites" page showing only their saved coins with
live prices. They can remove coins from their favourites at any time. Their list
persists across sessions and devices.

**Why this priority**: This is the personalisation feature that justifies
authentication. It depends on User Stories 1 and 3 being complete.

**Independent Test**: Log in, mark 3 coins as favourites from different pages,
navigate to "My Favourites", verify all 3 appear with live price data, then remove
one and verify the list updates immediately.

**Acceptance Scenarios**:

1. **Given** a logged-in user views the coin list, **When** they click the favourite
   toggle on a coin, **Then** the coin is saved to their favourites and the toggle
   reflects the new saved state immediately.
2. **Given** a logged-in user views a coin detail page, **When** they click the
   favourite toggle, **Then** the coin is added to or removed from their favourites.
3. **Given** a logged-in user navigates to "My Favourites", **When** the page loads,
   **Then** all their saved coins are displayed with live price data (name, symbol,
   price, 24h change).
4. **Given** a logged-in user removes a coin from favourites, **When** the action
   completes, **Then** the coin is immediately removed from the "My Favourites" list
   without a full page reload.
5. **Given** a guest user clicks the favourite toggle on any coin, **When** the
   action is triggered, **Then** they are directed to log in or register.
6. **Given** a user's favourites list is empty, **When** they visit "My Favourites",
   **Then** an empty-state message is shown with a clear call-to-action to explore
   coins.

---

### Edge Cases

- What happens when a coin in a user's favourites list returns no data from the API?
  The coin should still appear in the list with a "data unavailable" indicator rather
  than disappearing silently.
- What happens when a user tries to add the same coin to favourites twice? The system
  must be idempotent — no duplicate entry is created.
- What happens when the API rate limit is exceeded while loading the favourites page?
  A specific, user-friendly message should be shown (not a generic error).
- What happens if a user's session expires mid-session? They should be redirected to
  the login page with a message explaining the session has ended.
- What happens on mobile viewports (375 px wide)? All pages must be fully usable on
  small screens with no broken layouts or overflowing content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a paginated list of cryptocurrencies covering
  at least the top 100 coins by market capitalisation, each showing name, symbol,
  current price (USD), and 24h change percentage.
- **FR-002**: The system MUST allow navigation between pages of the coin list; the
  current page MUST be reflected in the URL so pages are shareable and bookmarkable.
- **FR-003**: Each coin detail page MUST display: current price, 24h high, 24h low,
  24h change %, market capitalisation, 24h trading volume, circulating supply,
  all-time high (price and date), and the coin's name, symbol, and logo.
- **FR-004**: Each coin detail page SHOULD display a short textual description of
  the coin where one is available from the data source.
- **FR-005**: The system MUST allow a visitor to create a new account using an email
  address and a password.
- **FR-006**: The system MUST reject registration if the email is already in use or
  if the password is fewer than 8 characters, and display a clear error in each case.
- **FR-007**: The system MUST allow a registered user to log in with their email and
  password and log out at any time from any page.
- **FR-008**: The system MUST maintain user sessions across page refreshes and browser
  restarts for a period of at least 7 days without requiring re-authentication.
- **FR-009**: A logged-in user MUST be able to add any coin to their favourites list
  or remove it, from both the coin list page and the coin detail page.
- **FR-010**: The system MUST persist the user's favourites list server-side so it is
  accessible from any device after login.
- **FR-011**: The system MUST provide a dedicated "My Favourites" page showing all of
  the logged-in user's saved coins with live price data.
- **FR-012**: Attempting to favourite a coin while not logged in MUST result in the
  user being directed to the login or registration page.
- **FR-013**: All data-driven pages MUST handle loading, error, and empty states
  without broken layouts.
- **FR-014**: The system MUST display coin logos on both the coin list and detail pages
  where logos are available from the data source.

### Key Entities

- **User**: Represents a registered account. Key attributes: unique identifier, email
  address, hashed credentials, account creation date. Relationships: has many
  Favourites.
- **Favourite**: Represents a user's saved coin. Key attributes: user identifier, coin
  identifier (e.g., "bitcoin"), date added. Relationships: belongs to one User.
- **Coin** (external, not stored): Market data fetched on demand. Key attributes:
  identifier, name, symbol, price, market cap, volume, circulating supply, ATH, image
  URL, description.

## Assumptions

- **Data source**: CoinGecko API (Demo free tier) is used for all market data. The
  top-100 coin list is fetched via the `/coins/markets` endpoint.
- **Currency**: USD only, consistent with the existing implementation.
- **Authentication method**: Email + password (credential-based). Social login is out
  of scope for this iteration.
- **Session duration**: Sessions persist for at least 7 days; the specific duration
  will be confirmed during planning.
- **Favourites storage**: A database is used to persist user accounts and favourites,
  enabling cross-device access. The specific database technology is to be decided
  during planning.
- **Coin list page size**: 25 coins per page (4 pages for top 100). Adjustable during
  planning.
- **Password reset & email verification**: Out of scope for this iteration.
- **Admin features**: Out of scope.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can browse the full coin list and navigate to any coin's
  detail page in under 3 clicks from the home page.
- **SC-002**: All pages display their content within 3 seconds on a standard
  broadband connection under normal load.
- **SC-003**: A new user can complete registration and land on the dashboard in under
  2 minutes from first visiting the registration page.
- **SC-004**: A returning user can log in and reach their favourites list in under
  60 seconds.
- **SC-005**: Adding or removing a coin from favourites is reflected in the UI
  immediately without a full page reload.
- **SC-006**: All pages render correctly on screen widths from 375 px (mobile) to
  1440 px (desktop) with no broken layouts or overflowing content.
- **SC-007**: Displayed coin prices are no more than 2 minutes stale under normal
  operating conditions.
- **SC-008**: A user's favourites list is fully restored after logging out and back
  in from a different browser session.
