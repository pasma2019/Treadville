"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  type Translations,
} from ".";
import en from "./en";
import fr from "./fr";
import de from "./de";

const DICTIONARIES: Record<Locale, Translations> = { en, fr, de };

const STORAGE_KEY = "treadville:locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && (LOCALES as string[]).includes(raw)) {
      return raw as Locale;
    }
  } catch {
    /* localStorage may be unavailable */
  }
  return DEFAULT_LOCALE;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // SSR-safe default so server and first client render match
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored !== locale) setLocaleState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t: DICTIONARIES[locale] }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within <LanguageProvider>");
  }
  return ctx;
}
