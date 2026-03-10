import { auth } from "./_lib/auth";
import { getCoinMarkets } from "./_lib/api";
import { DEFAULT_SORT, PAGE_SIZE, SORT_OPTIONS } from "./_lib/constants";
import { getUserFavouriteIds } from "./_lib/db/queries";
import CoinListItem from "./components/coin/CoinListItem";
import ErrorMessage from "./components/ui/ErrorMessage";
import FavouriteToggle from "./components/FavouriteToggle";
import PaginationControls from "./components/PaginationControls";
import SearchInput from "./components/SearchInput";
import SortableColumnHeader from "./components/SortableColumnHeader";

type Props = {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    q?: string;
  }>;
};

const TOTAL_COINS = 100;
const TOTAL_PAGES = Math.ceil(TOTAL_COINS / PAGE_SIZE);

const Home = async ({ searchParams }: Props) => {
  const { page: pageParam, sort: sortParam, q: queryParam } = await searchParams;

  const currentPage = Math.max(1, Math.min(parseInt(pageParam ?? "1", 10) || 1, TOTAL_PAGES));
  const currentSort = SORT_OPTIONS[sortParam ?? ""] ? (sortParam as string) : DEFAULT_SORT;

  const session = await auth();
  const favouriteIds = session?.user?.id
    ? await getUserFavouriteIds(session.user.id)
    : [];
  const isAuthenticated = Boolean(session?.user);

  // When searching: fetch more results and filter server-side (avoids misleading partial results)
  const isSearching = Boolean(queryParam?.trim());
  const coins = await getCoinMarkets({
    page: isSearching ? 1 : currentPage,
    sort: currentSort,
    perPage: isSearching ? 250 : PAGE_SIZE,
  });

  if (!coins) {
    return (
      <>
        <Header />
        <ErrorMessage
          title="Error loading cryptocurrency data"
          message="Unable to fetch prices. Please try again later."
        />
      </>
    );
  }

  const filtered = isSearching
    ? coins.filter(
        (c) =>
          c.name.toLowerCase().includes(queryParam!.toLowerCase()) ||
          c.symbol.toLowerCase().includes(queryParam!.toLowerCase())
      )
    : coins;

  return (
    <>
      <Header />

      <div className="mt-4 mb-3">
        <SearchInput />
      </div>

      {/* Column headers — desktop */}
      <div className="hidden lg:grid lg:grid-cols-[2rem_1fr_1fr_1fr_1fr_6rem] lg:items-center lg:gap-6 lg:px-5 lg:py-3 lg:text-sm lg:border-b lg:border-slate-200">
        <span className="text-slate-400 font-medium text-right text-xs">#</span>
        <SortableColumnHeader label="Name" sortKey="id_asc" />
        <SortableColumnHeader label="Price" sortKey="price_asc" />
        <SortableColumnHeader label="Market Cap" sortKey="market_cap_desc" />
        <SortableColumnHeader label="Volume" sortKey="volume_desc" />
        <SortableColumnHeader label="24h Change" sortKey="price_change_percentage_24h_desc" />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-slate-500 text-sm">
          No coins found for &ldquo;{queryParam}&rdquo;.
        </p>
      ) : (
        <div className="space-y-2 mt-2">
          {filtered.map((coin) => (
            <div key={coin.id} className="relative flex items-center gap-1">
              <div className="flex-1">
                <CoinListItem
                  id={coin.id}
                  name={coin.name}
                  symbol={coin.symbol}
                  image={coin.image}
                  price={coin.current_price}
                  priceChangePercent24h={coin.price_change_percentage_24h}
                  marketCap={coin.market_cap}
                  volume={coin.total_volume}
                  rank={coin.market_cap_rank}
                />
              </div>
              <div className="shrink-0">
                <FavouriteToggle
                  coinId={coin.id}
                  isFavourited={favouriteIds.includes(coin.id)}
                  isAuthenticated={isAuthenticated}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isSearching && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
        />
      )}
    </>
  );
};

function Header() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Crypto Dashboard
      </h1>
      <div className="my-4 border-t border-slate-200" />
    </>
  );
}

export default Home;
