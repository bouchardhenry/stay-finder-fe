"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useAuth } from "@/contexts/auth";

/** Visar innehållet bara för inloggade, annars en uppmaning att logga in. */
export default function AuthGate({ children, message }: PropsWithChildren<{ message?: string }>) {
  const auth = useAuth();
  const pathname = usePathname();

  if (auth.isPending) {
    return <p className="text-sm text-zinc-500">Loading…</p>;
  }

  if (!auth.user) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm">{message ?? "You have to be logged in to do this."}</p>
        <div className="flex gap-3 text-sm">
          <Link
            href={`/auth/login?next=${encodeURIComponent(pathname)}`}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Log in
          </Link>
          <Link href={`/auth/register?next=${encodeURIComponent(pathname)}`} className="px-2 py-1.5 underline">
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
