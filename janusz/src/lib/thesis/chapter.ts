// One section of the thesis in one language, ready to print: its title, its scan pages as HTML and
// its translator notes as endnotes.

import { renderInline, renderMarkdown } from './markdown.ts';
import { splitPages } from './pages.ts';
import { reading } from './reading.ts';
import { noteId, type Lang, type Section } from './sections.ts';

export interface RenderedPage {
  scan: string | null;
  printed: string | null;
  html: string;
}

export interface Chapter {
  section: Section;
  lang: Lang;
  // HTML (a title can carry math); titleText is the same title for <title> and link text.
  title: string;
  titleText: string;
  pages: RenderedPage[];
  notes: string[];
}

export function fallbackTitle(section: Section, lang: Lang): string {
  if (section === 'front') return lang === 'pl' ? 'Strona tytułowa' : 'Title page';
  return lang === 'pl' ? `Rozdział ${section}` : `Chapter ${section}`;
}

// The first top-level heading is the chapter's title, printed once above the text; the rest of the
// section is the text.
export function takeTitle(markdown: string): { title: string | null; rest: string } {
  const m = /^#[ \t]+(.+?)[ \t#]*$/m.exec(markdown);
  if (!m) return { title: null, rest: markdown };
  return { title: m[1] ?? null, rest: markdown.slice(0, m.index) + markdown.slice(m.index + m[0].length) };
}

function noteMarker(lang: Lang) {
  return (n: number) => `<sup class="tn" id="${noteId(lang, n)}-ref"><a href="#${noteId(lang, n)}">${n}</a></sup>`;
}

export function buildChapter(section: Section, lang: Lang, markdown: string): Chapter {
  const { text, notes } = reading(markdown, noteMarker(lang));
  const { title, rest } = takeTitle(text);
  const html = title === null ? fallbackTitle(section, lang) : renderInline(title);
  const pages = splitPages(rest).map((p) => ({ scan: p.scan, printed: p.printed, html: renderMarkdown(p.body) }));
  return {
    section,
    lang,
    title: html,
    titleText: (title ?? fallbackTitle(section, lang)).replace(/[$*_`]/g, ''),
    pages,
    notes: notes.map((n) => renderInline(n))
  };
}
