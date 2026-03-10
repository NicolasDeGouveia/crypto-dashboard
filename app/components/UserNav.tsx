import Link from "next/link";
import { auth, signOut } from "@/app/_lib/auth";

export default async function UserNav() {
  const session = await auth();

  if (!session?.user) {
    return (
      <nav className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
        >
          Sign up
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-4">
      <Link
        href="/favourites"
        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        My Favourites
      </Link>
      <span className="text-sm text-slate-500">{session.user.email}</span>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Log out
        </button>
      </form>
    </nav>
  );
}
