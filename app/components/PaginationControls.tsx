"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { createQueryString } from "@/app/_lib/utils";

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function PaginationControls({ currentPage, totalPages }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const buildHref = (page: number) =>
    `${pathname}?${createQueryString(searchParams, { page: String(page) })}`;

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  const btnBase = "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all";
  const btnActive = `${btnBase} glass glass-hover text-zinc-300 hover:text-zinc-100 hover:glow-violet`;
  const btnDisabled = `${btnBase} border border-white/5 bg-white/3 text-zinc-700 cursor-not-allowed select-none`;

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-between"
    >
      {isFirst ? (
        <span className={btnDisabled}>← Prev</span>
      ) : (
        <Link href={buildHref(currentPage - 1)} prefetch={false} className={btnActive}>
          ← Prev
        </Link>
      )}

      <span className="text-sm text-zinc-500 tabular-nums">
        Page {currentPage} of {totalPages}
      </span>

      {isLast ? (
        <span className={btnDisabled}>Next →</span>
      ) : (
        <Link href={buildHref(currentPage + 1)} prefetch={false} className={btnActive}>
          Next →
        </Link>
      )}
    </nav>
  );
}
