import Link from "next/link";
import Reveal from "@/components/Reveal";
import CategoryImageLayer from "@/components/CategoryImageLayer";
import CategoryBadge from "@/components/home/CategoryBadge";
import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
};

const CATEGORY_META: Record<
  string,
  { descriptor: string; accent: string; tint: string; gradient: string }
> = {
  coffee: {
    descriptor: "High-altitude volcanic soils. Selected with the discipline the crop deserves.",
    accent: "var(--accent-coffee)",
    tint: "rgba(168,70,31,0.06)",
    gradient: "linear-gradient(165deg, rgba(168,70,31,0.04) 0%, transparent 60%)",
  },
  tea: {
    descriptor: "Highland mist, slow growth, leaf-by-leaf selection.",
    accent: "var(--accent-tea)",
    tint: "rgba(92,116,64,0.05)",
    gradient: "linear-gradient(165deg, rgba(92,116,64,0.04) 0%, transparent 60%)",
  },
  horticulture: {
    descriptor: "Fertile lowland fields, packed and graded for transit.",
    accent: "var(--accent-horticulture)",
    tint: "rgba(147,161,60,0.05)",
    gradient: "linear-gradient(165deg, rgba(147,161,60,0.04) 0%, transparent 60%)",
  },
  grains: {
    descriptor: "Sun-warmed plains, steady harvest, consistent quality.",
    accent: "var(--accent-grains)",
    tint: "rgba(201,154,61,0.05)",
    gradient: "linear-gradient(165deg, rgba(201,154,61,0.04) 0%, transparent 60%)",
  },
};

function metaFor(slug: string) {
  return (
    CATEGORY_META[slug] || {
      descriptor: "",
      accent: "var(--gold)",
      tint: "rgba(184,134,11,0.04)",
      gradient: "linear-gradient(165deg, rgba(184,134,11,0.03) 0%, transparent 60%)",
    }
  );
}

export default function HomepageProductWorlds({ categories }: Props) {
  if (categories.length === 0) return null;

  const primary = categories[0];
  const supporting = categories.slice(1);
  const primaryMeta = metaFor(primary.slug);

  return (
    <section
      aria-labelledby="product-worlds-heading"
      className="relative px-6 py-20 md:py-28"
      style={{
        background: "var(--bg-base)",
      }}
    >
      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <Reveal variant="light" as="div" delay={0}>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--gold)]">
            Product worlds
          </p>
          <h2
            id="product-worlds-heading"
            className="mt-6 max-w-[22ch] font-display text-[clamp(2rem,4vw,3.5rem)] italic leading-[1.06] tracking-[-0.02em] text-[var(--ink)]"
            style={{ textWrap: "balance" }}
          >
            Four categories. One standard.
          </h2>
        </Reveal>

        {/* Primary category — cinematic feature */}
        <Reveal variant="light" as="div" delay={0} className="mt-14 md:mt-20">
          <Link
            href={`/shop/${primary.slug}`}
            className="pw-primary-group group relative block overflow-hidden rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
            aria-label={`Explore ${primary.name}`}
          >
            <div className="pw-primary-stage relative w-full overflow-hidden">
              {primary.image_url ? (
                <CategoryImageLayer
                  src={primary.image_url}
                  className="pw-primary-image absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(80% 60% at 50% 30%, color-mix(in srgb, ${primaryMeta.accent} 12%, transparent) 0%, var(--bg-warm) 100%)`,
                  }}
                />
              )}

              {/* Atmospheric gradient scrim — shared photo-caption treatment */}
              <div
                className="photo-card-scrim pointer-events-none absolute inset-0"
                aria-hidden
              />

              {/* Category tint glow */}
              <div
                className="pw-accent-glow"
                aria-hidden
                style={{
                  background: `radial-gradient(40% 50% at 30% 70%, ${primaryMeta.tint} 0%, transparent 70%)`,
                }}
              />

              {/* Gold edge treatment — top accent line */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
                aria-hidden
                style={{ background: `linear-gradient(90deg, transparent 10%, ${primaryMeta.accent} 50%, transparent 90%)`, opacity: 0.4 }}
              />

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-14">
                <CategoryBadge label={primary.name} accent={primaryMeta.accent} />
                <h3
                  className="mt-2 font-display text-[clamp(2rem,4vw,3.5rem)] italic leading-[1.04] text-white"
                  style={{ textShadow: "0 2px 12px rgba(26,20,16,0.5)" }}
                >
                  {primary.name}
                </h3>
                <p className="mt-3 max-w-[42ch] text-[1rem] leading-relaxed text-white/80 md:text-[1.0625rem]">
                  {primaryMeta.descriptor}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span
                    className="font-mono text-[13px] uppercase tracking-[0.2em]"
                    style={{ color: primaryMeta.accent }}
                  >
                    Explore
                  </span>
                  <span
                    aria-hidden
                    className="pw-primary-line h-px bg-current"
                    style={{ color: primaryMeta.accent, width: "2rem" }}
                  />
                </div>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Supporting categories — editorial rail */}
        {supporting.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 md:mt-8 md:grid-cols-3 md:gap-6">
            {supporting.map((cat, i) => {
              const m = metaFor(cat.slug);
              const delay = ((i + 1) as 0 | 1 | 2 | 3 | 4 | 5);
              return (
                <Reveal key={cat.id} variant="light" as="div" delay={delay}>
                  <Link
                    href={`/shop/${cat.slug}`}
                    className="group relative block overflow-hidden rounded-[12px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]"
                    aria-label={`Explore ${cat.name}`}
                  >
                    <div
                      className="relative w-full overflow-hidden"
                      style={{ aspectRatio: "4 / 3" }}
                    >
                      {cat.image_url ? (
                        <CategoryImageLayer
                          src={cat.image_url}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] ease-[var(--ease-premium)] group-hover:scale-105 motion-reduce:transition-none"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(80% 60% at 50% 30%, color-mix(in srgb, ${m.accent} 10%, transparent) 0%, var(--bg-warm) 100%)`,
                          }}
                        />
                      )}

                      <div
                        className="photo-card-scrim pointer-events-none absolute inset-0"
                        aria-hidden
                      />

                      {/* Subtle category tint glow */}
                      <div
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                        aria-hidden
                        style={{
                          background: `radial-gradient(50% 60% at 50% 50%, ${m.tint} 0%, transparent 70%)`,
                        }}
                      />

                      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                        <CategoryBadge label={cat.name} accent={m.accent} />
                        <h3
                          className="mt-1.5 font-display text-[clamp(1.25rem,2.5vw,1.75rem)] italic leading-[1.08] text-white"
                          style={{ textShadow: "0 1px 8px rgba(26,20,16,0.5)" }}
                        >
                          {cat.name}
                        </h3>
                        <div
                          aria-hidden
                          className="mt-3 h-px w-8 origin-left transition-all duration-500 group-hover:w-12"
                          style={{ background: m.accent }}
                        />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
