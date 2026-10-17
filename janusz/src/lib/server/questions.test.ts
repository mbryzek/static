import { describe, expect, it } from 'vitest';
import { loadQuestions } from './questions.ts';

// The committed questions.json against the pulled edition: every scan page it names exists, and the
// page asks what dads-thesis/notes/reviewer-brief.md asks.
describe('loadQuestions', () => {
  const q = loadQuestions();

  it('asks the eleven glossary rows the brief marks CONTESTABLE', () => {
    expect(q.glossary.map((t) => t.id)).toEqual([
      'glossary-blad-dodatkowy',
      'glossary-blad-temperaturowy-graniczny-blad-graniczny',
      'glossary-dryft',
      'glossary-funkcja-czastkowa',
      'glossary-kompensacja-pelna',
      'glossary-mostek-wielokrotny',
      'glossary-napiecie-sumacyjne',
      'glossary-niezaleznosc-jednokierunkowa-nastaw',
      'glossary-normalizacja-charakterystyki-sygnalu',
      'glossary-przekatna-mostka',
      'glossary-zakres-jako-parametr-tzw-zakres'
    ]);
  });

  it('asks the four judgment calls and the two terms the brief names beyond the CONTESTABLE rows', () => {
    expect(q.judgments.map((j) => [j.id, j.page?.printed ?? null])).toEqual([
      ['judgment-1', '108'],
      ['judgment-2', '109'],
      ['judgment-3', null],
      ['judgment-4', '31'],
      ['judgment-term-przetwornik', null],
      ['judgment-term-element', null]
    ]);
  });

  it('asks every typescript defect the brief lists, on its printed page', () => {
    expect(q.defects.map((d) => [d.id, d.page.printed])).toEqual([
      ['defect-p060', '57'],
      ['defect-p069', '66'],
      ['defect-p071', '68'],
      ['defect-p081', '77'],
      ['defect-p059', '56'],
      ['defect-p068', '65'],
      ['defect-p103-a', '100'],
      ['defect-p103-b', '100'],
      ['defect-p099', '96'],
      ['defect-p125', '122']
    ]);
  });
});
