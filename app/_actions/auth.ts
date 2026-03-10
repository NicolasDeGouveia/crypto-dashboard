"use server";

import { eq } from "drizzle-orm";
import argon2 from "@node-rs/argon2";
import { headers } from "next/headers";
import { db } from "@/app/_lib/db";
import { users } from "@/app/_lib/db/schema";
import { signIn } from "@/app/_lib/auth";
import { authRatelimit } from "@/app/_lib/redis";
import { ActionResult } from "@/app/_lib/types";

// ─── Validation helpers ────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: unknown): email is string {
  return (
    typeof email === "string" && email.length <= 254 && EMAIL_REGEX.test(email)
  );
}

function validatePassword(password: unknown): password is string {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    password.length <= 128
  );
}

// ─── register ─────────────────────────────────────────────────────────────────

export async function register(formData: FormData): Promise<ActionResult | void> {
  // Rate limit by IP — sliding window: 5 attempts per 15 minutes
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "anonymous";

  const { success: allowed } = await authRatelimit.limit(`register:${ip}`);
  if (!allowed) return { success: false, error: "RATE_LIMITED" };

  const email = formData.get("email");
  const password = formData.get("password");

  if (!validateEmail(email)) return { success: false, error: "INVALID_EMAIL" };
  if (!validatePassword(password))
    return { success: false, error: "PASSWORD_TOO_SHORT" };

  // Check for existing email
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

  if (existing) return { success: false, error: "EMAIL_IN_USE" };

  // Hash password with Argon2id defaults (memory=64MB, t=3, p=4 — OWASP compliant)
  const hash = await argon2.hash(password);

  try {
    await db
      .insert(users)
      .values({ id: crypto.randomUUID(), email, password: hash });
  } catch {
    return { success: false, error: "DB_ERROR" };
  }

  // signIn throws NEXT_REDIRECT — must be outside try/catch
  await signIn("credentials", { email, password, redirectTo: "/" });
}
