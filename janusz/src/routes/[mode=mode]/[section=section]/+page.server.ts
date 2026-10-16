import { chapter } from '#lib/server/content.ts';
import { SECTIONS, type Section } from '#lib/thesis/chapter.ts';
import { MODES, type Mode } from '#lib/thesis/modes.ts';
import { alignPages } from '#lib/thesis/pages.ts';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => MODES.flatMap((mode) => SECTIONS.map((section) => ({ mode, section })));

export const load: PageServerLoad = ({ params }) => {
  const mode = params.mode as Mode;
  const section = params.section as Section;
  const pl = chapter('pl', section);
  const en = chapter('en', section);
  const index = SECTIONS.indexOf(section);
  return {
    mode,
    section,
    pl: mode === 'en' ? null : pl,
    en: mode === 'pl' ? null : en,
    rows: mode === 'pl-en' ? alignPages(pl.pages, en.pages) : [],
    prev: SECTIONS[index - 1] ?? null,
    next: SECTIONS[index + 1] ?? null
  };
};
