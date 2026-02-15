import { COINS } from "./_lib/constants";
import { getCoinsPrices } from "./_lib/api";
import Card from "./components/Card";
import ErrorMessage from "./components/ErrorMessage";
import { Fragment } from "react/jsx-runtime";

const Home = async () => {
  const data = await getCoinsPrices();

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Crypto Dashboard
        </h1>
        <div className="my-4 border-t border-slate-200" />
        <ErrorMessage
          title="Error loading cryptocurrency data"
          message="Unable to fetch prices. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Crypto Dashboard
      </h1>
      <div className="my-4 border-t border-slate-200" />

      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6 lg:px-5 lg:py-3 lg:text-sm lg:font-medium lg:text-slate-500 lg:border-b lg:border-slate-200">
        <div>Name</div>
        <div>Symbol</div>
        <div>Price (USD)</div>
        <div>24h Change</div>
      </div>

      <div className="space-y-4 lg:space-y-2 lg:mt-2">
        {COINS.map((coin) => {
          const priceData = data[coin.id];

          if (!priceData) return

          return (
            <Fragment key={coin.id}>
              <Card
                id={coin.id}
                name={coin.name}
                price={priceData.usd}
                percent={priceData.usd_24h_change}
                symbol={coin.symbol}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
