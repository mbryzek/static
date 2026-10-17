// The thesis as this build publishes it, read from content/ — the snapshot
// scripts/pull-content.sh takes of the projects repo at one commit. Built once per build and read
// by every prerendered page.

import { buildChapter, type Chapter } from '#lib/thesis/chapter.ts';
import { SECTIONS, type Lang, type Section } from '#lib/thesis/sections.ts';
import { parseGlossary, type Term } from '#lib/thesis/glossary.ts';
import { parseChangelog, type ChangelogEntry } from '#lib/thesis/changelog.ts';

const pl = import.meta.glob<string>('/content/pl/*.md', { query: '?raw', import: 'default', eager: true });
const en = import.meta.glob<string>('/content/en/*.md', { query: '?raw', import: 'default', eager: true });
const glossaryCsv = import.meta.glob<string>('/content/glossary.csv', { query: '?raw', import: 'default', eager: true });
// Absent until the first correction from a reader lands.
const changelogMd = import.meta.glob<string>('/content/CHANGELOG.md', { query: '?raw', import: 'default', eager: true });
const sourceJson = import.meta.glob<Source>('/content/source.json', { import: 'default', eager: true });

// Where the text came from: the projects repo commit, so a page can say which revision it shows.
export interface Source {
  repo: string;
  path: string;
  commit: string;
  pulled_at: string;
}

const MISSING = 'run scripts/pull-content.sh first: content/ holds no thesis text';

function section(files: Record<string, string>, lang: Lang, s: Section): string {
  const text = files[`/content/${lang}/${s}.md`];
  if (text === undefined) throw new Error(`content/${lang}/${s}.md is missing — ${MISSING}`);
  return text;
}

export interface Edition {
  chapters: Record<Lang, Chapter[]>;
  glossary: Term[];
  changelog: ChangelogEntry[];
  source: Source;
}

let edition: Edition | null = null;

export function loadEdition(): Edition {
  if (edition) return edition;
  const source = sourceJson['/content/source.json'];
  const csv = glossaryCsv['/content/glossary.csv'];
  if (!source || csv === undefined) throw new Error(MISSING);
  edition = {
    chapters: {
      pl: SECTIONS.map((s) => buildChapter(s, 'pl', section(pl, 'pl', s))),
      en: SECTIONS.map((s) => buildChapter(s, 'en', section(en, 'en', s)))
    },
    glossary: parseGlossary(csv),
    changelog: parseChangelog(changelogMd['/content/CHANGELOG.md'] ?? ''),
    source
  };
  return edition;
}

export function chapter(lang: Lang, s: Section): Chapter {
  const found = loadEdition().chapters[lang].find((c) => c.section === s);
  if (!found) throw new Error(`no ${lang} section ${s}`);
  return found;
}
