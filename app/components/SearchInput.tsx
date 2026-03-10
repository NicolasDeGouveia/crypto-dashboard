"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { createQueryString } from "@/app/_lib/utils";

const DEBOUNCE_MS = 350;

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const qs = createQueryString(searchParams, {
        q: value || null,
        page: null, // reset to page 1 on new search
      });
      router.replace(`${pathname}?${qs}`);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative">
      <label htmlFor="coin-search" className="sr-only">
        Search coins
      </label>
      <input
        id="coin-search"
        type="text"
        role="textbox"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search coins…"
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
