import { COINGECKO_API_KEY, COINGECKO_BASE_URL, COINS } from "./constants";
import { CoinPriceResponse, CoinDetails } from "./types";


const getFetchOptions = (): RequestInit => ({
  headers: {
    "x-cg-demo-api-key": COINGECKO_API_KEY || "",
  },
  next: { revalidate: 60 },
});


export async function getCoinsPrices(): Promise<CoinPriceResponse | null> {
  try {
    const ids = COINS.map((coin) => coin.id).join(",");
    const res = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      getFetchOptions()
    );

    if (!res.ok) {
      if (res.status === 429) {
        console.error("API rate limit exceeded. Please wait a moment before refreshing.");
      } else {
        console.error(`API error: ${res.status}`);
      }
      return null;
    }

    const data: CoinPriceResponse = await res.json();

    if (!data || Object.keys(data).length === 0) {
      console.error("API returned empty or invalid data");
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching coins prices:", error);
    return null;
  }
}


export async function getCoinDetails(id: string): Promise<CoinDetails | null> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE_URL}/coins/${id}`,
      getFetchOptions()
    );

    if (!res.ok) {
      if (res.status === 429) {
        console.error("API rate limit exceeded. Please wait a moment before refreshing.");
      } else {
        console.error(`API error for ${id}: ${res.status}`);
      }
      return null;
    }

    const data: CoinDetails = await res.json();

    if (!data) {
      console.error(`API returned invalid data for ${id}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching coin details for ${id}:`, error);
    return null;
  }
}
