import { describe, expect, it } from 'vitest';
import { parseChangelog } from './changelog.ts';

const CHANGELOG = `# Changelog

Corrections to the English translation taken from readers of janusz.bryzek.com, newest first.

## 2026-10-25

- Section 3: "measuring system" for układ pomiarowy.

## 2026-10-20

- Glossary: "TCR" for współczynnik temperaturowy rezystancji, in every section.
- Typescript defect p031-a: confirmed.

Thanks to:
- Anna Nowak
- Jan Kowalski, PhD
`;

describe('parseChangelog', () => {
  it('reads each entry with its changes and contributors, newest first', () => {
    expect(parseChangelog(CHANGELOG)).toEqual([
      { date: '2026-10-25', changes: ['Section 3: "measuring system" for układ pomiarowy.'], contributors: [] },
      {
        date: '2026-10-20',
        changes: ['Glossary: "TCR" for współczynnik temperaturowy rezystancji, in every section.', 'Typescript defect p031-a: confirmed.'],
        contributors: ['Anna Nowak', 'Jan Kowalski, PhD']
      }
    ]);
  });

  it('reads nothing from a changelog with no entries, or none at all', () => {
    expect(parseChangelog('# Changelog\n\nIntro.\n')).toEqual([]);
    expect(parseChangelog('')).toEqual([]);
  });
});
