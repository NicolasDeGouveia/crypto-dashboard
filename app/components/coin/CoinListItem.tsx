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
    ? "bg-emerald-500/10 text-emerald-400"
    : "bg-red-500/10 text-red-400";

  return (
    <Link
      href={`/coins/${id}`}
      className="group block rounded-xl p-4 sm:p-5 lg:grid lg:grid-cols-[2rem_1fr_1fr_1fr_1fr_6rem] lg:items-center lg:gap-6 transition-all glass glass-hover hover:glow-violet"
    >
      {/* Rank */}
      <span className="hidden lg:block text-sm text-zinc-500 font-medium text-right tabular-nums">
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
            <p className="font-medium text-zinc-100 capitalize">{name}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-wide">{symbol}</p>
          </div>
        </div>

        {/* Mobile: price + percent stacked */}
        <div className="lg:hidden flex flex-col items-end gap-0.5">
          <p className="text-base font-semibold text-zinc-100 tabular-nums">
            {formatPrice(price)}
          </p>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums ${percentBadgeColor}`}>
            {formatPercent(priceChangePercent24h)}
          </span>
        </div>
      </div>

      {/* Price — desktop */}
      <p className="hidden lg:block text-sm font-semibold text-zinc-100 tabular-nums">
        {formatPrice(price)}
      </p>

      {/* Market cap — desktop */}
      <p className="hidden lg:block text-sm text-zinc-400 tabular-nums">
        {formatMarketCap(marketCap)}
      </p>

      {/* Volume — desktop */}
      <p className="hidden lg:block text-sm text-zinc-400 tabular-nums">
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
