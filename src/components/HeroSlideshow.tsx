"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { CHAPTERS } from "./HeroChapters";
import { ChapterVisual } from "./HeroChapters";

export default function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % CHAPTERS.length);
    }, 9000);
  }, []);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    startAuto();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, startAuto]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setActive((a) => (a - 1 + CHAPTERS.length) % CHAPTERS.length);
      if (e.key === "ArrowRight") setActive((a) => (a + 1) % CHAPTERS.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const goTo = (i: number) => {
    setActive(i);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const chapter = CHAPTERS[active];

  return (
    <section
      ref={sectionRef}
      aria-label="Treadville hero — cinematic brand chapters"
      className="relative isolate min-h-[calc(100svh-var(--site-header-h))] overflow-hidden"
      style={{ background: chapter.atmosphere }}
    >
      {/* Chapter images — full-bleed crossfade layer. The visual world
          fills the entire section (16:9 source crops into it) so the hero
          reads as a brand-film frame, not an illustration inside a box. */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
        {CHAPTERS.map((c, i) => (
          <div
            key={c.id}
            className={`chapter ${i === active ? "chapter-active" : ""}`}
            aria-hidden={i !== active}
          >
            <div className="absolute inset-x-0 top-0 h-[34svh] overflow-hidden md:inset-0 md:h-auto">
              <ChapterVisual visual={c.visual} className="h-full w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Film scrim — keeps the typography legible over the cinematic world
          without a glass panel. Left + bottom fall-off, bright moments stay. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: chapter.veil }}
      />

      {/* Spotlight overlay — atmospheric glow from visual direction */}
      <div
        aria-hidden
        className={`absolute inset-0 z-[1] opacity-60 pointer-events-none ${chapter.spotlight} mix-blend-overlay`}
      />

      {/* Top scrim — keeps the floating navigation legible over bright frames */}
      <div aria-hidden className="hero-scrim pointer-events-none absolute inset-x-0 top-0 z-[2] h-40 md:h-52" />

      {/* Top provenance bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-6 pt-10 md:pt-14">
        <div className="mx-auto flex max-w-[var(--content-cinema)] items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--parchment)]/60">
            Volcanic Highlands · Kenya
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--parchment)]/40">
            {chapter.number} / {String(CHAPTERS.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Main content — editorial typography over image */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-var(--site-header-h))] max-w-[var(--content-cinema)] flex-col justify-end px-6 pb-16 pt-16 md:pb-20 md:pt-20">
        <div className="max-w-[320px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[440px] xl:max-w-[480px]">
          <p className="font-body text-[11px] font-medium uppercase tracking-[0.3em] text-[var(--gold)]">
            {chapter.eyebrow}
          </p>
          <h1
            id="hero-headline"
            className="mt-4 font-display text-[2.5rem] font-semibold uppercase leading-[1.02] tracking-[0.005em] text-[var(--parchment)] sm:text-5xl md:text-6xl xl:text-[4.25rem]"
            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.5)" }}
          >
            {chapter.title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--parchment)]/80 md:text-[1.0625rem]">
            {chapter.subtitle}
          </p>

          {/* Verified meta — editorial data, not claims */}
          <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2">
            {chapter.meta.map((m) => (
              <div key={m.label} className="flex flex-col gap-0.5">
                <span className="font-body text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]/70">
                  {m.label}
                </span>
                <span className="font-display text-base italic text-[var(--parchment)]/95">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={chapter.ctaHref}
              className="btn btn-ghost border-[var(--gold)]/70 text-[var(--cream)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              {chapter.ctaLabel}
            </Link>
            <Link
              href={chapter.secondaryCtaHref}
              className="group inline-flex items-center gap-3 text-sm font-medium text-[var(--parchment)]/70 transition-colors hover:text-[var(--parchment)] focus-visible:outline-none"
            >
              <span>{chapter.secondaryCtaLabel}</span>
              <span
                aria-hidden
                className="h-px w-6 bg-[var(--parchment)]/40 transition-all duration-300 group-hover:w-10 group-hover:bg-[var(--gold)]"
              />
            </Link>
          </div>
        </div>

        {/* Quiet provenance — thin hairline, no glass panel */}
        <div className="absolute bottom-24 right-6 hidden items-center gap-4 lg:flex">
          <span aria-hidden className="h-px w-10 bg-[var(--gold)]/40" />
          <span className="font-display text-xs italic text-[var(--parchment)]/55">
            {chapter.eyebrow}
          </span>
        </div>
      </div>

      {/* Bottom slide controls + progress — premium brand-film interface:
          thin hairlines, serif numerals, circular-outline buttons. No glass. */}
      <div
        aria-label="Chapter navigation"
        className="pointer-events-none absolute bottom-6 left-6 right-6 z-30 flex items-end justify-between md:bottom-10 md:left-10 md:right-10"
      >
        <div className="pointer-events-auto flex items-center gap-3">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => goTo(i)}
              aria-label={`Chapter ${c.number}: ${c.eyebrow}`}
              aria-current={i === active ? "true" : undefined}
              className={`h-px rounded-full transition-all duration-500 ease-out ${
                i === active ? "w-12 bg-[var(--gold)]" : "w-4 bg-[var(--parchment)]/35 hover:bg-[var(--parchment)]/60"
              }`}
            />
          ))}
        </div>

        <div className="pointer-events-auto flex items-center gap-5">
          <button
            onClick={() => setActive((a) => (a - 1 + CHAPTERS.length) % CHAPTERS.length)}
            aria-label="Previous chapter"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--parchment)]/70 transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--parchment)]/70 transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>
          <button
            onClick={() => setActive((a) => (a + 1) % CHAPTERS.length)}
            aria-label="Next chapter"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] text-[var(--parchment)]/70 transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
          >
            <ArrowRight size={14} />
          </button>
          <span className="ml-1 font-display text-lg leading-none text-[var(--parchment)]/60 tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Keyboard controls for accessibility (window-level listener above) */}
    </section>
  );
}
