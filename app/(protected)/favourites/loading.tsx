const SkeletonRow = () => (
  <div className="animate-pulse rounded-xl p-4 sm:p-5 flex items-center gap-3 glass">
    <div className="h-8 w-8 rounded-full bg-white/8 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-32 bg-white/8 rounded" />
      <div className="h-3 w-16 bg-white/8 rounded" />
    </div>
    <div className="h-4 w-20 bg-white/8 rounded" />
    <div className="h-6 w-14 bg-white/8 rounded-full" />
  </div>
);

export default function FavouritesLoading() {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="animate-pulse h-7 w-40 bg-white/8 rounded" />
      </div>
      <div className="border-t border-white/8 mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 5 }, (_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </>
  );
}
