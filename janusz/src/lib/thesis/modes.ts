// The three ways to read the thesis, each a URL prefix: /pl/1, /en/1, /pl-en/1.

export const MODES = ['pl', 'en', 'pl-en'] as const;
export type Mode = (typeof MODES)[number];

export const MODE_LABELS: Record<Mode, string> = {
  pl: 'Polski',
  en: 'English',
  'pl-en': 'Obok siebie · Side by side'
};

export function isMode(value: string): value is Mode {
  return (MODES as readonly string[]).includes(value);
}

// The reader's last choice, remembered in the browser so the contents links follow it.
export const MODE_STORAGE_KEY = 'thesis-mode';
export const DEFAULT_MODE: Mode = 'en';

export function htmlLang(mode: Mode): string {
  return mode === 'en' ? 'en' : 'pl';
}
