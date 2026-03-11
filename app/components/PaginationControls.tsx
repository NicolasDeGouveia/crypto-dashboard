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

  const btnBase = "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors";
  const btnActive = `${btnBase} border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:border-violet-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:border-violet-700`;
  const btnDisabled = `${btnBase} border border-zinc-100 bg-white text-zinc-300 cursor-not-allowed select-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-700`;

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

      <span className="text-sm text-zinc-400 tabular-nums dark:text-zinc-500">
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
