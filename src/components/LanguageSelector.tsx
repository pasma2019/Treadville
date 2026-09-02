"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n";

export default function LanguageSelector({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language"
      className={`flex items-center gap-0.5 ${className}`}
    >
      {LOCALES.map((code, i) => {
        const active = code === locale;
        return (
          <span key={code} className="flex items-center">
            <button
              type="button"
              onClick={() => setLocale(code as Locale)}
              aria-pressed={active}
              aria-label={`Switch language to ${code.toUpperCase()}`}
              className={`px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.20em] transition-colors duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:text-[var(--gold)] ${
                active
                  ? "text-[var(--gold)]"
                  : "text-[var(--parchment)]/55 hover:text-[var(--parchment)] focus-visible:text-[var(--parchment)]"
              }`}
            >
              {LOCALE_LABELS[code as Locale]}
            </button>
            {i < LOCALES.length - 1 && (
              <span aria-hidden className="h-2 w-px bg-[var(--parchment)]/15" />
            )}
          </span>
        );
      })}
    </div>
  );
}
