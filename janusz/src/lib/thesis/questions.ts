// The questions page: exactly the open questions in dads-thesis/notes/reviewer-brief.md, and
// nothing else.
//
//   - every glossary row whose notes begin CONTESTABLE (glossary/glossary.csv), read off the pull;
//   - the judgment calls and the typescript defects, transcribed from the brief into
//     src/lib/data/questions.json (see the README).
//
// Every question carries a stable id, which is the question_id each answer is submitted under and
// what the corrections intake reads an answer back against. An id is never reused for another
// question: a glossary id is the slug of its Polish term, the others are the keys questions.json
// gives them.

import type { Term } from './glossary.ts';
import type { Section } from './sections.ts';

// Where a question sits in the side-by-side view: the scan page, its section, the printed number.
export interface PageRef {
  scan: string;
  section: Section;
  printed: string | null;
}

export interface TermQuestion {
  kind: 'glossary';
  id: string;
  polish: string;
  english: string;
  reasoning: string;
  page: PageRef | null;
}

export interface JudgmentQuestion {
  kind: 'judgment';
  id: string;
  polish: string;
  english: string;
  question: Bilingual;
  page: PageRef | null;
}

export interface DefectQuestion {
  kind: 'defect';
  id: string;
  // What the typescript prints at that place, and what the translation took it to mean.
  reading: string;
  chosen: string;
  page: PageRef;
}

export type Question = TermQuestion | JudgmentQuestion | DefectQuestion;

export interface Bilingual {
  pl?: string;
  en: string;
}

// src/lib/data/questions.json, as transcribed from the brief.
export interface Brief {
  judgments: { key: string; scan?: string; polish: string; english: string; question: Bilingual }[];
  defects: { key: string; scan: string; reading: string; chosen: string }[];
}

export interface Questions {
  glossary: TermQuestion[];
  judgments: JudgmentQuestion[];
  defects: DefectQuestion[];
}

// One scan page of the Polish text: where it is, and its text with the markup removed.
export interface ScanPage extends PageRef {
  text: string;
}

const CONTESTABLE = /^CONTESTABLE\b[\s:–—-]*/;

export function isContestable(term: Term): boolean {
  return CONTESTABLE.test(term.notes);
}

// "współczynnik temperaturowy, rezystancji" -> "wspolczynnik-temperaturowy-rezystancji"
export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const KEY = /^[a-z0-9][a-z0-9-]*$/;

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// The first scan page whose Polish text uses the term. Polish inflects the ending of a word
// (piezorezystor, piezorezystora, piezorezystorów), so each word longer than five letters is
// matched on all but its last two.
export function firstUse(polish: string, pages: ScanPage[]): PageRef | null {
  const words = polish
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);
  if (words.length === 0) return null;
  const stems = words.map((w) => escape(w.length > 5 ? w.slice(0, -2) : w));
  const pattern = new RegExp(`(^|[^\\p{L}])${stems.join('\\p{L}*[\\s,]+')}`, 'u');
  const hit = pages.find((p) => pattern.test(p.text.toLowerCase()));
  return hit ? { scan: hit.scan, section: hit.section, printed: hit.printed } : null;
}

export function buildQuestions(glossary: Term[], brief: Brief, pages: ScanPage[]): Questions {
  const ids = new Set<string>();
  const claim = (id: string, what: string) => {
    if (ids.has(id)) throw new Error(`two questions share the id ${id} (${what})`);
    ids.add(id);
    return id;
  };
  const key = (k: string, what: string) => {
    if (!KEY.test(k)) throw new Error(`questions.json: ${what} key "${k}" must be lowercase letters, digits and dashes`);
    return k;
  };
  const page = (scan: string, what: string): PageRef => {
    const found = pages.find((p) => p.scan === scan);
    if (!found) throw new Error(`questions.json: ${what} names scan page ${scan}, which no Polish section has`);
    return { scan: found.scan, section: found.section, printed: found.printed };
  };

  return {
    glossary: glossary.filter(isContestable).map((t) => ({
      kind: 'glossary',
      id: claim(`glossary-${slug(t.polish)}`, `glossary term ${t.polish}`),
      polish: t.polish,
      english: t.english,
      reasoning: t.notes.replace(CONTESTABLE, ''),
      page: firstUse(t.polish, pages)
    })),
    judgments: brief.judgments.map((j) => ({
      kind: 'judgment',
      id: claim(`judgment-${key(j.key, 'judgment')}`, `judgment ${j.key}`),
      polish: j.polish,
      english: j.english,
      question: j.question,
      page: j.scan === undefined ? null : page(j.scan, `judgment ${j.key}`)
    })),
    defects: brief.defects.map((d) => ({
      kind: 'defect',
      id: claim(`defect-${key(d.key, 'defect')}`, `defect ${d.key}`),
      reading: d.reading,
      chosen: d.chosen,
      page: page(d.scan, `defect ${d.key}`)
    }))
  };
}
