import "server-only";
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import argon2 from "@node-rs/argon2";
import { authConfig } from "./auth.config";
import { db } from "./db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "./db/schema";

// Dummy hash used to run Argon2 even when the user does not exist,
// preventing timing attacks that could enumerate valid email addresses.
const DUMMY_HASH =
  "$argon2id$v=19$m=65536,t=3,p=4$c2FsdHNhbHRzYWx0$dGhpcyBpcyBhIGR1bW15IGhhc2g";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : null;
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : null;

        if (!email || !password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        // Always run Argon2 verify — prevents timing-based account enumeration
        const hashToVerify = user?.password ?? DUMMY_HASH;
        const isValid = await argon2.verify(hashToVerify, password);

        if (!user || !isValid) return null;

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
});
