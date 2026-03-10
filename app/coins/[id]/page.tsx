import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCoinDetails } from "../../_lib/api";
import { auth } from "../../_lib/auth";
import { getUserFavouriteIds } from "../../_lib/db/queries";
import { formatPrice, formatMarketCap, formatVolume, formatSupply, formatDate } from "../../_lib/utils";
import { StatCard } from "../../components/ui/StatCard";
import CoinDescription from "../../components/coin/CoinDescription";
import SparklineChart from "../../components/coin/SparklineChart";
import PriceChangeTable from "../../components/coin/PriceChangeTable";
import FavouriteToggle from "../../components/FavouriteToggle";

type Props = {
  params: Promise<{ id: string }>;
};

const CoinDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const [coin, session] = await Promise.all([
    getCoinDetails(id),
    auth(),
  ]);

  if (!coin) notFound();

  const favouriteIds = session?.user?.id
    ? await getUserFavouriteIds(session.user.id)
    : [];
  const isAuthenticated = Boolean(session?.user);

  const marketData = coin.market_data;

  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Image
          src={coin.image.large}
          alt={coin.name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl capitalize">
            {coin.name}
          </h1>
          <p className="text-slate-500 uppercase mt-0.5">{coin.symbol}</p>
        </div>
        <FavouriteToggle
          coinId={id}
          isFavourited={favouriteIds.includes(id)}
          isAuthenticated={isAuthenticated}
        />
      </div>

      <div className="my-4 border-t border-slate-200" />

      {/* 7-day sparkline */}
      {marketData.sparkline_7d?.price?.length ? (
        <div className="mb-4 flex justify-end">
          <SparklineChart prices={marketData.sparkline_7d.price} />
        </div>
      ) : null}

      {/* Price stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Current Price"
          value={formatPrice(marketData.current_price.usd)}
          valueColor="default"
        />
        <StatCard
          label="24h High"
          value={formatPrice(marketData.high_24h.usd)}
          valueColor="success"
        />
        <StatCard
          label="24h Low"
          value={formatPrice(marketData.low_24h.usd)}
          valueColor="danger"
        />
      </div>

      {/* Market data */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Market Cap"
          value={formatMarketCap(marketData.market_cap.usd)}
          valueColor="default"
        />
        <StatCard
          label="24h Volume"
          value={formatVolume(marketData.total_volume.usd)}
          valueColor="default"
        />
        <StatCard
          label="Circulating Supply"
          value={formatSupply(marketData.circulating_supply)}
          valueColor="default"
        />
        <StatCard
          label="Max Supply"
          value={formatSupply(marketData.max_supply)}
          valueColor="default"
        />
      </div>

      {/* ATH */}
      {marketData.ath.usd != null && (
        <div className="mt-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <p className="text-sm font-medium text-slate-500">All-Time High</p>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">
              {formatPrice(marketData.ath.usd)}
            </span>
            {marketData.ath_date.usd && (
              <span className="text-sm text-slate-400">
                {formatDate(marketData.ath_date.usd)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Price change table */}
      <PriceChangeTable
        change24h={marketData.price_change_percentage_24h}
        change7d={marketData.price_change_percentage_7d}
        change30d={marketData.price_change_percentage_30d}
      />

      {/* Description */}
      {coin.description.en && (
        <CoinDescription description={coin.description.en} />
      )}
    </>
  );
};

export default CoinDetailPage;
