"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "@/app/_actions/auth";
import { ACTION_ERROR_MESSAGES, ActionResult } from "@/app/_lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? "Creating account…" : "Create account"}
    </button>
  );
}

export default function RegisterForm() {
  const [state, action] = useActionState<ActionResult | null, FormData>(
    async (_prev, formData) => {
      const result = await register(formData);
      return result ?? null;
    },
    null
  );
  const [clientError, setClientError] = useState<string | null>(null);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    if (password && password.length < 8) {
      e.preventDefault();
      setClientError("Password must be at least 8 characters.");
      return;
    }
    setClientError(null);
  };

  const serverError =
    state && !state.success
      ? ACTION_ERROR_MESSAGES[state.error]
      : null;

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          placeholder="you@example.com"
        />
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
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          placeholder="Min. 8 characters"
        />
      </div>

      {(clientError || serverError) && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
          {clientError ?? serverError}
        </p>
      )}

      <SubmitButton />

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-slate-900 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
