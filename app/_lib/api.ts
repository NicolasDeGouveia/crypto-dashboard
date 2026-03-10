import "server-only";
import { COINGECKO_API_KEY, COINGECKO_BASE_URL, COINS, DEFAULT_SORT, PAGE_SIZE } from "./constants";
import { CoinDetail, CoinMarketsParams, CoinMarketSummary, CoinPriceResponse } from "./types";

const getHeaders = () => ({
  "x-cg-demo-api-key": COINGECKO_API_KEY || "",
});

export async function getCoinMarkets({
  page = 1,
  sort = DEFAULT_SORT,
  perPage = PAGE_SIZE,
  ids,
}: CoinMarketsParams = {}): Promise<CoinMarketSummary[] | null> {
  try {
    const params = new URLSearchParams({
      vs_currency: "usd",
      order: sort,
      per_page: String(perPage),
      page: String(page),
      sparkline: "false",
      price_change_percentage: "24h",
    });
    if (ids?.length) params.set("ids", ids.join(","));

    const res = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?${params.toString()}`,
      {
        headers: getHeaders(),
        next: { revalidate: 60, tags: ["coin-markets"] },
      }
    );

    if (!res.ok) {
      if (res.status === 429) {
        console.error("API rate limit exceeded.");
      } else {
        console.error(`API error: ${res.status}`);
      }
      return null;
    }

    const data: CoinMarketSummary[] = await res.json();
    return data ?? null;
  } catch (error) {
    console.error("Error fetching coin markets:", error);
    return null;
  }
}

export async function getCoinDetails(id: string): Promise<CoinDetail | null> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`,
      {
        headers: getHeaders(),
        next: { revalidate: 120, tags: [`coin-detail:${id}`, "coin-detail"] },
      }
    );

    if (!res.ok) {
      if (res.status === 429) {
        console.error("API rate limit exceeded.");
      } else {
        console.error(`API error for ${id}: ${res.status}`);
      }
      return null;
    }

    const data: CoinDetail = await res.json();
    return data ?? null;
  } catch (error) {
    console.error(`Error fetching coin details for ${id}:`, error);
    return null;
  }
}

// Legacy function — kept for backward compatibility
export async function getCoinsPrices(): Promise<CoinPriceResponse | null> {
  try {
    const ids = COINS.map((coin) => coin.id).join(",");
    const res = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: getHeaders(),
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      if (res.status === 429) {
        console.error("API rate limit exceeded.");
      } else {
        console.error(`API error: ${res.status}`);
      }
      return null;
    }

    const data: CoinPriceResponse = await res.json();
    return data && Object.keys(data).length > 0 ? data : null;
  } catch (error) {
    console.error("Error fetching coins prices:", error);
    return null;
  }
}
