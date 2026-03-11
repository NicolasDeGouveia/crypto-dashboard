import { formatPrice } from "@/app/_lib/utils";

type Props = {
  prices: number[];
  label?: string;
};

const PADDING_X = 72; // space for Y-axis price labels
const PADDING_Y = 12;
const VIEW_WIDTH = 600;
const VIEW_HEIGHT = 120;

export default function SparklineChart({ prices, label = "7-day price (USD)" }: Props) {
  if (!prices.length) return null;

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const chartLeft = PADDING_X;
  const chartRight = VIEW_WIDTH - PADDING_Y;
  const chartTop = PADDING_Y;
  const chartBottom = VIEW_HEIGHT - PADDING_Y;

  const points = prices
    .map((price, i) => {
      const x = chartLeft + (i / (prices.length - 1)) * (chartRight - chartLeft);
      const y = chartTop + (1 - (price - min) / range) * (chartBottom - chartTop);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const isUp = prices[prices.length - 1] >= prices[0];
  const color = isUp ? "#059669" : "#dc2626";

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        width="100%"
        aria-label={`${label} sparkline`}
        className="block"
      >
        {/* Grid lines */}
        <line x1={chartLeft} y1={chartTop} x2={chartRight} y2={chartTop} stroke="#e2e8f0" strokeWidth="1" />
        <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="#e2e8f0" strokeWidth="1" />

        {/* Y-axis labels */}
        <text x={chartLeft - 6} y={chartTop + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
          {formatPrice(max)}
        </text>
        <text x={chartLeft - 6} y={chartBottom} textAnchor="end" fontSize="11" fill="#94a3b8">
          {formatPrice(min)}
        </text>

        {/* Sparkline */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="mt-1 text-right text-xs text-zinc-400">{label}</p>
    </div>
  );
}
