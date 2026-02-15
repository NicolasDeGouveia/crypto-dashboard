import Link from "next/link";
import { getCoinDetails } from "../../_lib/api";
import ErrorMessage from "../../components/ErrorMessage";
import { StatCard } from "../../components/StatCard";
import { formatPrice } from "../../_lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

const CoinDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const coinData = await getCoinDetails(id);

  if (!coinData) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
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
        <StatCard
          label="Current Price"
          value={formatPrice(coinData.market_data.current_price.usd)}
          valueColor="default"
        />
        <StatCard
          label="24h High"
          value={formatPrice(coinData.market_data.high_24h.usd)}
          valueColor="success"
        />
        <StatCard
          label="24h Low"
          value={formatPrice(coinData.market_data.low_24h.usd)}
          valueColor="danger"
        />
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <p className="text-sm font-medium text-slate-500">24h Price Change</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={`text-2xl font-bold ${
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
    </>
  );
};

export default CoinDetailPage;
