type Props = {
  label: string;
  value: string;
  valueColor?: "default" | "success" | "danger";
};

export function StatCard({ label, value, valueColor = "default" }: Props) {
  const colorClasses = {
    default: "text-zinc-100",
    success: "text-emerald-400",
    danger: "text-red-400",
  };

  const glowClasses = {
    default: "",
    success: "hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]",
    danger: "hover:shadow-[0_0_20px_rgba(248,113,113,0.2)]",
  };

  return (
    <div className={`rounded-xl p-4 transition-all glass ${glowClasses[valueColor]}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      <div className={`mt-2 text-2xl font-bold tabular-nums ${colorClasses[valueColor]}`}>
        {value}
      </div>
    </div>
  );
}
