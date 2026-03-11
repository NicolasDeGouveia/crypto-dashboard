"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

type Props = {
  error?: string;
  callbackUrl?: string;
};

type FormValues = {
  email: string;
  password: string;
};

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 backdrop-blur-sm focus:border-violet-500/60 focus:bg-white/8 focus:outline-none focus:ring-1 focus:ring-violet-500/30";

export default function LoginForm({ error, callbackUrl }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: callbackUrl ?? "/",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        {formState.errors.email && (
          <p className="mt-1 text-xs text-red-400">{formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className={inputClass}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
        />
        {formState.errors.password && (
          <p className="mt-1 text-xs text-red-400">{formState.errors.password.message}</p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 ring-1 ring-red-500/20">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={formState.isSubmitting}
        className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formState.isSubmitting ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-zinc-300 hover:text-fuchsia-400 transition-colors">
          Register
        </Link>
      </p>
    </form>
  );
}
