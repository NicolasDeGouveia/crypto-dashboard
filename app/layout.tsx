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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0a0a1a] text-zinc-100`}
      >
        {/* Ambient background gradients */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-violet-900/20 blur-3xl" />
          <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-fuchsia-900/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-800/10 blur-3xl" />
        </div>

        <SessionProvider session={session}>
          <header className="sticky top-0 z-40 border-b border-white/8 bg-white/5 backdrop-blur-md">
            <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 flex items-center justify-between">
              <Link
                href="/"
                className="text-sm font-semibold text-zinc-100 hover:text-fuchsia-400 transition-colors shrink-0"
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
