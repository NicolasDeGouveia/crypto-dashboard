type Props = {
  label: string;
  value: string;
  valueColor?: "default" | "success" | "danger";
};

export function StatCard({ label, value, valueColor = "default" }: Props) {
  const colorClasses = {
    default: "text-gray-900",
    success: "text-emerald-700",
    danger: "text-red-700",
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className={`mt-2 text-2xl font-bold ${colorClasses[valueColor]}`}>
        {value}
      </div>
    </div>
  );
}
