import {
  COINGECKO_API_KEY,
  COINGECKO_BASE_URL,
  COINS,
} from "../_lib/constants";
import { CoinPriceResponse } from "../_lib/types";
import Image from "next/image";
import Card from "../components/Card";
import { Fragment } from "react/jsx-runtime";

const Listing = async () => {
  let data: CoinPriceResponse | null = null;
  try {
    const ids = COINS.map((coin) => coin.id).join(",");
    const res = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          "x-cg-demo-api-key": `${COINGECKO_API_KEY}`,
        },
        next: { revalidate: 60 },
      },
    );
    data = await res.json();
  } catch (error) {
    console.error(error);
  }

  if (!data) return;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Crypto Dashboard
      </h1>
      <div className="my-4 border-t border-slate-200" />

      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-6 lg:px-5 lg:py-3 lg:text-sm lg:font-medium lg:text-slate-500 lg:border-b lg:border-slate-200">
        <div>Name</div>
        <div>Symbol</div>
        <div>Price (USD)</div>
        <div>24h Change</div>
        <div>Action</div>
      </div>

      <div className="space-y-4 lg:space-y-2 lg:mt-2">
        {COINS.map((coin) => {
          const priceData = data?.[coin.id];

          return (
            <Fragment key={coin.id}>
            <Card id={coin.id} name={coin.name} price={priceData.usd} percent={priceData.usd_24h_change} symbol={coin.symbol} />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Listing;
