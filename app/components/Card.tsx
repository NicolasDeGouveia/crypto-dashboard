"use client";

import Image from "next/image";

type Props = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  percent: number;
};

const Card = ({ id, name, symbol, price, percent }: Props) => {
  const formattedPrice = `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const percentColor =
    percent >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700";

  return (
    <div
      className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5
                        lg:grid lg:grid-cols-5 lg:items-center lg:gap-6"
    >
      <div className="flex items-center justify-between lg:contents">
        <div className="flex items-center gap-3">
          <Image
            src={`/coins/${id}.svg`}
            alt={name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-medium text-slate-900 capitalize">{name}</p>
            <p className="text-sm text-slate-500 uppercase lg:hidden">
              {symbol}
            </p>
            <p className="lg:hidden text-lg font-semibold text-slate-900 mt-1">
              {formattedPrice}
            </p>
          </div>
        </div>

        <div className="lg:hidden flex flex-col items-center gap-0.5">
          <span className="text-xs text-slate-500 font-medium">24h</span>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${percentColor}`}
          >
            {percent >= 0 ? "+" : ""}
            {percent.toFixed(2)}%
          </span>
        </div>
      </div>

      <p className="hidden lg:block text-sm text-slate-500 uppercase">
        {symbol}
      </p>

      <p className="hidden lg:block text-lg font-semibold text-slate-900">
        {formattedPrice}
      </p>

      <div className="hidden lg:block">
        <span
          className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${percentColor}`}
        >
          {percent >= 0 ? "+" : ""}
          {percent.toFixed(2)}%
        </span>
      </div>

      <button className="hidden lg:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
        View Details →
      </button>
    </div>
  );
};

export default Card;
