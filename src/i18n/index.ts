export type Locale = "en" | "fr" | "de";

export type Translations = typeof import("./en").default;

export const LOCALES: Locale[] = ["en", "fr", "de"];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
};
