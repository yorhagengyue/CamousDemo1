import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import type { SupportedLocale } from "@/config/constants";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/config/constants";

import enCommon from "@/locales/en/common.json";
import zhCommon from "@/locales/zh/common.json";

const resources = {
  en: {
    common: enCommon
  },
  zh: {
    common: zhCommon
  }
} as const satisfies Record<SupportedLocale, { common: Record<string, unknown> }>;

let isInitialized = false;

export function initI18n() {
  if (isInitialized) {
    return i18next;
  }

  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: [...SUPPORTED_LOCALES],
      defaultNS: "common",
      resources,
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ["querystring", "localStorage"],
        caches: ["localStorage"],
        lookupQuerystring: "lang"
      },
      lng: DEFAULT_LOCALE
    });

  isInitialized = true;
  return i18next;
}

export function changeLocale(locale: SupportedLocale) {
  i18next.changeLanguage(locale);
}