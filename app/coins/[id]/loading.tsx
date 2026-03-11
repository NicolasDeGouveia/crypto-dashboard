import Link from "next/link";

export default function Loading() {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-300 mb-4 transition-colors"
      >
        ← Back to Dashboard
      </Link>

      <div className="h-9 bg-white/8 rounded w-48 animate-pulse" />
      <div className="h-4 bg-white/8 rounded w-16 animate-pulse mt-1" />
      <div className="my-4 border-t border-white/8" />

      <div className="grid gap-6 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl p-6 glass animate-pulse">
            <div className="h-4 bg-white/8 rounded w-24" />
            <div className="h-9 bg-white/8 rounded w-32 mt-2" />
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl p-6 glass animate-pulse">
        <div className="h-4 bg-white/8 rounded w-32" />
        <div className="h-9 bg-white/8 rounded w-24 mt-2" />
      </div>
    </>
  );
}
