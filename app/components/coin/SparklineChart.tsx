import { formatPrice } from "@/app/_lib/utils";

type Props = {
  prices: number[];
  label?: string;
};

const PADDING_X = 72;
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

  const coords = prices.map((price, i) => ({
    x: chartLeft + (i / (prices.length - 1)) * (chartRight - chartLeft),
    y: chartTop + (1 - (price - min) / range) * (chartBottom - chartTop),
  }));

  const polylinePoints = coords.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  const fillPoints = [
    ...coords.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`),
    `${coords[coords.length - 1].x.toFixed(1)},${chartBottom}`,
    `${coords[0].x.toFixed(1)},${chartBottom}`,
  ].join(" ");

  const isUp = prices[prices.length - 1] >= prices[0];
  const lineColor = isUp ? "#a855f7" : "#f87171";
  const fillId = isUp ? "sparkFillUp" : "sparkFillDown";
  const fillColorStart = isUp ? "rgba(168,85,247,0.25)" : "rgba(248,113,113,0.25)";

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        width="100%"
        aria-label={`${label} sparkline`}
        className="block"
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColorStart} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={chartLeft} y1={chartTop} x2={chartRight} y2={chartTop} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Y-axis labels */}
        <text x={chartLeft - 6} y={chartTop + 4} textAnchor="end" fontSize="11" fill="#71717a">
          {formatPrice(max)}
        </text>
        <text x={chartLeft - 6} y={chartBottom} textAnchor="end" fontSize="11" fill="#71717a">
          {formatPrice(min)}
        </text>

        {/* Gradient fill */}
        <polygon points={fillPoints} fill={`url(#${fillId})`} />

        {/* Line */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="mt-1 text-right text-xs text-zinc-600">{label}</p>
    </div>
  );
}
