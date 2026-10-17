import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseCsv, parseGlossary } from './glossary.ts';

describe('parseCsv', () => {
  it('handles quoted commas, doubled quotes and CRLF', () => {
    expect(parseCsv('a,b\r\n"x, y","say ""hi"""\r\n')).toEqual([
      ['a', 'b'],
      ['x, y', 'say "hi"']
    ]);
  });
});

describe('parseGlossary', () => {
  it('reads the polish, english and notes columns of the fixture, sorted in Polish order', () => {
    const terms = parseGlossary(readFileSync(new URL('../../../fixtures/dads-thesis/glossary/glossary.csv', import.meta.url), 'utf8'));
    expect(terms.map((t) => t.polish)).toEqual(['mostek', 'piezorezystor', 'współczynnik temperaturowy, rezystancji']);
    expect(terms[2]?.notes).toBe('CONTESTABLE: "TCR" in modern usage');
  });

  it('finds columns by name, not position', () => {
    expect(parseGlossary('notes,english,polish\nn,e,p\n')).toEqual([{ polish: 'p', english: 'e', notes: 'n' }]);
  });

  it('refuses a CSV missing a column', () => {
    expect(() => parseGlossary('polish,english\na,b\n')).toThrow(/notes/);
  });
});
