import Link from "next/link";
import { getCoinDetails } from "../../_lib/api";
import ErrorMessage from "../../components/ErrorMessage";

type Props = {
  params: Promise<{ id: string }>;
};

const CoinDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const coinData = await getCoinDetails(id);

  if (!coinData) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          ← Back to Dashboard
        </Link>
        <ErrorMessage
          title="Error loading coin details"
          message="Unable to fetch details for this cryptocurrency."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl capitalize">
        {coinData.name}
      </h1>
      <p className="text-slate-500 uppercase mt-1">{coinData.symbol}</p>
      <div className="my-4 border-t border-slate-200" />

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-medium text-slate-500">Current Price</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            $
            {coinData.market_data.current_price.usd.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-medium text-slate-500">24h High</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">
            $
            {coinData.market_data.high_24h.usd.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-medium text-slate-500">24h Low</p>
          <p className="mt-2 text-3xl font-bold text-red-700">
            $
            {coinData.market_data.low_24h.usd.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-medium text-slate-500">24h Price Change</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={`text-3xl font-bold ${
              coinData.market_data.price_change_percentage_24h >= 0
                ? "text-emerald-700"
                : "text-red-700"
            }`}
          >
            {coinData.market_data.price_change_percentage_24h >= 0 ? "+" : ""}
            {coinData.market_data.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default CoinDetailPage;
