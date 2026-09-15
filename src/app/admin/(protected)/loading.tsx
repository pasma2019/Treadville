export default function AdminLoading() {
  return (
    <div className="max-w-[1200px]" aria-busy="true" aria-live="polite">
      <div className="h-3 w-24 animate-pulse rounded bg-[var(--line-on-light)]" />
      <div className="mt-3 h-10 w-48 animate-pulse rounded bg-[var(--line-on-light)]/70" />
      <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-[var(--line-on-light)]/60" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded border border-[var(--line-on-light)] bg-[var(--warm-white)]"
          >
            <div className="aspect-[4/3] animate-pulse bg-[var(--bone)]" />
            <div className="p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--line-on-light)]/70" />
              <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-[var(--line-on-light)]/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}