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

// Sorts a coin list client-side for sort keys not supported by the CoinGecko API
// (name_asc, name_desc, price_asc, price_desc). All other keys are no-ops (API-sorted).
export function sortCoins<T extends { name: string; current_price: number | null }>(
  coins: T[],
  sortKey: string
): T[] {
  const sorted = [...coins];
  if (sortKey === 'name_asc') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortKey === 'name_desc') {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortKey === 'price_asc') {
    sorted.sort((a, b) => {
      if (a.current_price == null && b.current_price == null) return 0;
      if (a.current_price == null) return 1;
      if (b.current_price == null) return -1;
      return a.current_price - b.current_price;
    });
  } else if (sortKey === 'price_desc') {
    sorted.sort((a, b) => {
      if (a.current_price == null && b.current_price == null) return 0;
      if (a.current_price == null) return 1;
      if (b.current_price == null) return -1;
      return b.current_price - a.current_price;
    });
  }
  return sorted;
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
