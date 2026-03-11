"use server";

import { getCoinMarketChart } from "@/app/_lib/api";
import { ChartPeriod } from "@/app/_lib/types";

const VALID_PERIODS = new Set<ChartPeriod>(["1", "7", "30", "90", "365"]);
const COIN_ID_RE = /^[a-z0-9-]+$/;

export async function getCoinChartData(
  coinId: string,
  period: ChartPeriod
): Promise<number[] | null> {
  if (!COIN_ID_RE.test(coinId) || coinId.length > 100) return null;
  if (!VALID_PERIODS.has(period)) return null;

  const chart = await getCoinMarketChart(coinId, period);
  if (!chart) return null;

  return chart.prices.map(([, price]) => price);
}
