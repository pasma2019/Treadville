import Reveal from "@/components/Reveal";

type Stage = {
  number: string;
  label: string;
  line: string;
};

type ProvenanceProps = {
  eyebrow: string;
  headline: string;
  intro: string;
  stages: [Stage, Stage, Stage];
  closing: string;
  image?: string;
};

export default function Provenance({ eyebrow, headline, intro, stages, closing, image }: ProvenanceProps) {
  const [origin, craft, experience] = stages;

  return (
    <section
      aria-labelledby="provenance-heading"
      className="relative border-b border-[var(--line-on-light)] px-6 py-24 md:py-32 surface-warm"
    >
      {image ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover opacity-20"
            style={{ objectPosition: "center 40%" }}
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(251,248,241,0.55) 0%, rgba(251,248,241,0.20) 50%, rgba(251,248,241,0.55) 100%)",
            }}
          />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <Reveal as="div" delay={0} className="grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <p className="font-mono text-[12px] uppercase tracking-[0.32em] text-[var(--ink-muted)]">
              {eyebrow}
            </p>
            <h2
              id="provenance-heading"
              className="mt-5 max-w-[20ch] font-display text-3xl italic leading-[1.1] tracking-[-0.015em] text-[var(--ink)] md:text-5xl lg:text-[4rem]"
            >
              {headline}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-[var(--ink-soft)] md:text-[1.125rem]">
              {intro}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-12 md:gap-8">
          <Reveal as="div" delay={0} className="md:col-span-5">
            <StageBlock number={origin.number} label={origin.label} line={origin.line} />
          </Reveal>
          <Reveal as="div" delay={1} className="md:col-span-2">
            <Connector />
          </Reveal>
          <Reveal as="div" delay={2} className="md:col-span-5">
            <StageBlock number={craft.number} label={craft.label} line={craft.line} />
          </Reveal>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <Reveal as="div" delay={3} className="md:col-span-7 md:col-start-3">
            <StageBlock number={experience.number} label={experience.label} line={experience.line} emphasis />
          </Reveal>
        </div>

        <Reveal as="div" delay={3} className="mt-14 flex items-center gap-4 border-t border-[var(--line-on-light)] pt-6 md:mt-20">
          <span aria-hidden className="h-px w-10 bg-[var(--accent-sage)]" />
          <p className="text-[0.9375rem] text-[var(--ink-muted)]">
            {closing}
          </p>
        </Reveal>

        {/* Verified Treadville metadata — drawn from seed and AGENTS.md §02 */}
        <Reveal as="div" delay={3} className="mt-14 grid grid-cols-2 gap-8 border-t border-[var(--line-on-light)] pt-10 md:mt-16 md:grid-cols-4 md:gap-10">
          <DataPoint value="Highland" unit="Volcanic" label="Origin · Kirinyaga" />
          <DataPoint value="80+" unit="SCA" label="Specialty grade" />
          <DataPoint value="30+" unit="yrs" label="Industry expertise" />
          <DataPoint value="100%" unit="Arabica" label="Single-origin discipline" />
        </Reveal>
      </div>
    </section>
  );
}

function DataPoint({
  value,
  unit,
  label,
}: {
  value: string;
  unit: string;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl leading-none tracking-[-0.02em] text-[var(--ink)] md:text-5xl">
          {value}
        </span>
        <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--accent-sage)]">
          {unit}
        </span>
      </div>
      <p className="mt-3 max-w-[20ch] text-[0.875rem] leading-relaxed text-[var(--ink-muted)]">
        {label}
      </p>
    </div>
  );
}

function StageBlock({
  number,
  label,
  line,
  emphasis = false,
}: {
  number: string;
  label: string;
  line: string;
  emphasis?: boolean;
}) {
  return (
    <div className="group relative pl-5">
      <span
        aria-hidden
        className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px bg-[var(--line-on-light)] transition-colors duration-700 group-hover:bg-[var(--accent-sage)] group-focus-within:bg-[var(--accent-sage)]"
      />
        <p className="font-mono text-[12px] uppercase tracking-[0.32em] text-[var(--ink-muted)]">
        {number}
      </p>
      <h3
        className={`mt-3 font-display italic tracking-[-0.01em] text-[var(--ink)] ${
          emphasis ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
        }`}
      >
        {label}
      </h3>
      <p
        className={`mt-3 max-w-[36ch] leading-relaxed text-[var(--ink-soft)] ${
          emphasis ? "text-[1.0625rem] md:text-[1.125rem]" : "text-[1.0625rem]"
        }`}
      >
        {line}
      </p>
    </div>
  );
}

function Connector() {
  return (
    <div
      aria-hidden
      className="hidden h-full md:flex md:items-center md:justify-center"
    >
      <div className="relative h-full w-px">
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--line-on-light)]" />
        <span
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-sage)]"
        />
      </div>
    </div>
  );
}