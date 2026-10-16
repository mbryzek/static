import { loadEdition } from '#lib/server/content.ts';
import type { TocEntry } from '#lib/thesis/sections.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
  const { chapters, source } = loadEdition();
  const toc: TocEntry[] = chapters.pl.map((c, i) => ({ section: c.section, pl: c.titleText, en: chapters.en[i]?.titleText ?? '' }));
  return { toc, source: { repo: source.repo, commit: source.commit } };
};
