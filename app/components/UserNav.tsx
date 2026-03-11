import Link from "next/link";
import { auth, signOut } from "@/app/_lib/auth";

export default async function UserNav() {
  const session = await auth();

  if (!session?.user) {
    return (
      <nav className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-[0_0_20px_rgba(217,70,239,0.4)]"
        >
          Sign up
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-2 sm:gap-4">
      <Link
        href="/favourites"
        className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        My Favourites
      </Link>
      <span className="hidden sm:block text-sm text-zinc-600 truncate max-w-[160px]">
        {session.user.email}
      </span>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="rounded-full border border-white/10 px-3 py-1.5 text-sm font-medium text-zinc-400 hover:border-white/20 hover:text-zinc-100 transition-colors"
        >
          Log out
        </button>
      </form>
    </nav>
  );
}
