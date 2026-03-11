const SkeletonRow = () => (
  <div className="animate-pulse rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5 flex items-center gap-3">
    <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-32 bg-slate-200 rounded" />
      <div className="h-3 w-16 bg-slate-200 rounded" />
    </div>
    <div className="h-4 w-20 bg-slate-200 rounded" />
    <div className="h-6 w-14 bg-slate-200 rounded-full" />
  </div>
);

export default function FavouritesLoading() {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="animate-pulse h-7 w-40 bg-slate-200 rounded" />
      </div>
      <div className="border-t border-slate-200 mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 5 }, (_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </>
  );
}
