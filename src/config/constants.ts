export const STORAGE_KEYS = {
  session: "digital-campus/session",
  theme: "digital-campus/theme",
  consent: "digital-campus/consent"
} as const;

export const SUPPORTED_LOCALES = ["en", "zh"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";