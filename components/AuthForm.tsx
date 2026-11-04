"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth";
import type { ApiErrorBody } from "@/types/api";
import FieldError from "./FieldError";
import T from "./typography";
import { buttonClassName, fieldClassName } from "./styles";

type AuthFormProps = {
  mode: "login" | "register";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<ApiErrorBody | null>(null);
  const [pending, setPending] = useState(false);

  // Skicka tillbaka användaren dit hen kom ifrån (t.ex. ett boende hen ville boka).
  const next = searchParams.get("next");
  const redirectTo = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

  const onSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));
    setError(null);
    setPending(true);
    const result = mode === "login" ? await auth.login(email, password) : await auth.register(email, password);
    setPending(false);
    if (result) {
      setError(result);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  };

  const isLogin = mode === "login";
  const otherHref = `${isLogin ? "/auth/register" : "/auth/login"}${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4" noValidate>
      <T.Header size="lg">{isLogin ? "Log in" : "Create an account"}</T.Header>
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input name="email" type="email" autoComplete="email" required className={fieldClassName} />
        <FieldError message={error?.errors?.email} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Password
        <input
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
          className={fieldClassName}
        />
        <FieldError message={error?.errors?.password} />
      </label>
      {error && !error.errors && <p className="text-sm text-red-600 dark:text-red-400">{error.message}</p>}
      <button type="submit" disabled={pending} className={buttonClassName}>
        {pending ? "Please wait…" : isLogin ? "Log in" : "Sign up"}
      </button>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {isLogin ? "No account yet? " : "Already have an account? "}
        <Link href={otherHref} className="font-medium underline">
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
