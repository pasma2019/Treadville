export default function Loading() {
  return (
    <main className="surface-warm">
      <div className="mx-auto max-w-[var(--content-wide)] px-6 pt-16 pb-24 md:pt-20 md:pb-32">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 rounded-sm bg-[var(--champagne)]/30" />
          <div className="h-12 w-72 rounded-sm bg-[var(--champagne)]/20" />
          <div className="mt-8 h-6 w-48 rounded-sm bg-[var(--champagne)]/15" />
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/5] w-full rounded-sm bg-[var(--champagne)]/15" />
                <div className="h-4 w-3/4 rounded-sm bg-[var(--champagne)]/10" />
                <div className="h-3 w-1/2 rounded-sm bg-[var(--champagne)]/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
