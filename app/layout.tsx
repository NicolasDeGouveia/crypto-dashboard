import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { auth } from "./_lib/auth";
import UserNav from "./components/UserNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description:
    "Real-time cryptocurrency prices, market caps, and portfolio tracking.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100`}
      >
        <SessionProvider session={session}>
          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 flex items-center justify-between">
              <Link
                href="/"
                className="text-sm font-semibold text-zinc-900 hover:text-indigo-600 transition-colors shrink-0 dark:text-zinc-100 dark:hover:text-indigo-400"
              >
                Crypto Dashboard
              </Link>
              <UserNav />
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
