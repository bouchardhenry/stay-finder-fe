/** G13: laddningsvy för listan. */
export default function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      <p className="text-sm text-zinc-500">Loading stays…</p>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      ))}
    </div>
  );
}
