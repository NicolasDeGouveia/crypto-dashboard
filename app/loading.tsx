export default function Loading() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Crypto Dashboard
      </h1>
      <div className="my-4 border-t border-slate-200" />

      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6 lg:px-5 lg:py-3 lg:mb-2">
        <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-16 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-20 animate-pulse" />
      </div>

      <div className="space-y-4 lg:space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5 lg:grid lg:grid-cols-4 lg:items-center lg:gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded w-12 animate-pulse lg:hidden" />
                <div className="h-5 bg-slate-200 rounded w-32 animate-pulse lg:hidden" />
              </div>
            </div>

            <div className="hidden lg:block h-4 bg-slate-200 rounded w-12 animate-pulse" />

            <div className="hidden lg:block h-6 bg-slate-200 rounded w-28 animate-pulse" />

            <div className="hidden lg:block h-8 bg-slate-200 rounded w-20 animate-pulse" />
          </div>
        ))}
      </div>
    </>
  );
}
