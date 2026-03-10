import { auth } from "@/app/_lib/auth";
import { getUserFavouriteIds } from "@/app/_lib/db/queries";
import { getCoinMarkets } from "@/app/_lib/api";
import FavouritesList from "@/app/components/FavouritesList";
import ErrorMessage from "@/app/components/ErrorMessage";

export default async function FavouritesPage() {
  const session = await auth(); // session guaranteed by (protected) layout
  const userId = session!.user.id;

  const favouriteIds = await getUserFavouriteIds(userId);

  if (!favouriteIds.length) {
    return (
      <>
        <Header count={0} />
        <FavouritesList coins={[]} favouriteIds={[]} isAuthenticated={true} />
      </>
    );
  }

  const coins = await getCoinMarkets({ ids: favouriteIds, perPage: 250 });

  if (!coins) {
    return (
      <>
        <Header count={favouriteIds.length} />
        <ErrorMessage
          title="Error loading prices"
          message="Unable to fetch prices. Please try again later."
        />
      </>
    );
  }

  return (
    <>
      <Header count={coins.length} />
      <FavouritesList
        coins={coins}
        favouriteIds={favouriteIds}
        isAuthenticated={true}
      />
    </>
  );
}

function Header({ count }: { count: number }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          My Favourites
        </h1>
        {count > 0 && (
          <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-sm font-medium text-slate-600">
            {count}
          </span>
        )}
      </div>
      <div className="my-4 border-t border-slate-200" />
    </>
  );
}
