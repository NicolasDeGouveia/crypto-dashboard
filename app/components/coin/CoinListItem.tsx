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
  const percentBadgeColor =
    priceChangePercent24h != null && priceChangePercent24h >= 0
      ? "bg-emerald-50 text-emerald-700"
      : "bg-red-50 text-red-700";

  return (
    <Link
      href={`/coins/${id}`}
      className="block rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5 lg:grid lg:grid-cols-[2rem_1fr_1fr_1fr_1fr_6rem] lg:items-center lg:gap-6 transition-all hover:shadow-md hover:ring-slate-300"
    >
      {/* Rank */}
      <span className="hidden lg:block text-sm text-slate-400 font-medium text-right">
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
            <p className="font-medium text-slate-900 capitalize">{name}</p>
            <p className="text-sm text-slate-500 uppercase">{symbol}</p>
          </div>
        </div>

        {/* Mobile: price + percent stacked */}
        <div className="lg:hidden flex flex-col items-end gap-0.5">
          <p className="text-base font-semibold text-slate-900">
            {formatPrice(price)}
          </p>
          <span className={`rounded-full px-2.5 py-0.5 text-sm font-medium ${percentBadgeColor}`}>
            {formatPercent(priceChangePercent24h)}
          </span>
        </div>
      </div>

      {/* Price — desktop */}
      <p className="hidden lg:block text-sm font-semibold text-slate-900">
        {formatPrice(price)}
      </p>

      {/* Market cap — desktop */}
      <p className="hidden lg:block text-sm text-slate-600">
        {formatMarketCap(marketCap)}
      </p>

      {/* Volume — desktop */}
      <p className="hidden lg:block text-sm text-slate-600">
        {formatVolume(volume)}
      </p>

      {/* 24h change — desktop */}
      <div className="hidden lg:block">
        <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${percentBadgeColor}`}>
          {formatPercent(priceChangePercent24h)}
        </span>
      </div>
    </Link>
  );
};

export default CoinListItem;
