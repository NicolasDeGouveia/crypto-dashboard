type Props = {
  prices: number[];
};

const WIDTH = 200;
const HEIGHT = 50;
const PADDING = 2;

export default function SparklineChart({ prices }: Props) {
  if (!prices.length) return null;

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1; // avoid division by zero for flat lines

  const points = prices
    .map((price, i) => {
      const x = PADDING + (i / (prices.length - 1)) * (WIDTH - PADDING * 2);
      const y = PADDING + (1 - (price - min) / range) * (HEIGHT - PADDING * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const isUp = prices[prices.length - 1] >= prices[0];
  const color = isUp ? "#059669" : "#dc2626"; // emerald-600 / red-600

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      aria-hidden="true"
      className="overflow-visible"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
