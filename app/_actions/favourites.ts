"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/app/_lib/db";
import { favourites } from "@/app/_lib/db/schema";
import { auth } from "@/app/_lib/auth";
import { ActionResult } from "@/app/_lib/types";

// ─── Validation ───────────────────────────────────────────────────────────────

const COIN_ID_REGEX = /^[a-z0-9-]+$/;

function validateCoinId(coinId: unknown): coinId is string {
  return (
    typeof coinId === "string" &&
    coinId.length > 0 &&
    coinId.length <= 100 &&
    COIN_ID_REGEX.test(coinId)
  );
}

// ─── addFavourite ─────────────────────────────────────────────────────────────

export async function addFavourite(coinId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, error: "UNAUTHENTICATED" };

  if (!validateCoinId(coinId))
    return { success: false, error: "INVALID_COIN_ID" };

  try {
    await db
      .insert(favourites)
      .values({ userId: session.user.id, coinId })
      .onConflictDoNothing(); // idempotent — unique constraint handles duplicates
  } catch (err) {
    console.error("[addFavourite]", { userId: session.user.id, coinId, err });
    return { success: false, error: "DB_ERROR" };
  }

  revalidatePath("/favourites");
  return { success: true };
}

// ─── removeFavourite ──────────────────────────────────────────────────────────

export async function removeFavourite(coinId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, error: "UNAUTHENTICATED" };

  if (!validateCoinId(coinId))
    return { success: false, error: "INVALID_COIN_ID" };

  try {
    await db
      .delete(favourites)
      .where(
        and(
          eq(favourites.userId, session.user.id),
          eq(favourites.coinId, coinId)
        )
      );
  } catch (err) {
    console.error("[removeFavourite]", { userId: session.user.id, coinId, err });
    return { success: false, error: "DB_ERROR" };
  }

  revalidatePath("/favourites");
  return { success: true };
}
