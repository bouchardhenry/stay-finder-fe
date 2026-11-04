import Link from "next/link";
import T from "@/components/typography";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start gap-4 px-6 py-10">
      <T.Header size="lg">Page not found</T.Header>
      <Link href="/" className="text-sm underline">
        Back to all stays
      </Link>
    </main>
  );
}
