"use client";

import { useState, useTransition } from "react";
import { getCoinChartData } from "@/app/_actions/getCoinChartData";
import { ChartPeriod } from "@/app/_lib/types";
import SparklineChart from "./SparklineChart";

const PERIODS: { value: ChartPeriod; label: string }[] = [
  { value: "1", label: "1D" },
  { value: "7", label: "7D" },
  { value: "30", label: "30D" },
  { value: "90", label: "90D" },
  { value: "365", label: "1Y" },
];

const PERIOD_LABELS: Record<ChartPeriod, string> = {
  "1": "1-day price (USD)",
  "7": "7-day price (USD)",
  "30": "30-day price (USD)",
  "90": "90-day price (USD)",
  "365": "1-year price (USD)",
};

const VALID_PERIODS = new Set<ChartPeriod>(["1", "7", "30", "90", "365"]);

function toValidPeriod(p: string): ChartPeriod {
  return VALID_PERIODS.has(p as ChartPeriod) ? (p as ChartPeriod) : "7";
}

type Props = {
  coinId: string;
  initialPeriod: string;
  initialPrices: number[];
};

export default function CoinChart({ coinId, initialPeriod, initialPrices }: Props) {
  const [activePeriod, setActivePeriod] = useState<ChartPeriod>(toValidPeriod(initialPeriod));
  const [prices, setPrices] = useState<number[]>(initialPrices);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (period: ChartPeriod) => {
    if (period === activePeriod) return;
    setActivePeriod(period);
    startTransition(async () => {
      const data = await getCoinChartData(coinId, period);
      if (data) setPrices(data);
    });
  };

  return (
    <div className="mb-4 rounded-xl p-4 glass">
      <div className="flex items-center gap-1.5 mb-3" role="group" aria-label="Chart period">
        {PERIODS.map(({ value, label }) => {
          const isActive = activePeriod === value;
          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              aria-pressed={isActive}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500/40 ${
                isActive
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-[0_0_16px_rgba(217,70,239,0.4)]"
                  : "text-zinc-500 hover:bg-white/8 hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className={isPending ? "opacity-50 transition-opacity" : "transition-opacity"}>
        {prices.length > 0 ? (
          <SparklineChart prices={prices} label={PERIOD_LABELS[activePeriod]} />
        ) : (
          <p className="py-8 text-center text-sm text-zinc-500">No chart data available.</p>
        )}
      </div>
    </div>
  );
}
