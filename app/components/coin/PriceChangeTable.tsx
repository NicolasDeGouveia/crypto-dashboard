import { formatPercent } from "@/app/_lib/utils";

type Props = {
  change24h: number | null;
  change7d: number | null;
  change30d: number | null;
};

const rows = [
  { label: "24h", key: "change24h" as const },
  { label: "7d", key: "change7d" as const },
  { label: "30d", key: "change30d" as const },
];

export default function PriceChangeTable({ change24h, change7d, change30d }: Props) {
  const values = { change24h, change7d, change30d };

  return (
    <div className="mt-6 rounded-xl p-6 glass">
      <p className="text-sm font-medium text-zinc-500 mb-3">Price Change</p>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(({ label, key }) => {
            const changeValue = values[key];
            const isPositive = changeValue != null && changeValue >= 0;
            return (
              <tr key={label} className="border-b border-white/6 last:border-0">
                <td className="py-2 text-zinc-400 font-medium">{label}</td>
                <td
                  className={`py-2 text-right font-semibold tabular-nums ${
                    changeValue == null
                      ? "text-zinc-600"
                      : isPositive
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {formatPercent(changeValue)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
