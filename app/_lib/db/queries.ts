import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { favourites } from "./schema";

/**
 * Returns the list of coinIds favourited by a user.
 * Wrapped in React.cache() — runs at most once per request
 * regardless of how many Server Components call it.
 */
export const getUserFavouriteIds = cache(
  async (userId: string): Promise<string[]> => {
    const rows = await db
      .select({ coinId: favourites.coinId })
      .from(favourites)
      .where(eq(favourites.userId, userId));
    return rows.map((r) => r.coinId);
  }
);
