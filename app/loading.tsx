import CoinListSkeleton from "./components/coin/CoinListSkeleton";

export default function Loading() {
  return (
    <>
      <div className="my-4 border-t border-white/8" />
      <CoinListSkeleton />
    </>
  );
}
