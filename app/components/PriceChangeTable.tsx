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
    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <p className="text-sm font-medium text-slate-500 mb-3">Price Change</p>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(({ label, key }) => {
            const value = values[key];
            const isPositive = value != null && value >= 0;
            return (
              <tr key={label} className="border-b border-slate-100 last:border-0">
                <td className="py-2 text-slate-500 font-medium">{label}</td>
                <td
                  className={`py-2 text-right font-semibold ${
                    value == null
                      ? "text-slate-400"
                      : isPositive
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                >
                  {formatPercent(value)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
