# Tasks: Chart Multi-Period View

**Feature**: 012-chart-multi-period
**Depends on**: 008
**Scope**: Replace the static 7-day sparkline on the coin detail page with an interactive chart that supports multiple time periods (1D / 7D / 30D / 90D / 1Y).

Design direction:
- Period selector: pill buttons (1D, 7D, 30D, 90D, 1Y) above the chart
- Active period: indigo fill, others zinc outline
- Selected period stored in URL search params (`?period=7d`) — SSR, no hydration flash
- Data: CoinGecko `/coins/{id}/market_chart?vs_currency=usd&days=N`
- Chart: reuse `SparklineChart` component, pass new price array
- Cache: 60s revalidate; tag `coin-chart:{id}`
- Default period: 7D (backward compatible with current sparkline_7d data)

---

## Tasks

- [X] T001 Add `CoinMarketChart` type and `getCoinMarketChart()` to `app/_lib/types.ts` + `app/_lib/api.ts`
- [X] T002 Create `app/components/coin/ChartPeriodSelector.tsx` — period pill buttons, reads/writes `?period=` search param via `useRouter` + `useSearchParams`
- [X] T003 Update `SparklineChart` to accept an optional `label` prop and update aria-label dynamically
- [X] T004 Create `app/components/coin/CoinChart.tsx` — Client Component wrapper that fetches chart data via a Server Action and renders period selector + chart
- [X] T005 Update `app/coins/[id]/page.tsx` — replace static sparkline block with `CoinChart`, pass `coinId` and `searchParams.period`
- [X] T006 Add `app/_actions/getCoinChartData.ts` Server Action that calls `getCoinMarketChart` and returns prices array
- [X] T007 Verify the feature works end-to-end: all 5 periods render a chart
