import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseGlossary } from './glossary.ts';
import { buildQuestions, firstUse, slug, type Brief, type ScanPage } from './questions.ts';

const glossary = parseGlossary(readFileSync(new URL('../../../fixtures/dads-thesis/glossary/glossary.csv', import.meta.url), 'utf8'));

const pages: ScanPage[] = [
  { scan: 'p003', section: '1', printed: '1', text: 'Mostek Wheatstone’a' },
  { scan: 'p004', section: '1', printed: '2', text: 'Zmiany współczynnika temperaturowego, rezystancji piezorezystorów' }
];

const sample: Brief = {
  judgments: [{ key: '1', scan: 'p003', polish: 'zdanie', english: 'sentence', question: { en: 'Which?' } }],
  defects: [{ key: 'p004-a', scan: 'p004', reading: '10^3', chosen: '10^-3' }]
};

describe('slug', () => {
  it('folds Polish letters and punctuation into a stable key', () => {
    expect(slug('współczynnik temperaturowy, rezystancji')).toBe('wspolczynnik-temperaturowy-rezystancji');
    expect(slug('Łącznik źródła')).toBe('lacznik-zrodla');
  });
});

describe('firstUse', () => {
  it('finds an inflected term on its first scan page', () => {
    expect(firstUse('piezorezystor', pages)).toEqual({ scan: 'p004', section: '1', printed: '2' });
    expect(firstUse('współczynnik temperaturowy, rezystancji', pages)?.scan).toBe('p004');
  });

  it('answers null for a term the text never uses', () => {
    expect(firstUse('tensometr', pages)).toBeNull();
  });
});

describe('buildQuestions', () => {
  it('asks only the CONTESTABLE glossary rows, with the reasoning after the marker', () => {
    const q = buildQuestions(glossary, sample, pages);
    expect(q.glossary).toEqual([
      {
        kind: 'glossary',
        id: 'glossary-wspolczynnik-temperaturowy-rezystancji',
        polish: 'współczynnik temperaturowy, rezystancji',
        english: 'temperature coefficient of resistance',
        reasoning: '"TCR" in modern usage',
        page: { scan: 'p004', section: '1', printed: '2' }
      }
    ]);
  });

  it('keys judgment calls and defects from questions.json and places them on their scan page', () => {
    const q = buildQuestions(glossary, sample, pages);
    expect(q.judgments.map((j) => [j.id, j.page?.printed])).toEqual([['judgment-1', '1']]);
    expect(q.defects.map((d) => [d.id, d.page.section, d.page.printed])).toEqual([['defect-p004-a', '1', '2']]);
  });

  it('refuses a scan page no section has, a malformed key and a repeated id', () => {
    expect(() => buildQuestions([], { judgments: [], defects: [{ ...sample.defects[0]!, scan: 'p999' }] }, pages)).toThrow(/p999/);
    expect(() => buildQuestions([], { judgments: [], defects: [{ ...sample.defects[0]!, key: 'A 1' }] }, pages)).toThrow(/key/);
    expect(() => buildQuestions([], { judgments: [], defects: [sample.defects[0]!, sample.defects[0]!] }, pages)).toThrow(/share/);
  });

});
