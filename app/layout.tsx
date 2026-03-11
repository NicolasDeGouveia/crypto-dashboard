import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-100 text-slate-900`}
      >
        <SessionProvider session={session}>
          <header className="border-b border-slate-200 bg-white shadow-sm">
            <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Crypto Dashboard
              </span>
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
