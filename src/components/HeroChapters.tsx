import type { CSSProperties } from "react";

/**
 * Hand-crafted hero chapter compositions.
 *
 * Each composition is a layered SVG scene that reads as an advertising-campaign
 * still: a hero ensemble at believable scale (roughly 25–35% of the scene area,
 * ~27–33% in practice), grounded by contact shadows, lit by layered
 * key/ambient/rim light plus volumetric beams, and given depth with reflective
 * surfaces, colour spill, atmospheric haze, and shallow-focus foregrounds.
 *
 * The architecture is identical to a future <Image>-based chapter: the only swap
 * is replacing the <ChapterVisual> payload with a <picture> / <Image> element.
 *
 * All copy is derived from the verified Treadville repository content
 * (AGENTS.md §02, supabase/seed.sql). No fabricated claims, certifications,
 * farmer names, awards, or export destinations are present.
 *
 * These are generated prototype scenes — replaceable without rebuilding the
 * Hero architecture once client photography arrives.
 */

export type Chapter = {
  id: string;
  index: number;
  number: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  meta: { label: string; value: string }[];
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  atmosphere: string;     // background gradient (CSS)
  veil: string;            // foreground vignette
  accent: string;          // CSS var or hex
  spotlight: string;       // spotlight-warm / -emerald / -amber / -bone
  visual: "coffee-product" | "the-cup" | "tea" | "product-world";
};

export const CHAPTERS: Chapter[] = [
  {
    id: "treadville-coffee",
    index: 0,
    number: "01",
    eyebrow: "Treadville Specialty Coffee · Single Origin",
    title: "The volcanic highlands, in a single cup.",
    subtitle:
      "Specialty Arabica from the Kirinyaga highlands. Selected, processed, and exported under one standard of quality.",
    meta: [
      { label: "Origin", value: "Kirinyaga · Kenya" },
      { label: "Grade", value: "80+ SCA" },
      { label: "Process", value: "Washed · Anaerobic" },
    ],
    ctaLabel: "Explore the collection",
    ctaHref: "/shop/coffee",
    secondaryCtaLabel: "View the catalogue",
    secondaryCtaHref: "/shop",
    atmosphere:
      "radial-gradient(52% 62% at 72% 30%, rgba(201, 162, 74, 0.20) 0%, rgba(8, 5, 3, 0) 62%)," +
      "radial-gradient(60% 55% at 12% 92%, rgba(90, 42, 20, 0.30) 0%, rgba(8, 5, 3, 0) 60%)," +
      "linear-gradient(180deg, #0b0805 0%, #060402 100%)",
    veil:
      "linear-gradient(90deg, rgba(6, 4, 2, 0.78) 0%, rgba(6, 4, 2, 0.45) 30%, rgba(6, 4, 2, 0) 60%)," +
      "linear-gradient(180deg, rgba(6, 4, 2, 0.30) 0%, rgba(6, 4, 2, 0) 32%, rgba(6, 4, 2, 0) 55%, rgba(6, 4, 2, 0.55) 85%, rgba(6, 4, 2, 0.88) 100%)",
    accent: "var(--accent-coffee)",
    spotlight: "spotlight-warm",
    visual: "coffee-product",
  },
  {
    id: "the-cup",
    index: 1,
    number: "02",
    eyebrow: "The Cup",
    title: "Aroma. Body. The moment it lands.",
    subtitle:
      "Coffee roasted for the Kenyan table, then refined for the world. Served with the same standard it was grown with.",
    meta: [
      { label: "Body", value: "Rich · Velvety" },
      { label: "Crema", value: "Bronze · Persistent" },
      { label: "Note", value: "Cocoa · Citrus" },
    ],
    ctaLabel: "Discover Treadville Coffee",
    ctaHref: "/shop/coffee",
    secondaryCtaLabel: "See the catalogue",
    secondaryCtaHref: "/shop",
    atmosphere:
      "radial-gradient(58% 60% at 66% 26%, rgba(255, 226, 178, 0.18) 0%, rgba(8, 5, 3, 0) 62%)," +
      "radial-gradient(55% 55% at 85% 85%, rgba(169, 106, 44, 0.26) 0%, rgba(8, 5, 3, 0) 62%)," +
      "linear-gradient(180deg, #0c0805 0%, #060402 100%)",
    veil:
      "linear-gradient(90deg, rgba(6, 4, 2, 0.78) 0%, rgba(6, 4, 2, 0.45) 30%, rgba(6, 4, 2, 0) 60%)," +
      "linear-gradient(180deg, rgba(6, 4, 2, 0.30) 0%, rgba(6, 4, 2, 0) 32%, rgba(6, 4, 2, 0) 55%, rgba(6, 4, 2, 0.55) 85%, rgba(6, 4, 2, 0.88) 100%)",
    accent: "var(--accent-coffee)",
    spotlight: "spotlight-warm",
    visual: "the-cup",
  },
  {
    id: "tea",
    index: 2,
    number: "03",
    eyebrow: "Highland Tea",
    title: "Mist, leaf, and slow growth.",
    subtitle:
      "Treadville's tea programme — highland mist, single-estate processing, and the discipline of long-form agriculture.",
    meta: [
      { label: "Altitude", value: "Highland" },
      { label: "Process", value: "Orthodox · Slow" },
      { label: "Origin", value: "Kenya" },
    ],
    ctaLabel: "Enter the Tea chapter",
    ctaHref: "/shop/tea",
    secondaryCtaLabel: "View the collection",
    secondaryCtaHref: "/shop",
    atmosphere:
      "radial-gradient(52% 58% at 70% 28%, rgba(150, 180, 120, 0.14) 0%, rgba(4, 7, 5, 0) 62%)," +
      "radial-gradient(60% 55% at 12% 88%, rgba(38, 62, 42, 0.38) 0%, rgba(4, 7, 5, 0) 60%)," +
      "linear-gradient(180deg, #070b08 0%, #040604 100%)",
    veil:
      "linear-gradient(90deg, rgba(3, 6, 4, 0.78) 0%, rgba(3, 6, 4, 0.45) 30%, rgba(3, 6, 4, 0) 60%)," +
      "linear-gradient(180deg, rgba(3, 6, 4, 0.30) 0%, rgba(3, 6, 4, 0) 32%, rgba(3, 6, 4, 0) 55%, rgba(3, 6, 4, 0.55) 85%, rgba(3, 6, 4, 0.88) 100%)",
    accent: "var(--accent-tea)",
    spotlight: "spotlight-emerald",
    visual: "tea",
  },
  {
    id: "product-world",
    index: 3,
    number: "04",
    eyebrow: "The Agricultural Product World",
    title: "From Kenyan soil to global markets.",
    subtitle:
      "Coffee built the name. Tea, horticulture, and grains carry it forward — each with its own character, under one standard of quality.",
    meta: [
      { label: "Reach", value: "Local · Export" },
      { label: "Lines", value: "4 categories" },
      { label: "Standard", value: "Traceable · Verified" },
    ],
    ctaLabel: "View the full catalogue",
    ctaHref: "/shop",
    secondaryCtaLabel: "View the catalogue",
    secondaryCtaHref: "/shop",
    atmosphere:
      "radial-gradient(55% 60% at 74% 28%, rgba(217, 160, 74, 0.18) 0%, rgba(8, 5, 3, 0) 62%)," +
      "radial-gradient(55% 50% at 10% 90%, rgba(120, 78, 28, 0.26) 0%, rgba(8, 5, 3, 0) 60%)," +
      "linear-gradient(180deg, #0b0804 0%, #060402 100%)",
    veil:
      "linear-gradient(90deg, rgba(6, 4, 2, 0.78) 0%, rgba(6, 4, 2, 0.45) 30%, rgba(6, 4, 2, 0) 60%)," +
      "linear-gradient(180deg, rgba(6, 4, 2, 0.30) 0%, rgba(6, 4, 2, 0) 32%, rgba(6, 4, 2, 0) 55%, rgba(6, 4, 2, 0.55) 85%, rgba(6, 4, 2, 0.88) 100%)",
    accent: "var(--accent-grains)",
    spotlight: "spotlight-amber",
    visual: "product-world",
  },
];

type VisualProps = { className?: string; style?: CSSProperties };

/**
 * Shared scene furniture used by every chapter:
 * base environment, key light, vignette, and contact-shadow grounding.
 */

/** A soft coffee bean with a centre crease. */
function Bean({ x, y, s = 1, tone = "#2a1608" }: { x: number; y: number; s?: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="9" ry="12.5" fill={tone} />
      <path
        d="M 0 -10 C -2 -4, 2 4, 0 10"
        stroke="#c99a3d"
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
        strokeLinecap="round"
      />
      <ellipse cx="-3" cy="-5" rx="2.5" ry="4" fill="#000" opacity="0.28" />
    </g>
  );
}

/** A single drifting dust mote in a light shaft. */
function Speck({
  x,
  y,
  r = 1,
  o = 0.1,
  tone = "#ece3ce",
}: {
  x: number;
  y: number;
  r?: number;
  o?: number;
  tone?: string;
}) {
  return <circle cx={x} cy={y} r={r} fill={tone} opacity={o} />;
}

/**
 * Chapter 01 — Coffee (espresso/charcoal/copper/amber).
 * A stand-pouch bag as the dominant hero object (~27% of the scene), a layered
 * charcoal floor, warm key light from the upper left, a copper-labelled packaging
 * story, and an espresso cup + beans staged forward-left for real depth.
 */
function CoffeeProductVisual({ className, style }: VisualProps) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <linearGradient id="ca-studio" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1c1008" />
          <stop offset="55%" stopColor="#0b0603" />
          <stop offset="100%" stopColor="#070402" />
        </linearGradient>
        <radialGradient id="ca-keylight" cx="66%" cy="20%" r="62%">
          <stop offset="0%" stopColor="#fff0d0" stopOpacity="0.32" />
          <stop offset="45%" stopColor="#fff0d0" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#fff0d0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ca-ambient" cx="78%" cy="34%" r="55%">
          <stop offset="0%" stopColor="#a8461f" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#a8461f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ca-spill" cx="52%" cy="62%" r="52%">
          <stop offset="0%" stopColor="#c07a35" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#c07a35" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ca-vignette" cx="50%" cy="44%" r="68%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="62%" stopColor="#000" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.64" />
        </radialGradient>
        <linearGradient id="ca-beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3d9a4" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#f3d9a4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ca-beam2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f3d9a4" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#f3d9a4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ca-streak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9c887" stopOpacity="0.34" />
          <stop offset="55%" stopColor="#e9c887" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#e9c887" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ca-surface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0d07" />
          <stop offset="45%" stopColor="#0e0703" />
          <stop offset="100%" stopColor="#080403" />
        </linearGradient>
        <linearGradient id="ca-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c47c" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#e8c47c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ca-bag" x1="0" y1="0" x2="1" y2="0.42">
          <stop offset="0%" stopColor="#5a2a14" />
          <stop offset="26%" stopColor="#331709" />
          <stop offset="60%" stopColor="#1c0e06" />
          <stop offset="84%" stopColor="#120803" />
          <stop offset="100%" stopColor="#0c0502" />
        </linearGradient>
        <linearGradient id="ca-crimp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a2413" />
          <stop offset="100%" stopColor="#251109" />
        </linearGradient>
        <linearGradient id="ca-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c98a3a" />
          <stop offset="55%" stopColor="#a05a24" />
          <stop offset="100%" stopColor="#6e3a16" />
        </linearGradient>
        <linearGradient id="ca-ceramic" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2418" />
          <stop offset="60%" stopColor="#1d110a" />
          <stop offset="100%" stopColor="#120a06" />
        </linearGradient>
        <radialGradient id="ca-crema" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#d9a04a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#5a2c18" stopOpacity="0.15" />
        </radialGradient>
        <radialGradient id="ca-aura" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#7a3a1a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7a3a1a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Environment */}
      <rect width="1600" height="900" fill="url(#ca-studio)" />
      <rect width="1600" height="900" fill="url(#ca-keylight)" />
      <rect width="1600" height="900" fill="url(#ca-ambient)" />
      <rect width="1600" height="900" fill="url(#ca-spill)" />
      {/* Diagonal light shafts */}
      <polygon points="0,-160 440,-160 740,900 240,900" fill="url(#ca-beam)" />
      <polygon points="360,-160 560,-160 880,900 620,900" fill="url(#ca-beam2)" />
      <polygon points="742,-160 786,-160 1284,900 1240,900" fill="url(#ca-streak)" opacity="0.55" />
      <polygon points="986,-160 1004,-160 1500,900 1482,900" fill="url(#ca-streak)" opacity="0.8" />

      {/* Floor */}
      <rect x="0" y="640" width="1600" height="260" fill="url(#ca-surface)" />
      <line x1="0" y1="640" x2="1600" y2="640" stroke="#4a2412" strokeWidth="0.5" opacity="0.35" />
      <ellipse cx="1000" cy="690" rx="440" ry="62" fill="url(#ca-spill)" />
      <ellipse cx="1000" cy="662" rx="420" ry="34" fill="url(#ca-sheen)" />

      {/* Grounding shadows */}
      <ellipse cx="1010" cy="664" rx="300" ry="26" fill="#000" opacity="0.4" />
      <ellipse cx="1010" cy="661" rx="205" ry="17" fill="#000" opacity="0.62" />
      <ellipse cx="690" cy="662" rx="150" ry="17" fill="#000" opacity="0.5" />

      {/* Coffee grounds mound — under the bag's right base */}
      <ellipse cx="1214" cy="658" rx="86" ry="17" fill="#1a0c05" opacity="0.9" />
      <path d="M 1140 656 q 32 -28 76 -12 q 24 16 -6 26 q -34 12 -64 0 q -12 -8 -6 -14" fill="#24120a" opacity="0.7" />
      <path d="M 1158 654 q 12 -8 20 0 M 1186 658 q 14 -8 22 2" stroke="#4a2413" strokeWidth="1" fill="none" opacity="0.5" />

      {/* Coffee bag — dominant hero object */}
      <g transform="translate(1000 660) scale(1.12) translate(-1000 -660)">
        {/* Warm bounce light behind the bag */}
        <ellipse cx="1000" cy="440" rx="330" ry="350" fill="url(#ca-aura)" />
        {/* Body */}
        <path
          d="M 878 222 L 1126 222 L 1204 600 Q 1218 650 1156 656 L 1000 668 L 842 656 Q 780 650 794 600 Z"
          fill="url(#ca-bag)"
        />
        {/* Left edge — key light */}
        <path d="M 878 222 L 796 600" stroke="#ffd9a0" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" fill="none" />
        {/* Right edge — fall off */}
        <path d="M 1204 600 L 1126 222" stroke="#0d0603" strokeWidth="1" opacity="0.45" fill="none" />
        {/* Sheen panels on the left face */}
        <rect x="878" y="230" width="5" height="424" rx="2.5" fill="#e8c47c" opacity="0.3" />
        <rect x="886" y="226" width="2" height="428" rx="1" fill="#fff3df" opacity="0.34" />
        {/* Structural creases */}
        <path d="M 1000 240 L 1000 660" stroke="#000" strokeWidth="2" opacity="0.18" />
        <line x1="1136" y1="240" x2="1130" y2="596" stroke="#000" strokeWidth="1.2" opacity="0.18" />

        {/* Crimp seal */}
        <rect x="876" y="196" width="248" height="26" rx="5" fill="url(#ca-crimp)" />
        <line x1="878" y1="206" x2="1122" y2="206" stroke="#8a4520" strokeWidth="0.7" opacity="0.7" />
        <line x1="878" y1="212" x2="1120" y2="212" stroke="#8a4520" strokeWidth="0.6" opacity="0.5" />
        <rect x="878" y="222" width="248" height="9" fill="#000" opacity="0.35" />

        {/* Brand seal */}
        <g transform="translate(1000 372)">
          <circle r="74" fill="#0d0603" opacity="0.55" />
          <circle r="74" fill="none" stroke="#c99a3d" strokeWidth="1.2" opacity="0.6" />
          <circle r="63" fill="none" stroke="#c99a3d" strokeWidth="0.7" opacity="0.3" />
          <text textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="32" fill="#ece3ce" letterSpacing="0.04em">
            Treadville
          </text>
          <rect x="-44" y="24" width="88" height="1" fill="#c99a3d" opacity="0.35" />
          <text textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#c99a3d" letterSpacing="0.42em" y="42" opacity="0.85">
            SINGLE ORIGIN
          </text>
          <text textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="#b89a6a" letterSpacing="0.32em" y="56" opacity="0.6">
            KIRINYAGA · KENYA
          </text>
        </g>

        {/* Copper label plate */}
        <g transform="translate(1000 506)">
          <rect x="-104" y="-52" width="208" height="104" rx="4" fill="url(#ca-band)" />
          <rect x="-96" y="-44" width="192" height="88" rx="3" fill="none" stroke="#e8c47c" strokeWidth="0.6" opacity="0.5" />
          <text textAnchor="middle" fontFamily="monospace" fontSize="13" y="-14" fill="#f4ead2" letterSpacing="0.36em">
            TREADVILLE
          </text>
          <rect x="-64" y="-5" width="128" height="1" fill="#2a140a" opacity="0.5" />
          <text textAnchor="middle" fontFamily="monospace" fontSize="9" y="8" fill="#2a140a" letterSpacing="0.34em" opacity="0.9">
            SPECIALTY ARABICA
          </text>
          <text textAnchor="middle" fontFamily="monospace" fontSize="8" y="20" fill="#2a140a" letterSpacing="0.3em" opacity="0.75">
            WASHED · ANAEROBIC
          </text>
          <text textAnchor="middle" fontFamily="monospace" fontSize="6.8" y="36" fill="#1c0d04" letterSpacing="0.26em" opacity="0.6">
            80+ SCA · SINGLE ORIGIN
          </text>
        </g>

        {/* Gusset / base fold */}
        <path d="M 842 656 L 1156 656 L 1172 664 L 828 664 Z" fill="#120803" opacity="0.92" />
        <path d="M 894 656 L 1000 660 L 1106 656" stroke="#5a2c18" strokeWidth="1" fill="none" opacity="0.45" />
      </g>

      {/* Demitasse + saucer — forward-left foreground */}
      <g>
        <ellipse cx="690" cy="656" rx="132" ry="17" fill="#0a0503" opacity="0.75" />
        <ellipse cx="690" cy="652" rx="128" ry="18" fill="#24150c" />
        <ellipse cx="690" cy="650" rx="124" ry="17" fill="#1a0e06" />
        <ellipse cx="662" cy="649" rx="26" ry="4" fill="#5a4030" opacity="0.3" />
        <path
          d="M 600 518 L 600 598 Q 600 650 690 650 Q 780 650 780 598 L 780 518 Z"
          fill="url(#ca-ceramic)"
        />
        <path d="M 612 540 L 612 600 Q 612 644 690 646" stroke="#d9b98a" strokeWidth="1.2" fill="none" opacity="0.3" />
        <path d="M 603 528 L 603 596" stroke="#fff3df" strokeWidth="1" fill="none" opacity="0.28" />
        <path d="M 780 536 L 780 598 Q 780 650 690 650" stroke="#000" strokeWidth="1" fill="none" opacity="0.3" />
        {/* Handle */}
        <path
          d="M 780 590 C 848 590, 848 646, 780 646"
          fill="none"
          stroke="url(#ca-ceramic)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path d="M 780 590 C 836 590, 836 646, 780 646" fill="none" stroke="#000" strokeWidth="0.6" opacity="0.4" />
        {/* Rim + crema */}
        <ellipse cx="690" cy="516" rx="96" ry="15" fill="#150c06" />
        <ellipse cx="690" cy="514" rx="92" ry="14" fill="#2a1608" />
        <ellipse cx="690" cy="512" rx="84" ry="12" fill="url(#ca-crema)" />
        <ellipse cx="690" cy="512" rx="80" ry="11" fill="none" stroke="#7a4a20" strokeWidth="0.6" opacity="0.5" />
        {/* Steam */}
        <g stroke="#ece3ce" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.24">
          <path d="M 676 498 C 670 478, 682 462, 676 444 C 672 432, 680 422, 675 408" />
          <path d="M 698 498 C 694 482, 704 470, 700 454 C 698 444, 706 436, 702 424" />
        </g>
      </g>

      {/* Roasted beans — scattered, grounded */}
      <Bean x={560} y={684} s={0.8} />
      <Bean x={588} y={696} s={0.7} />
      <Bean x={836} y={690} s={0.75} />
      <Bean x={864} y={700} s={0.65} />
      <Bean x={956} y={702} s={0.6} />
      <Bean x={1016} y={694} s={0.55} />
      <Bean x={1172} y={688} s={0.85} tone="#3a2014" />
      <Bean x={1240} y={676} s={0.9} />

      {/* Out-of-focus foreground — bottom left */}
      <ellipse cx="210" cy="770" rx="270" ry="110" fill="#050201" opacity="0.42" />
      <ellipse cx="430" cy="790" rx="230" ry="85" fill="#050201" opacity="0.32" />
      <ellipse cx="120" cy="650" rx="95" ry="38" fill="#080402" opacity="0.55" />

      {/* Vignette + dust in the beam */}
      <rect width="1600" height="900" fill="url(#ca-vignette)" pointerEvents="none" />
      <Speck x={780} y={300} r={0.9} o={0.12} />
      <Speck x={980} y={350} r={1} o={0.1} />
      <Speck x={1180} y={520} r={0.7} o={0.09} />
      <Speck x={940} y={240} r={0.8} o={0.08} />
      <Speck x={860} y={430} r={0.6} o={0.1} />
      <Speck x={1360} y={470} r={0.8} o={0.07} />
    </svg>
  );
}

/**
 * Chapter 02 — The Cup (champagne/cream/amber).
 * An elegant cream cup with bronze crema and slow steam on a reflective
 * tabletop, lit directionally from the upper right with a true table
 * reflection, warm colour spill, and beans staged around the base.
 */
function CupVisual({ className, style }: VisualProps) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <linearGradient id="cb-studio" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#24170c" />
          <stop offset="55%" stopColor="#100a05" />
          <stop offset="100%" stopColor="#070402" />
        </linearGradient>
        <radialGradient id="cb-keylight" cx="70%" cy="18%" r="62%">
          <stop offset="0%" stopColor="#ffe9c2" stopOpacity="0.34" />
          <stop offset="50%" stopColor="#ffe9c2" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#ffe9c2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cb-ambient" cx="30%" cy="74%" r="58%">
          <stop offset="0%" stopColor="#a8562a" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#a8562a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cb-spill" cx="52%" cy="62%" r="52%">
          <stop offset="0%" stopColor="#f0c078" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#f0c078" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cb-vignette" cx="50%" cy="44%" r="68%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="64%" stopColor="#000" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.58" />
        </radialGradient>
        <linearGradient id="cb-beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff3df" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#fff3df" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cb-beam2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff3df" stopOpacity="0.025" />
          <stop offset="100%" stopColor="#fff3df" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cb-streak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3ddb0" stopOpacity="0.32" />
          <stop offset="55%" stopColor="#f3ddb0" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#f3ddb0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cb-surface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b1b0d" />
          <stop offset="45%" stopColor="#150c05" />
          <stop offset="100%" stopColor="#0a0503" />
        </linearGradient>
        <linearGradient id="cb-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c47c" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#e8c47c" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="cb-tablesheen" cx="62%" cy="10%" r="60%">
          <stop offset="0%" stopColor="#eec07a" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#eec07a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cb-ceramic" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#faf5ea" />
          <stop offset="58%" stopColor="#e4d6b9" />
          <stop offset="100%" stopColor="#a08d6d" />
        </linearGradient>
        <radialGradient id="cb-rimlight" cx="38%" cy="26%" r="55%">
          <stop offset="0%" stopColor="#fff9ee" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff9ee" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cb-liquor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a2410" />
          <stop offset="55%" stopColor="#250f06" />
          <stop offset="100%" stopColor="#0e0603" />
        </linearGradient>
        <radialGradient id="cb-crema" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#d9a04a" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#5a2c18" stopOpacity="0.18" />
        </radialGradient>
        <linearGradient id="cb-refl-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#201309" stopOpacity="0" />
          <stop offset="24%" stopColor="#201309" stopOpacity="0.32" />
          <stop offset="55%" stopColor="#0a0502" stopOpacity="0.86" />
          <stop offset="100%" stopColor="#090503" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#cb-studio)" />
      <rect width="1600" height="900" fill="url(#cb-keylight)" />
      <rect width="1600" height="900" fill="url(#cb-ambient)" />
      <rect width="1600" height="900" fill="url(#cb-spill)" />
      {/* Warm shafts from the upper right */}
      <polygon points="700,-160 1240,-160 1360,900 820,900" fill="url(#cb-beam)" />
      <polygon points="1160,-160 1420,-160 1480,900 1220,900" fill="url(#cb-beam2)" />
      <polygon points="900,-160 944,-160 520,900 476,900" fill="url(#cb-streak)" opacity="0.5" />
      <polygon points="1180,-160 1198,-160 860,900 842,900" fill="url(#cb-streak)" opacity="0.75" />

      {/* Reflective tabletop */}
      <rect x="0" y="646" width="1600" height="254" fill="url(#cb-surface)" />
      <line x1="0" y1="646" x2="1600" y2="646" stroke="#5a3a1c" strokeWidth="0.5" opacity="0.4" />
      <ellipse cx="1200" cy="700" rx="540" ry="70" fill="url(#cb-tablesheen)" />
      <path d="M 900 742 L 1180 742 M 820 792 L 1320 792" stroke="#eec07a" strokeWidth="0.5" opacity="0.12" />

      {/* Grounding shadows */}
      <ellipse cx="1010" cy="668" rx="320" ry="23" fill="#000" opacity="0.4" />
      <ellipse cx="1010" cy="666" rx="250" ry="16" fill="#000" opacity="0.35" />

      {/* The cup — hero of this frame */}
      <g transform="translate(1010 655) scale(1.1) translate(-1010 -655)">
        {/* Saucer */}
        <ellipse cx="1010" cy="654" rx="250" ry="24" fill="#150c06" />
        <ellipse cx="1010" cy="650" rx="246" ry="23" fill="url(#cb-ceramic)" opacity="0.95" />
        <ellipse cx="1010" cy="647" rx="232" ry="20" fill="#191006" opacity="0.4" />
        <ellipse cx="1152" cy="640" rx="44" ry="5" fill="#fff" opacity="0.12" />
        {/* Cup body — bright ceramic */}
        <path
          d="M 872 434 L 1148 434 L 1168 566 Q 1176 644 1128 650 L 1010 660 L 892 650 Q 844 644 852 566 Z"
          fill="url(#cb-ceramic)"
        />
        {/* Right side — key light */}
        <path d="M 1168 566 Q 1176 644 1128 650" stroke="#fff9ee" strokeWidth="2.4" fill="none" opacity="0.5" />
        <path d="M 1148 434 L 1162 500" stroke="#fff9ee" strokeWidth="1.4" opacity="0.55" fill="none" />
        {/* Left side — fall off */}
        <path d="M 872 470 Q 856 600 892 648" stroke="#24170c" strokeWidth="1.6" opacity="0.4" fill="none" />
        <path d="M 906 470 L 906 620" stroke="#fff" strokeWidth="1" opacity="0.2" />
        {/* Handle */}
        <path
          d="M 1148 512 C 1256 512, 1256 650, 1148 650"
          fill="none"
          stroke="url(#cb-ceramic)"
          strokeWidth="32"
          strokeLinecap="round"
        />
        <path
          d="M 1148 512 C 1256 512, 1256 650, 1148 650"
          fill="none"
          stroke="#2a1c10"
          strokeWidth="2"
          opacity="0.4"
        />
        <path d="M 1148 526 C 1236 530, 1246 604, 1178 640" stroke="#fff9ee" strokeWidth="1" opacity="0.3" fill="none" />
        {/* Rim — lit ceramic */}
        <ellipse cx="1010" cy="430" rx="156" ry="21" fill="#1a0e06" />
        <ellipse cx="1010" cy="428" rx="154" ry="20" fill="url(#cb-ceramic)" />
        <ellipse cx="1010" cy="428" rx="154" ry="20" fill="url(#cb-rimlight)" />
        <ellipse cx="1010" cy="428" rx="155" ry="21" fill="none" stroke="#d8c8a8" strokeWidth="0.8" opacity="0.5" />
        {/* Liquor + crema */}
        <ellipse cx="1010" cy="431" rx="142" ry="17" fill="url(#cb-liquor)" />
        <ellipse cx="1010" cy="430" rx="124" ry="13" fill="url(#cb-crema)" />
        <ellipse cx="1010" cy="429" rx="120" ry="12" fill="none" stroke="#a87b3a" strokeWidth="0.9" opacity="0.5" />
        {/* Crema web */}
        <g stroke="#e8c47c" strokeWidth="0.8" fill="none" opacity="0.4">
          <path d="M 1010 429 q 9 -26 5 -52" />
          <path d="M 1010 429 q -22 -14 -46 -7" />
          <path d="M 1010 429 q 30 -7 50 5" />
          <path d="M 1010 429 q -11 7 -32 0" />
        </g>
        {/* Rim hot point */}
        <ellipse cx="1096" cy="424" rx="30" ry="6" fill="#fff" opacity="0.3" />
        {/* Steam */}
        <g stroke="#ece3ce" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.28">
          <path d="M 982 404 C 968 360, 988 318, 974 274 C 964 238, 980 206, 970 166" />
          <path d="M 1016 404 C 1030 362, 1012 322, 1026 282 C 1036 248, 1020 218, 1028 184" />
          <path d="M 1046 404 C 1040 374, 1052 346, 1046 316 C 1042 292, 1052 268, 1048 244" />
        </g>
      </g>

      {/* Table reflection — mirrored and faded */}
      <clipPath id="cb-refl-clip">
        <rect x="0" y="646" width="1600" height="254" />
      </clipPath>
      <g clipPath="url(#cb-refl-clip)" opacity="0.2">
        <g transform="translate(0 1292) scale(1 -1)">
          <ellipse cx="1010" cy="650" rx="246" ry="23" fill="url(#cb-ceramic)" />
          <path
            d="M 872 434 L 1148 434 L 1168 566 Q 1176 644 1128 650 L 1010 660 L 892 650 Q 844 644 852 566 Z"
            fill="url(#cb-ceramic)"
          />
          <path
            d="M 1148 512 C 1256 512, 1256 650, 1148 650"
            fill="none"
            stroke="url(#cb-ceramic)"
            strokeWidth="32"
            strokeLinecap="round"
          />
        </g>
        <rect x="0" y="646" width="1600" height="254" fill="url(#cb-refl-fade)" />
      </g>

      {/* Beans on the table — grounded, small */}
      <Bean x={700} y={690} s={1} />
      <Bean x={752} y={706} s={0.8} />
      <Bean x={724} y={716} s={0.7} />
      <Bean x={1300} y={694} s={0.9} />
      <Bean x={1360} y={708} s={0.75} tone="#3a2014" />
      <Bean x={1324} y={722} s={0.65} />
      <Bean x={596} y={700} s={0.7} />
      {/* Grounds smear */}
      <ellipse cx="652" cy="726" rx="58" ry="10" fill="#180b05" opacity="0.8" />
      <ellipse cx="606" cy="720" rx="10" ry="3" fill="#24120a" opacity="0.7" />

      {/* Out-of-focus foreground — bottom right */}
      <ellipse cx="1460" cy="790" rx="210" ry="95" fill="#040201" opacity="0.5" />
      <ellipse cx="1290" cy="782" rx="150" ry="65" fill="#040201" opacity="0.4" />

      <rect width="1600" height="900" fill="url(#cb-vignette)" pointerEvents="none" />
      <Speck x={780} y={430} r={0.8} o={0.1} />
      <Speck x={1180} y={420} r={1} o={0.09} />
      <Speck x={1120} y={560} r={0.7} o={0.08} />
      <Speck x={820} y={560} r={0.65} o={0.08} />
      <Speck x={1400} y={360} r={0.8} o={0.07} />
    </svg>
  );
}

/**
 * Chapter 03 — Tea (obsidian/emerald/jade).
 * A large matte jade teapot with a jade caddie and a cup of brewed amber tea,
 * lit dramatically green from the upper left. Layered haze, ridge silhouettes
 * and drifting leaves give it altitude; a blurred foreground leaf grounds it.
 */
function TeaVisual({ className, style }: VisualProps) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <linearGradient id="te-studio" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b130d" />
          <stop offset="55%" stopColor="#060a06" />
          <stop offset="100%" stopColor="#040603" />
        </linearGradient>
        <radialGradient id="te-keylight" cx="62%" cy="20%" r="62%">
          <stop offset="0%" stopColor="#d8e4bd" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#d8e4bd" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#d8e4bd" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="te-glow" cx="68%" cy="56%" r="46%">
          <stop offset="0%" stopColor="#3c5230" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3c5230" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="te-spill" cx="52%" cy="62%" r="50%">
          <stop offset="0%" stopColor="#3c5230" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3c5230" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="te-vignette" cx="50%" cy="44%" r="68%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="64%" stopColor="#000" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.58" />
        </radialGradient>
        <linearGradient id="te-beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d8e4bd" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#d8e4bd" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="te-streak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8e4bd" stopOpacity="0.3" />
          <stop offset="55%" stopColor="#d8e4bd" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#d8e4bd" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="te-surface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d150f" />
          <stop offset="45%" stopColor="#07100a" />
          <stop offset="100%" stopColor="#040705" />
        </linearGradient>
        <linearGradient id="te-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#68804c" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#68804c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="te-pot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4c6338" />
          <stop offset="35%" stopColor="#2c4127" />
          <stop offset="70%" stopColor="#1a2c1b" />
          <stop offset="100%" stopColor="#0f1d10" />
        </linearGradient>
        <linearGradient id="te-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c4127" />
          <stop offset="100%" stopColor="#12200f" />
        </linearGradient>
        <linearGradient id="te-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b8cc90" />
          <stop offset="50%" stopColor="#6a8248" />
          <stop offset="100%" stopColor="#2d4026" />
        </linearGradient>
        <linearGradient id="te-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c98a3a" />
          <stop offset="55%" stopColor="#7a4a18" />
          <stop offset="100%" stopColor="#3a2008" />
        </linearGradient>
        <linearGradient id="te-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8c480" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#a8c480" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#te-studio)" />
      <rect width="1600" height="900" fill="url(#te-keylight)" />
      <rect width="1600" height="900" fill="url(#te-glow)" />
      <rect width="1600" height="900" fill="url(#te-spill)" />

      {/* Highland ridges — quiet, atmospheric */}
      <g opacity="0.15" fill="#3a5233">
        <path d="M 0 540 L 240 508 L 460 478 L 700 460 L 940 452 L 1200 462 L 1420 482 L 1600 498 L 1600 646 L 0 646 Z" />
      </g>
      <g opacity="0.22" fill="#22362a">
        <path d="M 0 612 L 260 586 L 500 562 L 760 548 L 1000 544 L 1240 552 L 1460 574 L 1600 588 L 1600 646 L 0 646 Z" />
      </g>

      {/* Floor */}
      <rect x="0" y="640" width="1600" height="260" fill="url(#te-surface)" />
      <line x1="0" y1="640" x2="1600" y2="640" stroke="#2d4026" strokeWidth="0.5" opacity="0.5" />
      <ellipse cx="1000" cy="690" rx="450" ry="62" fill="url(#te-sheen)" />
      <ellipse cx="1000" cy="666" rx="370" ry="24" fill="#000" opacity="0.34" />
      <ellipse cx="1000" cy="664" rx="270" ry="17" fill="#000" opacity="0.55" />
      <ellipse cx="1330" cy="664" rx="130" ry="14" fill="#000" opacity="0.5" />
      <ellipse cx="600" cy="672" rx="95" ry="12" fill="#000" opacity="0.5" />

      {/* Atmospheric haze band behind the pot */}
      <rect x="0" y="500" width="1600" height="260" fill="url(#te-haze)" />

      {/* Mist bands — mid depth */}
      <g opacity="0.16" stroke="#c4dca8" strokeWidth="0.8" fill="none" strokeLinecap="round">
        <path d="M 260 300 C 460 288, 660 306, 860 294 C 1060 282, 1280 302, 1480 292" />
        <path d="M 320 332 C 520 322, 720 340, 920 328 C 1120 316, 1320 336, 1500 326" opacity="0.7" />
        <path d="M 380 362 C 580 352, 780 370, 980 358 C 1180 346, 1380 366, 1540 356" opacity="0.5" />
      </g>

      {/* Green shaft from the upper left */}
      <polygon points="0,-160 260,-160 520,900 180,900" fill="url(#te-beam)" />
      <polygon points="820,-160 862,-160 1330,900 1288,900" fill="url(#te-streak)" opacity="0.5" />
      <polygon points="1120,-160 1136,-160 1520,900 1504,900" fill="url(#te-streak)" opacity="0.7" />

      {/* Botanical sprig — upper right, restrained */}
      <g transform="translate(1470 150) rotate(8)" opacity="0.6">
        <path d="M 0 180 C -30 120, -50 70, -60 10" stroke="#2d4026" strokeWidth="1.4" fill="none" />
        <path d="M -20 130 C -50 118, -70 136, -58 152 C -38 148, -24 138, -20 130 Z" fill="url(#te-leaf)" />
        <path d="M -36 84 C -66 70, -86 88, -74 104 C -54 100, -40 90, -36 84 Z" fill="url(#te-leaf)" />
        <path d="M -48 40 C -78 26, -98 44, -86 60 C -66 56, -52 46, -48 40 Z" fill="url(#te-leaf)" />
      </g>

      {/* Jade caddie — small open bowl, left foreground */}
      <g>
        <path d="M 540 644 Q 532 672 600 672 Q 668 672 660 644 Z" fill="url(#te-pot)" />
        <ellipse cx="600" cy="644" rx="62" ry="10" fill="#0d150f" />
        <path d="M 566 646 C 574 634, 594 631, 608 642 C 594 646, 578 648, 566 646 Z" fill="url(#te-leaf)" opacity="0.85" />
        <path d="M 622 646 C 630 636, 640 634, 648 642 C 636 646, 628 648, 622 646 Z" fill="#2d4026" opacity="0.8" />
        <path d="M 556 650 L 566 652" stroke="#a8c480" strokeWidth="1" opacity="0.2" />
      </g>

      {/* Teapot — matte jade, dominant hero object */}
      <g transform="translate(1000 660) scale(1.08) translate(-1000 -660)">
        {/* Bounced emerald glow behind pot */}
        <ellipse cx="1000" cy="470" rx="400" ry="270" fill="#2c4127" opacity="0.22" />
        {/* Body */}
        <path
          d="M 720 386 Q 660 540 780 616 Q 1000 668 1220 616 Q 1340 540 1280 386 Q 1000 344 720 386 Z"
          fill="url(#te-pot)"
        />
        {/* Left key-light edge */}
        <path d="M 720 386 Q 660 540 780 616" stroke="#e7f2c8" strokeWidth="2" opacity="0.5" fill="none" />
        <path d="M 748 392 Q 700 540 806 612" stroke="#d8e4bd" strokeWidth="1.2" opacity="0.45" fill="none" />
        {/* Right shadow edge */}
        <path d="M 1280 386 Q 1340 540 1220 616" stroke="#000" strokeWidth="1" opacity="0.4" fill="none" />
        {/* Sheen strip */}
        <rect x="768" y="396" width="6" height="210" rx="3" fill="#a8c480" opacity="0.14" />
        <rect x="772" y="402" width="2" height="196" rx="1" fill="#d8e4bd" opacity="0.2" />
        {/* Incised leaf motif */}
        <g stroke="#d8e4bd" strokeWidth="1" fill="none" opacity="0.18">
          <path d="M 980 470 C 990 456, 1006 450, 1018 456" />
          <path d="M 982 470 C 976 482, 986 494, 1000 496" />
        </g>
        {/* Lid */}
        <ellipse cx="1000" cy="340" rx="128" ry="22" fill="#12200f" />
        <ellipse cx="1000" cy="336" rx="124" ry="20" fill="url(#te-lid)" />
        <ellipse cx="1000" cy="332" rx="112" ry="16" fill="url(#te-pot)" opacity="0.9" />
        <line x1="884" y1="336" x2="1116" y2="336" stroke="#d8e4bd" strokeWidth="1" opacity="0.3" />
        <circle cx="1000" cy="308" r="11" fill="#b8cc90" opacity="0.85" />
        <circle cx="997" cy="305" r="3" fill="#e7f2c8" opacity="0.5" />
        {/* Spout */}
        <path d="M 1206 420 Q 1380 388 1420 342 L 1390 334 Q 1336 384 1190 402 Z" fill="url(#te-pot)" />
        <path d="M 1206 420 Q 1380 388 1420 342" stroke="#d8e4bd" strokeWidth="0.8" opacity="0.35" fill="none" />
        {/* Handle */}
        <path d="M 760 428 C 600 428, 600 616, 776 604" fill="none" stroke="url(#te-pot)" strokeWidth="40" strokeLinecap="round" />
        <path d="M 760 428 C 600 428, 600 602, 770 596" stroke="#000" strokeWidth="2" opacity="0.4" fill="none" />
        <path d="M 768 444 C 636 452, 636 600, 762 600" stroke="#d8e4bd" strokeWidth="1" opacity="0.18" fill="none" />
        {/* Steam */}
        <g stroke="#ece3ce" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.24">
          <path d="M 990 296 C 982 262, 994 226, 986 194 C 978 166, 990 142, 984 112" />
          <path d="M 1014 296 C 1006 266, 1020 234, 1012 204 C 1006 180, 1016 156, 1010 130" />
        </g>
        <path d="M 1416 334 C 1410 316, 1418 298, 1408 282" stroke="#ece3ce" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.18" />
      </g>

      {/* Cup of brewed tea — right, low */}
      <g>
        <ellipse cx="1330" cy="654" rx="104" ry="16" fill="#22321f" />
        <ellipse cx="1330" cy="652" rx="100" ry="15" fill="#16261a" />
        <path d="M 1298 606 L 1298 618 Q 1298 652 1330 652 Q 1362 652 1362 618 L 1362 606 Z" fill="url(#te-pot)" />
        <path d="M 1300 610 L 1300 618" stroke="#d8e4bd" strokeWidth="1" opacity="0.25" fill="none" />
        <ellipse cx="1330" cy="604" rx="64" ry="9" fill="#12200f" />
        <ellipse cx="1330" cy="602" rx="60" ry="8" fill="url(#te-liquid)" />
        <path d="M 1320 600 Q 1314 586 1320 574" stroke="#ece3ce" strokeWidth="0.8" strokeLinecap="round" opacity="0.22" fill="none" />
      </g>

      {/* Loose leaves — scattered, grounded */}
      <g transform="translate(520 700)">
        <path d="M 0 0 C 8 -14, 24 -17, 36 -6 C 24 0, 8 4, 0 0 Z" fill="url(#te-leaf)" opacity="0.85" />
        <path d="M 0 0 L 32 -6" stroke="#b8cc90" strokeWidth="0.4" opacity="0.4" />
      </g>
      <g transform="translate(470 720)">
        <path d="M 0 0 C 6 -10, 18 -13, 28 -5 C 18 0, 6 2, 0 0 Z" fill="#22321f" opacity="0.75" />
      </g>
      <g transform="translate(1200 690)">
        <path d="M 0 0 C 8 -14, 24 -17, 36 -6 C 24 0, 8 4, 0 0 Z" fill="url(#te-leaf)" opacity="0.8" />
        <path d="M 0 0 L 32 -6" stroke="#b8cc90" strokeWidth="0.4" opacity="0.4" />
      </g>
      <g transform="translate(1100 726)">
        <path d="M 0 0 C 6 -10, 18 -13, 28 -5 C 18 0, 6 2, 0 0 Z" fill="#22321f" opacity="0.7" />
      </g>
      {/* Drifting leaves — mid-air */}
      <g transform="translate(700 430) rotate(-24)" opacity="0.5">
        <path d="M 0 -18 C 13 -36, 32 -42, 46 -28 C 34 -14, 12 -8, 0 -18 Z" fill="url(#te-leaf)" />
        <path d="M 0 -18 L 42 -28" stroke="#b8cc90" strokeWidth="0.4" opacity="0.5" />
      </g>
      <g transform="translate(1380 392) rotate(38)" opacity="0.4">
        <path d="M 0 -16 C 10 -30, 26 -34, 38 -22 C 28 -12, 12 -8, 0 -16 Z" fill="url(#te-leaf)" />
      </g>

      {/* Out-of-focus foreground leaf — bottom left */}
      <g transform="translate(160 730)">
        <path d="M 0 60 C -40 20, -46 -40, -8 -78 C 36 -112, 96 -100, 90 -44 C 84 6, 54 88, 0 60 Z" fill="#07130a" opacity="0.55" />
        <path d="M 0 60 C -30 26, -36 -30, -6 -62 C 28 -90, 80 -80, 74 -34 C 70 4, 44 72, 0 60 Z" fill="#07130a" opacity="0.35" />
      </g>
      <ellipse cx="120" cy="760" rx="150" ry="60" fill="#030604" opacity="0.45" />

      <rect width="1600" height="900" fill="url(#te-vignette)" pointerEvents="none" />
      <Speck x={820} y={460} r={0.7} o={0.1} tone="#c4dca8" />
      <Speck x={1160} y={500} r={0.8} o={0.09} tone="#c4dca8" />
      <Speck x={1080} y={620} r={0.6} o={0.08} tone="#c4dca8" />
      <Speck x={700} y={360} r={0.7} o={0.08} tone="#c4dca8" />
    </svg>
  );
}

/**
 * Chapter 04 — Grains (charcoal/gold/champagne).
 * A bronze bowl of wheat grain on a dark pedestal with tall grain stalks, a
 * copper-lidded jar, and warm directional light from the upper right. The
 * abundant ensemble (~32% of the scene) reads as a curated harvest still.
 */
function ProductWorldVisual({ className, style }: VisualProps) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      style={style}
      aria-hidden
    >
      <defs>
        <linearGradient id="gr-studio" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#180f05" />
          <stop offset="55%" stopColor="#0a0603" />
          <stop offset="100%" stopColor="#070402" />
        </linearGradient>
        <radialGradient id="gr-keylight" cx="76%" cy="16%" r="60%">
          <stop offset="0%" stopColor="#fff0cf" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#fff0cf" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#fff0cf" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-glow" cx="60%" cy="56%" r="46%">
          <stop offset="0%" stopColor="#c98a3a" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#c98a3a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-spill" cx="54%" cy="62%" r="52%">
          <stop offset="0%" stopColor="#d9a04a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#d9a04a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-vignette" cx="50%" cy="44%" r="68%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="64%" stopColor="#000" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.58" />
        </radialGradient>
        <linearGradient id="gr-beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0db9e" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#f0db9e" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gr-beam2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0db9e" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#f0db9e" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gr-streak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0db9e" stopOpacity="0.32" />
          <stop offset="55%" stopColor="#f0db9e" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#f0db9e" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gr-surface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#120c05" />
          <stop offset="45%" stopColor="#0c0703" />
          <stop offset="100%" stopColor="#080402" />
        </linearGradient>
        <linearGradient id="gr-pedestal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241b10" />
          <stop offset="100%" stopColor="#130d06" />
        </linearGradient>
        <linearGradient id="gr-bowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cf8a3c" />
          <stop offset="55%" stopColor="#96571f" />
          <stop offset="100%" stopColor="#4a250e" />
        </linearGradient>
        <radialGradient id="gr-mound" cx="50%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#f6e3ab" />
          <stop offset="55%" stopColor="#cd9a45" />
          <stop offset="100%" stopColor="#8a5c1f" />
        </radialGradient>
        <linearGradient id="gr-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ecd395" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ecd395" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gr-stem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c9a34f" />
          <stop offset="100%" stopColor="#6e4a1c" />
        </linearGradient>
        <linearGradient id="gr-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0db9e" />
          <stop offset="100%" stopColor="#c9963f" />
        </linearGradient>
        <linearGradient id="gr-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f2ead6" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#f2ead6" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="gr-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5f2a" />
          <stop offset="100%" stopColor="#4a2c14" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#gr-studio)" />
      <rect width="1600" height="900" fill="url(#gr-keylight)" />
      <rect width="1600" height="900" fill="url(#gr-glow)" />
      <rect width="1600" height="900" fill="url(#gr-spill)" />
      {/* Warm shafts from the upper right */}
      <polygon points="1000,-160 1580,-160 1410,900 940,900" fill="url(#gr-beam)" />
      <polygon points="1180,-160 1400,-160 1500,900 1240,900" fill="url(#gr-beam2)" />
      <polygon points="700,-160 742,-160 300,900 258,900" fill="url(#gr-streak)" opacity="0.45" />
      <polygon points="1040,-160 1058,-160 640,900 622,900" fill="url(#gr-streak)" opacity="0.7" />

      {/* Floor */}
      <rect x="0" y="640" width="1600" height="260" fill="url(#gr-surface)" />
      <line x1="0" y1="640" x2="1600" y2="640" stroke="#4a2c12" strokeWidth="0.5" opacity="0.4" />
      <ellipse cx="1000" cy="700" rx="480" ry="62" fill="url(#gr-spill)" />
      <ellipse cx="1000" cy="654" rx="470" ry="22" fill="#000" opacity="0.42" />

      {/* Dark pedestal */}
      <rect x="560" y="592" width="880" height="54" rx="6" fill="url(#gr-pedestal)" />
      <rect x="560" y="592" width="880" height="6" fill="#3a2210" opacity="0.5" />
      <line x1="566" y1="602" x2="1434" y2="602" stroke="#4a2c12" strokeWidth="1" opacity="0.5" />
      <ellipse cx="1000" cy="592" rx="440" ry="24" fill="#1a0f06" />
      <ellipse cx="1000" cy="590" rx="430" ry="22" fill="none" stroke="#4a2c12" strokeWidth="1" opacity="0.6" />
      <ellipse cx="1000" cy="590" rx="330" ry="15" fill="url(#gr-sheen)" />

      {/* Wheat stalks — rising behind the bowl, leaning right */}
      <g>
        <g transform="translate(880 606)">
          <path d="M 0 0 Q 44 -120 158 -238" stroke="url(#gr-stem)" strokeWidth="2" fill="none" />
          <g transform="translate(158 -236) rotate(-18)">
            <rect x="-5" y="-92" width="10" height="92" rx="5" fill="url(#gr-head)" />
            <path d="M -7 -92 L -15 -112 M 0 -94 L 0 -114 M 7 -92 L 15 -112" stroke="#e8cc8a" strokeWidth="0.9" fill="none" />
            <path d="M -6 -64 L -11 -76 M 6 -64 L 11 -76 M -6 -40 L -11 -52 M 6 -40 L 11 -52 M -6 -16 L -11 -28 M 6 -16 L 11 -28" stroke="#c9963f" strokeWidth="0.8" fill="none" />
          </g>
        </g>
        <g transform="translate(945 610)">
          <path d="M 0 0 Q 30 -150 98 -276" stroke="url(#gr-stem)" strokeWidth="2.4" fill="none" />
          <g transform="translate(98 -276) rotate(-10)">
            <rect x="-5.5" y="-100" width="11" height="100" rx="5.5" fill="url(#gr-head)" />
            <path d="M -8 -100 L -18 -122 M 0 -102 L 0 -124 M 8 -100 L 18 -122" stroke="#e8cc8a" strokeWidth="1" fill="none" />
            <path d="M -7 -70 L -13 -84 M 7 -70 L 13 -84 M -7 -44 L -13 -58 M 7 -44 L 13 -58 M -7 -18 L -13 -32 M 7 -18 L 13 -32" stroke="#c9963f" strokeWidth="0.9" fill="none" />
          </g>
        </g>
        <g transform="translate(1015 610)">
          <path d="M 0 0 Q 4 -140 -34 -220" stroke="url(#gr-stem)" strokeWidth="2" fill="none" />
          <g transform="translate(-34 -220) rotate(12)">
            <rect x="-5" y="-88" width="10" height="88" rx="5" fill="url(#gr-head)" />
            <path d="M -7 -88 L -15 -108 M 0 -90 L 0 -110 M 7 -88 L 15 -108" stroke="#e8cc8a" strokeWidth="0.9" fill="none" />
            <path d="M -6 -60 L -11 -72 M 6 -60 L 11 -72 M -6 -36 L -11 -48 M 6 -36 L 11 -48" stroke="#c9963f" strokeWidth="0.8" fill="none" />
          </g>
        </g>
        <g transform="translate(1085 608)">
          <path d="M 0 0 Q -14 -104 -66 -170" stroke="url(#gr-stem)" strokeWidth="1.8" fill="none" />
          <g transform="translate(-66 -170) rotate(18)">
            <rect x="-4.5" y="-76" width="9" height="76" rx="4.5" fill="url(#gr-head)" />
            <path d="M -6 -76 L -12 -92 M 0 -78 L 0 -94 M 6 -76 L 12 -92" stroke="#e8cc8a" strokeWidth="0.8" fill="none" />
            <path d="M -5 -52 L -9 -62 M 5 -52 L 9 -62 M -5 -30 L -9 -40 M 5 -30 L 9 -40" stroke="#c9963f" strokeWidth="0.7" fill="none" />
          </g>
        </g>
        <g transform="translate(830 604)">
          <path d="M 0 0 Q 60 -108 150 -170" stroke="url(#gr-stem)" strokeWidth="1.8" fill="none" />
          <g transform="translate(150 -170) rotate(-24)">
            <rect x="-4.5" y="-78" width="9" height="78" rx="4.5" fill="url(#gr-head)" />
            <path d="M -6 -78 L -12 -94 M 0 -80 L 0 -96 M 6 -78 L 12 -94" stroke="#e8cc8a" strokeWidth="0.8" fill="none" />
            <path d="M -5 -54 L -9 -64 M 5 -54 L 9 -64 M -5 -32 L -9 -42 M 5 -32 L 9 -42" stroke="#c9963f" strokeWidth="0.7" fill="none" />
          </g>
        </g>
      </g>

      {/* Copper-lidded jar — left on the pedestal */}
      <g>
        <ellipse cx="690" cy="602" rx="58" ry="10" fill="#000" opacity="0.5" />
        <rect x="650" y="498" width="80" height="98" rx="10" fill="url(#gr-mound)" opacity="0.9" />
        <g fill="#8a5c1f" opacity="0.6">
          <ellipse cx="668" cy="520" rx="3" ry="4" />
          <ellipse cx="690" cy="530" rx="3" ry="4" />
          <ellipse cx="712" cy="516" rx="3" ry="4" />
          <ellipse cx="674" cy="548" rx="3" ry="4" />
          <ellipse cx="706" cy="556" rx="3" ry="4" />
          <ellipse cx="686" cy="572" rx="3" ry="4" />
        </g>
        <rect x="646" y="494" width="88" height="104" rx="12" fill="url(#gr-glass)" />
        <rect x="646" y="494" width="88" height="104" rx="12" fill="none" stroke="#e8ddc8" strokeWidth="1" opacity="0.35" />
        <path d="M 658 504 L 658 576" stroke="#fff" strokeWidth="1.6" opacity="0.25" />
        <rect x="650" y="478" width="80" height="16" rx="4" fill="url(#gr-lid)" />
        <ellipse cx="690" cy="478" rx="40" ry="6" fill="#3a2010" />
        <circle cx="690" cy="472" r="4" fill="#1c0f06" />
      </g>

      {/* Bronze bowl of grain — hero object */}
      <g transform="translate(1000 650) scale(1.08) translate(-1000 -650)">
        {/* Warm bounce behind the bowl */}
        <ellipse cx="1000" cy="560" rx="420" ry="250" fill="#8a5c1f" opacity="0.18" />
        {/* Bowl */}
        <path
          d="M 714 588 C 700 652, 776 654, 1000 654 C 1224 654, 1300 652, 1286 588 C 1172 646, 828 646, 714 588 Z"
          fill="url(#gr-bowl)"
        />
        <path d="M 886 592 C 900 664, 990 700, 1000 700 C 900 690, 810 620, 820 572 C 840 574, 870 584, 886 592 Z" fill="#000" opacity="0.18" />
        <path d="M 1000 588 C 1070 640, 1140 680, 1200 690" stroke="#ecd395" strokeWidth="1.6" opacity="0.35" fill="none" />
        <rect x="1180" y="640" width="3" height="46" rx="1.5" fill="#ecd395" opacity="0.5" />
        <path d="M 722 590 C 830 644, 1170 644, 1278 590" stroke="#f0db9e" strokeWidth="1.6" opacity="0.5" fill="none" />
        {/* Rim opening */}
        <ellipse cx="1000" cy="592" rx="294" ry="46" fill="#1a0e05" />
        <ellipse cx="1000" cy="588" rx="278" ry="40" fill="#0b0603" opacity="0.75" />
        {/* Grain mound */}
        <path d="M 730 592 Q 1000 356 1290 592 Q 1000 654 730 592 Z" fill="url(#gr-mound)" />
        <ellipse cx="1000" cy="424" rx="170" ry="64" fill="#fdf3cd" opacity="0.28" />
        {/* Mound texture strokes */}
        <g stroke="#a56a22" strokeWidth="0.7" fill="none" opacity="0.4">
          <path d="M 880 560 q 36 -22 70 -40" />
          <path d="M 920 540 q 46 -14 90 -18" />
          <path d="M 1040 536 q 40 -6 76 0" />
          <path d="M 960 512 q 50 -10 90 0" />
          <path d="M 860 544 q 30 4 58 14" />
          <path d="M 1120 552 q 20 8 40 16" />
        </g>
        {/* Individual kernels on the mound */}
        <g transform="translate(900 476) rotate(24)"><ellipse cx="0" cy="0" rx="7" ry="11" fill="#f6e3ab" /><path d="M 0 9 C -2 3, 2 -3, 0 -9" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(970 462) rotate(-18)"><ellipse cx="0" cy="0" rx="7" ry="11" fill="#ecd395" /><path d="M 0 9 C -2 3, 2 -3, 0 -9" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(930 448) rotate(50)"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#f0db9e" /><path d="M 0 8 C -2 2, 2 -2, 0 -8" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(1030 470) rotate(-40)"><ellipse cx="0" cy="0" rx="7" ry="11" fill="#f0db9e" /><path d="M 0 9 C -2 3, 2 -3, 0 -9" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(1080 464) rotate(30)"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#f6e3ab" /><path d="M 0 8 C -2 2, 2 -2, 0 -8" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(880 508) rotate(-30)"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#ecd395" /><path d="M 0 8 C -2 2, 2 -2, 0 -8" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(1160 500) rotate(20)"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#f0db9e" /><path d="M 0 8 C -2 2, 2 -2, 0 -8" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(1000 500) rotate(12)"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#f6e3ab" /><path d="M 0 8 C -2 2, 2 -2, 0 -8" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(1120 536) rotate(-20)"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#ecd395" /><path d="M 0 8 C -2 2, 2 -2, 0 -8" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(760 540) rotate(-70)"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#f0db9e" /><path d="M 0 8 C -2 2, 2 -2, 0 -8" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        {/* Grain spilling over the rim */}
        <ellipse cx="1000" cy="612" rx="214" ry="24" fill="url(#gr-mound)" opacity="0.8" />
        <g transform="translate(858 622) rotate(30)"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#ecd395" /><path d="M 0 8 C -2 2, 2 -2, 0 -8" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(886 632) rotate(12)"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#f0db9e" /><path d="M 0 8 C -2 2, 2 -2, 0 -8" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(1012 640) rotate(-20)"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#ecd395" /><path d="M 0 8 C -2 2, 2 -2, 0 -8" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(1106 632) rotate(40)"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#f6e3ab" /><path d="M 0 8 C -2 2, 2 -2, 0 -8" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
        <g transform="translate(1144 622) rotate(-14)"><ellipse cx="0" cy="0" rx="6" ry="10" fill="#ecd395" /><path d="M 0 8 C -2 2, 2 -2, 0 -8" stroke="#a56a22" strokeWidth="0.5" fill="none" /></g>
      </g>

      {/* Kernels scattered on pedestal + floor */}
      <ellipse cx="770" cy="600" rx="6" ry="10" fill="#ecd395" />
      <ellipse cx="806" cy="608" rx="5" ry="9" fill="#f0db9e" />
      <ellipse cx="748" cy="614" rx="5" ry="8" fill="#e8cc8a" />
      <ellipse cx="1260" cy="596" rx="6" ry="10" fill="#ecd395" />
      <ellipse cx="1308" cy="604" rx="5" ry="9" fill="#f0db9e" />
      <ellipse cx="1274" cy="612" rx="5" ry="8" fill="#e8cc8a" />
      <ellipse cx="980" cy="680" rx="5" ry="9" fill="#ecd395" />
      <ellipse cx="1024" cy="688" rx="5" ry="8" fill="#f0db9e" />
      <ellipse cx="1090" cy="676" rx="5" ry="9" fill="#ecd395" />
      <ellipse cx="1160" cy="668" rx="5" ry="8" fill="#e8cc8a" />

      {/* Horticulture nod — muted olive leaf, left edge */}
      <path d="M 60 690 C 88 668, 122 668, 142 690 C 118 700, 84 702, 60 690 Z" fill="#3c5230" opacity="0.5" />

      {/* Out-of-focus wheat foreground — bottom left */}
      <g transform="translate(180 730)" fill="#0f0a04">
        <rect x="-8" y="-40" width="14" height="40" rx="7" opacity="0.5" />
        <path d="M -10 -40 L -16 -56 M -1 -42 L -1 -60 M 8 -40 L 14 -56" stroke="#0f0a04" strokeWidth="2" opacity="0.5" />
        <rect x="18" y="-34" width="12" height="34" rx="6" opacity="0.4" />
        <path d="M 16 -34 L 12 -46 M 24 -36 L 24 -50 M 32 -34 L 36 -46" stroke="#0f0a04" strokeWidth="2" opacity="0.4" />
      </g>
      <ellipse cx="220" cy="770" rx="170" ry="70" fill="#050301" opacity="0.5" />

      <rect width="1600" height="900" fill="url(#gr-vignette)" pointerEvents="none" />
      <Speck x={840} y={420} r={0.8} o={0.11} tone="#f0db9e" />
      <Speck x={1180} y={440} r={1} o={0.1} tone="#f0db9e" />
      <Speck x={1120} y={560} r={0.7} o={0.08} tone="#f0db9e" />
      <Speck x={900} y={520} r={0.7} o={0.09} tone="#f0db9e" />
    </svg>
  );
}

/**
 * Renders the correct chapter visual. Used by HeroSlideshow.
 */
export function ChapterVisual({
  visual,
  className,
  style,
}: {
  visual: Chapter["visual"];
  className?: string;
  style?: CSSProperties;
}) {
  switch (visual) {
    case "coffee-product":
      return <CoffeeProductVisual className={className} style={style} />;
    case "the-cup":
      return <CupVisual className={className} style={style} />;
    case "tea":
      return <TeaVisual className={className} style={style} />;
    case "product-world":
      return <ProductWorldVisual className={className} style={style} />;
  }
}