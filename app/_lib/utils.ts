export function formatPrice(price: number | null): string {
  if (price == null) return "—";
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatMarketCap(amount: number | null): string {
  if (amount == null) return "—";
  if (amount >= 1_000_000_000_000)
    return `$${(amount / 1_000_000_000_000).toFixed(2)}T`;
  if (amount >= 1_000_000_000)
    return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000)
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatVolume(amount: number | null): string {
  if (amount == null) return "—";
  if (amount >= 1_000_000_000)
    return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000)
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatSupply(amount: number | null): string {
  if (amount == null) return "—";
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`;
  return amount.toLocaleString("en-US");
}

export function formatPercent(n: number | null): string {
  if (n == null) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
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
  for (const [paramKey, paramValue] of Object.entries(updates)) {
    if (paramValue === null) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, paramValue);
    }
  }
  return params.toString();
}
