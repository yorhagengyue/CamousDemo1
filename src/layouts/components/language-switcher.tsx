import { useTranslation } from "react-i18next";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from "@/config/constants";
import { changeLocale } from "@/lib/i18n";
import { useAuthStore } from "@/store/auth-store";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const updateLocale = useAuthStore((state) => state.updateLocale);
  const currentLocale = (i18n.language as SupportedLocale) || DEFAULT_LOCALE;

  const handleChange = (value: string) => {
    const locale = (value as SupportedLocale) ?? DEFAULT_LOCALE;
    changeLocale(locale);
    updateLocale(locale);
  };

  return (
    <Select onValueChange={handleChange} value={currentLocale}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LOCALES.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {locale.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}