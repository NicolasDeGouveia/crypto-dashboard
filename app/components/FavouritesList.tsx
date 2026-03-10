import Link from "next/link";
import type { CoinMarketSummary } from "@/app/_lib/types";
import CoinListItem from "./coin/CoinListItem";
import FavouriteToggle from "./FavouriteToggle";

type Props = {
  coins: CoinMarketSummary[];
  favouriteIds: string[];
  isAuthenticated: boolean;
};

export default function FavouritesList({
  coins,
  favouriteIds,
  isAuthenticated,
}: Props) {
  if (!coins.length) {
    return (
      <div className="mt-8 text-center py-16">
        <p className="text-slate-500 text-sm mb-4">
          No favourites yet. Browse the list and star the coins you want to track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
        >
          Browse coins
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-2">
      {coins.map((coin) => (
        <div key={coin.id} className="relative">
          {coin.current_price == null && (
            <div className="absolute top-2 right-2 z-10">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                Data unavailable
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <CoinListItem
                id={coin.id}
                name={coin.name}
                symbol={coin.symbol}
                image={coin.image}
                price={coin.current_price}
                priceChangePercent24h={coin.price_change_percentage_24h}
                marketCap={coin.market_cap}
                volume={coin.total_volume}
                rank={coin.market_cap_rank}
              />
            </div>
            <div className="shrink-0">
              <FavouriteToggle
                coinId={coin.id}
                isFavourited={favouriteIds.includes(coin.id)}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
