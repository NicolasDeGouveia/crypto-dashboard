import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith("/favourites");
      const isAuthRoute =
        nextUrl.pathname === "/login" ||
        nextUrl.pathname === "/register";

      if (isProtected && !isLoggedIn) return false; // redirects to pages.signIn
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
  providers: [], // No providers here — bcrypt/Argon2 cannot run on Edge
};
