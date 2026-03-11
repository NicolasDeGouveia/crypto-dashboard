import Image from "next/image";
import Link from "next/link";
import { formatPrice, formatMarketCap, formatVolume, formatPercent } from "@/app/_lib/utils";

type Props = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number | null;
  priceChangePercent24h: number | null;
  marketCap: number | null;
  volume: number | null;
  rank: number | null;
};

const CoinListItem = ({
  id,
  name,
  symbol,
  image,
  price,
  priceChangePercent24h,
  marketCap,
  volume,
  rank,
}: Props) => {
  const isPositive = priceChangePercent24h != null && priceChangePercent24h >= 0;
  const percentBadgeColor = isPositive
    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";

  return (
    <Link
      href={`/coins/${id}`}
      className="group block rounded-xl bg-white p-4 ring-1 ring-zinc-200 sm:p-5 lg:grid lg:grid-cols-[2rem_1fr_1fr_1fr_1fr_6rem] lg:items-center lg:gap-6 transition-all hover:ring-indigo-300 hover:shadow-md hover:shadow-indigo-100/50 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:ring-indigo-700 dark:hover:shadow-indigo-950/50"
    >
      {/* Rank */}
      <span className="hidden lg:block text-sm text-zinc-400 font-medium text-right tabular-nums dark:text-zinc-500">
        {rank ?? "—"}
      </span>

      {/* Name + image */}
      <div className="flex items-center justify-between lg:contents">
        <div className="flex items-center gap-3">
          <Image
            src={image}
            alt={name}
            width={32}
            height={32}
            className="rounded-full shrink-0"
          />
          <div>
            <p className="font-medium text-zinc-900 capitalize dark:text-zinc-100">{name}</p>
            <p className="text-xs text-zinc-400 uppercase tracking-wide dark:text-zinc-500">{symbol}</p>
          </div>
        </div>

        {/* Mobile: price + percent stacked */}
        <div className="lg:hidden flex flex-col items-end gap-0.5">
          <p className="text-base font-semibold text-zinc-900 tabular-nums dark:text-zinc-100">
            {formatPrice(price)}
          </p>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums ${percentBadgeColor}`}>
            {formatPercent(priceChangePercent24h)}
          </span>
        </div>
      </div>

      {/* Price — desktop */}
      <p className="hidden lg:block text-sm font-semibold text-zinc-900 tabular-nums dark:text-zinc-100">
        {formatPrice(price)}
      </p>

      {/* Market cap — desktop */}
      <p className="hidden lg:block text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
        {formatMarketCap(marketCap)}
      </p>

      {/* Volume — desktop */}
      <p className="hidden lg:block text-sm text-zinc-500 tabular-nums dark:text-zinc-400">
        {formatVolume(volume)}
      </p>

      {/* 24h change — desktop */}
      <div className="hidden lg:block">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium tabular-nums ${percentBadgeColor}`}>
          {formatPercent(priceChangePercent24h)}
        </span>
      </div>
    </Link>
  );
};

export default CoinListItem;
