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
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        {formState.errors.email && (
          <p className="mt-1 text-xs text-red-600">{formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
        />
        {formState.errors.password && (
          <p className="mt-1 text-xs text-red-600">{formState.errors.password.message}</p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={formState.isSubmitting}
        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {formState.isSubmitting ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-slate-900 hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
