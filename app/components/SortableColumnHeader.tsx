"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { createQueryString } from "@/app/_lib/utils";

type Props = {
  label: string;
  defaultSortKey: string;
  toggleSortKey: string;
};

export default function SortableColumnHeader({ label, defaultSortKey, toggleSortKey }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSort = searchParams.get("sort") ?? "market_cap_desc";

  const isActive = currentSort === defaultSortKey || currentSort === toggleSortKey;
  const nextSortKey = isActive && currentSort === defaultSortKey ? toggleSortKey : defaultSortKey;

  const href = `${pathname}?${createQueryString(searchParams, {
    sort: nextSortKey,
    page: "1",
  })}`;

  return (
    <Link
      href={href}
      prefetch={false}
      className={`flex items-center gap-1 text-xs font-medium uppercase tracking-wide transition-colors ${
        isActive
          ? "text-fuchsia-400"
          : "text-zinc-500 hover:text-zinc-200"
      }`}
    >
      {label}
      {isActive && (
        <span className="text-fuchsia-400">
          {currentSort.endsWith("_asc") ? "↑" : "↓"}
        </span>
      )}
    </Link>
  );
}
