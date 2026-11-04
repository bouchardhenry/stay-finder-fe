import ListSkeleton from "@/components/ListSkeleton";

/** G13: laddningsvy medan data hämtas (visas automatiskt av Next.js via Suspense). */
export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10">
      <ListSkeleton />
    </main>
  );
}
