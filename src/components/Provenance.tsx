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
};

export default function Provenance({ eyebrow, headline, intro, stages, closing }: ProvenanceProps) {
  const [origin, craft, experience] = stages;

  return (
    <section
      aria-labelledby="provenance-heading"
      className="relative border-b border-[var(--line)] px-6 py-24 md:py-32"
      style={{ background: "var(--soil-muted)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 12% 0%, rgba(168, 70, 31, 0.10) 0%, rgba(14, 11, 8, 0) 55%)," +
            "radial-gradient(70% 50% at 92% 100%, rgba(176, 141, 87, 0.08) 0%, rgba(14, 11, 8, 0) 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(236, 227, 206, 0.55) 1px, transparent 0)",
          backgroundSize: "3px 3px",
        }}
      />

      <TopographicAnchor />

      <div className="relative z-10 mx-auto max-w-[var(--content-wide)]">
        <Reveal as="div" delay={0} className="grid grid-cols-1 items-end gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--parchment)]/50">
              {eyebrow}
            </p>
            <h2
              id="provenance-heading"
              className="mt-4 max-w-[20ch] font-display text-3xl italic leading-[1.1] tracking-[-0.01em] text-[var(--parchment)] md:text-5xl"
            >
              {headline}
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="max-w-md text-sm leading-relaxed text-[var(--parchment)]/60 md:text-base">
              {intro}
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-12 md:gap-8">
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

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <Reveal as="div" delay={3} className="md:col-span-7 md:col-start-3">
            <StageBlock number={experience.number} label={experience.label} line={experience.line} emphasis />
          </Reveal>
        </div>

        <Reveal as="div" delay={3} className="mt-16 flex items-center gap-4 border-t border-[var(--line)] pt-6 md:mt-24">
          <span
            aria-hidden
            className="h-px w-10 bg-[var(--accent)]"
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--parchment)]/50">
            {closing}
          </p>
        </Reveal>

        {/* Editorial data visualization — verified Treadville metadata.
            Drawn from the seed and AGENTS.md §02. No fabricated claims. */}
        <Reveal as="div" delay={3} className="mt-20 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-12 md:mt-28 md:grid-cols-4 md:gap-10">
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
    <div className="group">
      <div className="flex items-baseline gap-1">
        <span className="font-display text-3xl leading-none tracking-[-0.02em] text-[var(--parchment)] md:text-5xl">
          {value}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] md:text-xs">
          {unit}
        </span>
      </div>
      <p className="mt-3 max-w-[20ch] font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--parchment)]/50">
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
        className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px bg-[var(--line)] transition-colors duration-700 ease-[var(--ease-out)] group-hover:bg-[var(--accent)] group-focus-within:bg-[var(--accent)]"
      />
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--parchment)]/40">
        {number}
      </p>
      <h3
        className={`mt-3 font-display italic tracking-[-0.01em] text-[var(--parchment)] ${
          emphasis ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
        }`}
      >
        {label}
      </h3>
      <p
        className={`mt-3 max-w-[36ch] leading-relaxed text-[var(--parchment)]/65 ${
          emphasis ? "text-sm md:text-base" : "text-sm"
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
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--line)]" />
        <span
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]"
        />
      </div>
    </div>
  );
}

function TopographicAnchor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-56 flex-col items-end justify-center opacity-[0.10] mix-blend-soft-light md:flex lg:w-72 lg:opacity-[0.07]"
    >
      <svg
        viewBox="0 0 280 400"
        className="h-full w-auto"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
      >
        <path d="M10,390 C 40,370 80,360 100,340 C 120,320 130,290 140,260 C 150,230 145,195 150,165 C 155,135 160,110 155,85 C 150,60 140,40 130,28 C 120,16 115,14 112,12 C 109,10 107,10 108,8" />
        <path d="M30,390 C 60,365 100,350 120,325 C 140,300 150,265 160,235 C 170,205 165,170 170,140 C 175,110 180,85 175,60 C 170,35 160,18 150,8 C 143,2 140,2 138,1" />
        <path d="M50,390 C 80,360 120,340 140,310 C 160,280 165,245 175,215 C 185,185 180,150 185,120 C 190,90 195,65 190,42 C 185,20 175,8 165,2 C 158,-2 155,-1 153,0" />
        <path d="M70,390 C 100,355 140,330 158,295 C 176,260 178,225 185,192 C 192,159 188,125 192,98 C 196,72 198,48 194,28 C 190,10 180,2 170,-1" />
        <path d="M88,390 C 118,350 155,318 170,280 C 185,242 184,205 190,172 C 196,139 192,106 195,80 C 198,56 198,34 195,18 C 192,4 184,0 176,0" />
        <path d="M106,390 C 134,345 168,308 180,268 C 192,228 188,190 193,158 C 198,126 193,94 195,68 C 197,44 196,24 192,12" />
        <path d="M122,390 C 148,340 178,298 188,255 C 198,212 192,175 196,145 C 200,116 194,86 195,62 C 196,40 194,22 190,12" />
        <path d="M138,390 C 162,335 188,290 196,244 C 204,198 196,162 198,133 C 200,106 194,78 194,56 C 194,36 191,22 187,14" />
        <path d="M153,390 C 175,330 196,282 202,234 C 208,186 198,152 198,126 C 198,102 192,76 191,56 C 190,38 187,26 183,18" />
        <path d="M168,390 C 188,325 206,274 210,225 C 214,176 202,144 200,120 C 198,98 192,74 190,55 C 188,38 185,28 181,22" />
        <path d="M183,390 C 200,322 215,268 218,218 C 221,168 207,138 204,116 C 201,96 195,74 192,56 C 189,40 186,32 182,26" />
        <path d="M197,390 C 212,318 224,262 226,212 C 228,162 212,134 208,114 C 204,96 198,76 194,58 C 190,42 187,36 183,30" />
        <path d="M210,390 C 223,312 232,256 233,206 C 234,156 216,130 211,112 C 206,96 200,78 196,61 C 192,46 189,40 185,34" />
        <path d="M222,390 C 233,308 240,250 240,200 C 240,150 220,126 214,110 C 208,96 202,80 197,64 C 192,50 189,44 185,38" />
        <path d="M233,390 C 242,302 246,244 245,194 C 244,144 222,122 215,108 C 208,96 202,82 196,66 C 191,52 188,46 184,40" />
        <path d="M243,390 C 250,296 252,238 250,188 C 248,138 224,118 216,106 C 209,96 202,84 196,68 C 191,54 188,48 184,42" />
        <path d="M252,390 C 258,290 258,232 255,182 C 252,132 226,114 217,104 C 210,96 203,84 196,69 C 191,55 188,50 184,44" />
        <path d="M260,390 C 265,284 263,226 259,177 C 255,128 227,110 218,101 C 211,94 204,84 197,70 C 191,57 188,52 184,46" />
        <path d="M267,390 C 271,278 267,220 262,172 C 257,124 228,107 218,99 C 211,93 204,84 197,71 C 191,59 188,54 184,48" />
        <path d="M274,390 C 277,272 272,214 266,167 C 260,120 228,104 218,97 C 211,92 204,84 196,72 C 190,60 187,56 183,50" />
      </svg>
      <div className="mt-2 flex w-full items-center justify-end gap-2">
        <div className="h-px w-6 bg-[var(--accent)]" />
        <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-[var(--parchment)]/40">
          Mt. Kenya · 5,199m
        </span>
        <div className="h-px w-6 bg-[var(--parchment)]/20" />
      </div>
    </div>
  );
}
