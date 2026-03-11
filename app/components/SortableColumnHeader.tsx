"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { createQueryString } from "@/app/_lib/utils";

type Props = {
  label: string;
  sortKey: string;
};

export default function SortableColumnHeader({ label, sortKey }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSort = searchParams.get("sort") ?? "market_cap_desc";

  const isActive = currentSort === sortKey;

  const href = `${pathname}?${createQueryString(searchParams, {
    sort: sortKey,
    page: "1",
  })}`;

  return (
    <Link
      href={href}
      prefetch={false}
      className={`flex items-center gap-1 text-xs font-medium uppercase tracking-wide transition-colors ${
        isActive
          ? "text-violet-600 dark:text-violet-400"
          : "text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
      }`}
    >
      {label}
      {isActive && (
        <span className="text-violet-500 dark:text-violet-400">
          {sortKey.endsWith("_asc") ? "↑" : "↓"}
        </span>
      )}
    </Link>
  );
}
