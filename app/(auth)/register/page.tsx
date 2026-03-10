import { redirect } from "next/navigation";
import { auth } from "@/app/_lib/auth";
import RegisterForm from "@/app/components/RegisterForm";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2 text-center">
        Create account
      </h1>
      <p className="text-sm text-slate-500 text-center mb-8">
        Join Crypto Dashboard to save your favourite coins
      </p>
      <RegisterForm />
    </div>
  );
}
