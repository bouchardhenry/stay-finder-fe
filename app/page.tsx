import { Suspense } from "react";
import PropertyList from "@/components/PropertyList";
import ListSkeleton from "@/components/ListSkeleton";

export default async function Home({ searchParams }: PageProps<"/">) {
  // key = sökningen, så att laddningsvyn visas igen när filtret ändras.
  const key = JSON.stringify(await searchParams);
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10">
      <Suspense key={key} fallback={<ListSkeleton />}>
        <PropertyList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
