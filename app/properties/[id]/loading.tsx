export default function LoadingProperty() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-10" aria-busy="true">
      <p className="text-sm text-zinc-500">Loading stay…</p>
      <div className="h-8 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
      <div className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
      <div className="h-72 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
    </main>
  );
}
