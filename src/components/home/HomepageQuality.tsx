import Reveal from "@/components/Reveal";

const QUALITY_FACTS = [
  {
    number: "01",
    title: "SCA specialty grade",
    body: "Selected lots scoring 80+ on the Specialty Coffee Association scale — a benchmark we extend across our quality standards.",
  },
  {
    number: "02",
    title: "Traceable sourcing",
    body: "Every product carries its origin. We maintain full traceability from growing region through processing to final presentation.",
  },
  {
    number: "03",
    title: "Quality-assured handling",
    body: "SGS-referenced quality protocols and KEPHIS-compliant processes ensure products meet the standards their destinations require.",
  },
];

export default function HomepageQuality() {
  return (
    <section
      aria-labelledby="quality-heading"
      className="quality-panel relative overflow-hidden px-6 py-24 pb-16 md:py-32 md:pb-20"
    >
      {/* Subtle warm texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(184,134,11,0.12) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Atmospheric gold radial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 80%, rgba(184,134,11,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <Reveal as="div" delay={0}>
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--gold)]">
            Quality
          </p>
          <h2
            id="quality-heading"
            className="mt-6 max-w-[22ch] font-display text-[clamp(2rem,4vw,3.5rem)] italic leading-[1.06] tracking-[-0.02em] text-[var(--warm-white)]"
            style={{ textWrap: "balance" }}
          >
            Quiet confidence, verified.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-12">
          {QUALITY_FACTS.map((fact, i) => (
            <Reveal
              key={fact.number}
              as="div"
              delay={((i + 1) as 0 | 1 | 2 | 3 | 4 | 5)}
              className="group relative"
            >
              {/* Editorial index number */}
              <span className="quality-number block">
                {fact.number}
              </span>

              {/* Gold accent line */}
              <div
                aria-hidden
                className="mt-5 h-[2px] w-12 origin-left transition-all duration-700 group-hover:w-20"
                style={{ background: "var(--gold-gradient)" }}
              />

              <h3 className="mt-6 font-display text-[clamp(1.25rem,2vw,1.625rem)] italic leading-[1.12] text-[var(--warm-white)]">
                {fact.title}
              </h3>
              <p className="mt-4 max-w-[32ch] text-[0.9375rem] leading-[1.7] text-[var(--ivory)]/55">
                {fact.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
