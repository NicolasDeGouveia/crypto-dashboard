import { redirect } from "next/navigation";
import { auth } from "@/app/_lib/auth";
import LoginForm from "@/app/components/auth/LoginForm";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  SessionRequired: "Your session has expired. Please sign in again.",
  CredentialsSignin: "Invalid email or password.",
  Default: "An error occurred. Please try again.",
};

type Props = {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user) redirect("/");

  const { error: authError, callbackUrl } = await searchParams;
  const errorMessage = authError ? (AUTH_ERROR_MESSAGES[authError] ?? AUTH_ERROR_MESSAGES.Default) : undefined;

  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2 text-center dark:text-zinc-100">
        Sign in
      </h1>
      <p className="text-sm text-zinc-500 text-center mb-8 dark:text-zinc-400">
        Welcome back to Crypto Dashboard
      </p>
      <LoginForm error={errorMessage} callbackUrl={callbackUrl} />
    </div>
  );
}
