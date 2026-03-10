export function formatPrice(price: number | null): string {
  if (price == null) return "—";
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatMarketCap(n: number | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000_000_000)
    return `$${(n / 1_000_000_000_000).toFixed(2)}T`;
  if (n >= 1_000_000_000)
    return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)
    return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${n.toLocaleString("en-US")}`;
}

export function formatVolume(n: number | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000_000)
    return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)
    return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${n.toLocaleString("en-US")}`;
}

export function formatSupply(n: number | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  return n.toLocaleString("en-US");
}

export function formatPercent(n: number | null): string {
  if (n == null) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Builds a query string preserving existing params and overriding specified keys
export function createQueryString(
  current: URLSearchParams,
  updates: Record<string, string | null>
): string {
  const params = new URLSearchParams(current.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  return params.toString();
}
