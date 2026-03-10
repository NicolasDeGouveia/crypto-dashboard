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
      page: null, // reset to page 1 on new search
    });
    router.replace(`${pathname}?${qs}`);
  }, DEBOUNCE_MS);

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
        onChange={(e) => {
          setValue(e.target.value);
          handleChange(e.target.value);
        }}
        placeholder="Search coins…"
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            handleChange("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
