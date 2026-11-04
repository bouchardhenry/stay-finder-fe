"use client";

import Link from "next/link";
import T from "@/components/typography";
import { buttonClassName } from "@/components/styles";

/** G13: felvy när data inte kunde hämtas (t.ex. backend är nere). */
export default function ErrorView({ error, retry }: { error: unknown; retry: () => void }) {
  const message = error instanceof Error ? error.message : "Unknown error";
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start gap-4 px-6 py-10">
      <T.Header size="lg">Something went wrong</T.Header>
      <p className="text-zinc-600 dark:text-zinc-400">We could not load the data. Please try again.</p>
      <p className="font-mono text-xs text-zinc-500">{message}</p>
      <div className="flex gap-3">
        <button type="button" onClick={() => retry()} className={buttonClassName}>
          Try again
        </button>
        <Link href="/" className="px-2 py-2 text-sm underline">
          Go to start page
        </Link>
      </div>
    </main>
  );
}
