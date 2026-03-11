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

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex items-center justify-between"
    >
      {isFirst ? (
        <span className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-300 bg-white ring-1 ring-black/5 cursor-not-allowed select-none">
          ← Prev
        </span>
      ) : (
        <Link
          href={buildHref(currentPage - 1)}
          prefetch={false}
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-600 bg-white ring-1 ring-black/5 hover:bg-slate-50 transition-colors"
        >
          ← Prev
        </Link>
      )}

      <span className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </span>

      {isLast ? (
        <span className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-300 bg-white ring-1 ring-black/5 cursor-not-allowed select-none">
          Next →
        </span>
      ) : (
        <Link
          href={buildHref(currentPage + 1)}
          prefetch={false}
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-600 bg-white ring-1 ring-black/5 hover:bg-slate-50 transition-colors"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
