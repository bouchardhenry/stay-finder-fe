"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth";

const linkClass =
  "text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white";

/** G3: olika navigering för inloggad användare och utloggad besökare. */
export default function AuthHeader() {
  const auth = useAuth();
  const router = useRouter();

  if (auth.isPending) {
    return <span className="text-sm text-zinc-400">…</span>;
  }

  if (!auth.user) {
    return (
      <nav className="flex items-center gap-4">
        <Link href="/auth/login" className={linkClass}>
          Log in
        </Link>
        <Link
          href="/auth/register"
          className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Sign up
        </Link>
      </nav>
    );
  }

  const onLogout = async () => {
    await auth.logout();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="flex flex-wrap items-center justify-end gap-4">
      <Link href="/host/properties/new" className={linkClass}>
        List a stay
      </Link>
      <Link href="/bookings" className={linkClass}>
        My bookings
      </Link>
      <span className="text-sm text-zinc-500" title="Logged in as">
        {auth.user.email}
      </span>
      <button type="button" onClick={onLogout} className={linkClass}>
        Log out
      </button>
    </nav>
  );
}
