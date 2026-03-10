import CoinListSkeleton from "./components/coin/CoinListSkeleton";

export default function Loading() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Crypto Dashboard
      </h1>
      <div className="my-4 border-t border-slate-200" />
      <CoinListSkeleton />
    </>
  );
}
