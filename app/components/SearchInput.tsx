"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { createQueryString } from "@/app/_lib/utils";

const DEBOUNCE_MS = 350;

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [value, setValue] = useState(searchParams.get("q") ?? "");

  const handleChange = useDebouncedCallback((query: string) => {
    const qs = createQueryString(searchParams, {
      q: query || null,
      page: null,
    });
    router.replace(`${pathname}?${qs}`);
  }, DEBOUNCE_MS);

  return (
    <div className="relative">
      <label htmlFor="coin-search" className="sr-only">
        Search coins
      </label>

      {/* Search icon */}
      <svg
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>

      <input
        id="coin-search"
        type="search"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleChange(e.target.value);
        }}
        placeholder="Search coins…"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-11 pr-10 text-sm text-zinc-100 placeholder-zinc-500 backdrop-blur-sm transition-all focus:border-violet-500/60 focus:bg-white/8 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30"
      />

      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            handleChange("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-zinc-500 hover:text-zinc-200 transition-colors"
          aria-label="Clear search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
