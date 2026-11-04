import Link from "next/link";
import T from "@/components/typography";

/** G13: egen sida när ett boende inte finns. */
export default function PropertyNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start gap-4 px-6 py-10">
      <p className="text-sm font-medium text-zinc-500">404</p>
      <T.Header size="lg">This stay doesn&apos;t exist</T.Header>
      <p className="text-zinc-600 dark:text-zinc-400">
        It may have been removed by its owner, or the link is wrong.
      </p>
      <Link href="/" className="text-sm font-medium underline">
        Browse all stays
      </Link>
    </main>
  );
}
