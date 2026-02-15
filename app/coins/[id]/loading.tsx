import Link from "next/link";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Title skeleton */}
      <div className="h-9 bg-slate-200 rounded w-48 animate-pulse" />
      <div className="h-4 bg-slate-200 rounded w-16 animate-pulse mt-1" />
      <div className="my-4 border-t border-slate-200" />

      {/* Price cards skeleton */}
      <div className="grid gap-6 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5"
          >
            <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
            <div className="h-9 bg-slate-200 rounded w-32 animate-pulse mt-2" />
          </div>
        ))}
      </div>

      {/* 24h Change card skeleton */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
        <div className="h-9 bg-slate-200 rounded w-24 animate-pulse mt-2" />
      </div>
    </div>
  );
}
