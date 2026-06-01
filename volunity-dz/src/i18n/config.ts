export type Locale = 'ar' | 'en' | 'fr';

export const locales: Locale[] = ['ar', 'en', 'fr'];
export const defaultLocale: Locale = 'ar';

export const localeNames: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
};

export const localeFlags: Record<Locale, string> = {
  ar: '🇩🇿',
  en: '🇬🇧',
  fr: '🇫🇷',
};

export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}
