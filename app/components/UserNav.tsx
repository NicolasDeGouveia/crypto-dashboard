import Link from "next/link";
import { auth, signOut } from "@/app/_lib/auth";

export default async function UserNav() {
  const session = await auth();

  if (!session?.user) {
    return (
      <nav className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400"
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
        className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        My Favourites
      </Link>
      <span className="hidden sm:block text-sm text-zinc-400 truncate max-w-[160px] dark:text-zinc-500">
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
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Log out
        </button>
      </form>
    </nav>
  );
}
