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
      className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-slate-900 ${
        isActive ? "text-slate-900" : "text-slate-500"
      }`}
    >
      {label}
      {isActive && <span>{sortKey.endsWith("_asc") ? "↑" : "↓"}</span>}
    </Link>
  );
}
