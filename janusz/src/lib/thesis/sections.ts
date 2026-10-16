// The sections published and their ids. Dependency-free on purpose: the browser imports this (the
// route matcher, the endnote links), and chapter.ts, which imports the Markdown and KaTeX
// renderers, stays on the server.

export type Lang = 'pl' | 'en';

// The sections published, in reading order. lib (the library labels) and rev-1..rev-3 (the
// examiners' reports) are deliberately absent: they are not part of the site.
export const SECTIONS = ['front', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export type Section = (typeof SECTIONS)[number];

export function isSection(value: string): value is Section {
  return (SECTIONS as readonly string[]).includes(value);
}

export function noteId(lang: Lang, n: number): string {
  return `tn-${lang}-${n}`;
}

// One line of the contents: a section's title in each language.
export interface TocEntry {
  section: Section;
  pl: string;
  en: string;
}
