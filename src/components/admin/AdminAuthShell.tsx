import Link from "next/link";

type AdminAuthShellProps = {
  script: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

const META = [
  { value: "Kenya", label: "Origin" },
  { value: "30+ Years", label: "Expertise" },
  { value: "Private", label: "Access" },
];

export default function AdminAuthShell({
  script,
  title,
  description,
  children,
}: AdminAuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#140f07] text-[var(--ivory)]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-44 -top-44 h-[36rem] w-[36rem] opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(212,190,145,0.12) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute -bottom-56 -left-44 h-[40rem] w-[40rem] opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(129,151,88,0.13) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <aside className="relative hidden overflow-hidden lg:block">
          <img
            src="/admin/admin-auth.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(112deg, rgba(14,11,8,0.94) 0%, rgba(14,11,8,0.58) 40%, rgba(14,11,8,0.16) 66%, rgba(14,11,8,0.66) 100%), linear-gradient(0deg, rgba(14,11,8,0.88) 0%, rgba(14,11,8,0) 32%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 60% at 50% 0%, rgba(212,190,145,0.10) 0%, transparent 55%)",
            }}
          />

          <div className="relative flex h-full flex-col justify-between px-14 py-14 lg:px-16 lg:py-16">
            <Link
              href="/"
              className="group inline-flex w-fit items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#140f07]"
            >
              <span className="font-display text-lg font-semibold uppercase tracking-[0.18em] text-[var(--ivory)] transition-colors duration-300 group-hover:text-[var(--gold-light)]">
                Treadville
              </span>
              <span className="border border-[var(--gold-light)]/25 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.30em] text-[var(--gold-light)]/85">
                Ops
              </span>
            </Link>

            <div>
              <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.34em] text-[var(--gold-light)]">
                <span aria-hidden className="h-px w-10 bg-[var(--gold-light)]/50" />
                Operations Portal
              </p>
              <h2 className="mt-6 max-w-[14ch] font-display text-4xl italic leading-[1.06] tracking-[-0.02em] text-[var(--ivory)] xl:text-[3.4rem]">
                From Kenyan soil, to global markets.
              </h2>
              <p className="mt-6 max-w-[38ch] text-[0.9375rem] leading-relaxed text-[var(--ivory)]/65">
                Treadville operations, catalogue and trade enquiries — managed
                from one private surface, under the same standard as the
                products we export.
              </p>

              <div className="mt-12 flex items-center gap-12">
                {META.map((item) => (
                  <div key={item.label}>
                    <p className="font-display text-xl italic text-[var(--gold-light)]">
                      {item.value}
                    </p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-[var(--ivory)]/45">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="relative flex min-h-screen items-center justify-center px-6 py-24 sm:px-10 lg:min-h-0 lg:py-16">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:hidden">
              <p className="font-display text-2xl font-semibold uppercase tracking-[0.16em] text-[var(--ivory)]">
                Treadville
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.34em] text-[var(--gold-light)]">
                Operations Portal
              </p>
            </div>

            <div className="admin-auth-panel">
              <h1 className="font-display text-2xl italic text-[var(--ivory)]">
                {title}
              </h1>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--ivory)]/55">
                {description}
              </p>
              <div className="mt-8">{children}</div>
            </div>

            <div className="mt-8 flex items-center justify-between lg:hidden">
              {META.map((item) => (
                <div key={item.label} className="flex items-baseline gap-2">
                  <span className="font-display text-base italic text-[var(--gold-light)]">
                    {item.value}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-[var(--ivory)]/45">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ivory)]/40">
              <Link
                href="/"
                className="transition-colors hover:text-[var(--gold-light)]"
              >
                Back to storefront
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}