import { auth } from "@/app/_lib/auth";
import { db } from "@/app/_lib/db";
import { favourites } from "@/app/_lib/db/schema";
import { eq } from "drizzle-orm";
import { getCoinMarkets } from "@/app/_lib/api";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const rows = await db
    .select({ coinId: favourites.coinId })
    .from(favourites)
    .where(eq(favourites.userId, session.user.id));

  if (!rows.length) {
    return Response.json({ coins: [] });
  }

  const coinIds = rows.map((r) => r.coinId);
  const coins = await getCoinMarkets({ ids: coinIds, perPage: 250 });

  return Response.json({ coins: coins ?? [] });
}
