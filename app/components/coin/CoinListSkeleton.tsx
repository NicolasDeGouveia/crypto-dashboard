import { PAGE_SIZE } from "@/app/_lib/constants";

const SkeletonRow = () => (
  <div
    data-testid="skeleton-row"
    className="animate-pulse rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5 lg:grid lg:grid-cols-[2rem_1fr_1fr_1fr_1fr_6rem] lg:items-center lg:gap-6"
  >
    <div className="hidden lg:block h-4 w-6 bg-slate-200 rounded" />
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0" />
      <div className="space-y-1.5">
        <div className="h-3.5 w-24 bg-slate-200 rounded" />
        <div className="h-3 w-10 bg-slate-200 rounded" />
      </div>
    </div>
    <div className="hidden lg:block h-4 w-20 bg-slate-200 rounded" />
    <div className="hidden lg:block h-4 w-24 bg-slate-200 rounded" />
    <div className="hidden lg:block h-4 w-20 bg-slate-200 rounded" />
    <div className="hidden lg:block h-6 w-16 bg-slate-200 rounded-full" />
  </div>
);

const PaginationSkeleton = () => (
  <div className="animate-pulse flex items-center justify-between mt-6">
    <div className="h-9 w-20 bg-slate-200 rounded-lg" />
    <div className="h-4 w-24 bg-slate-200 rounded" />
    <div className="h-9 w-20 bg-slate-200 rounded-lg" />
  </div>
);

export default function CoinListSkeleton() {
  return (
    <div>
      <div className="space-y-2 mt-2">
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
      <PaginationSkeleton />
    </div>
  );
}
