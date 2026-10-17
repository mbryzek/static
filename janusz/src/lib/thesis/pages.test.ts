import { describe, expect, it } from 'vitest';
import { alignPages, splitPages } from './pages.ts';

describe('splitPages', () => {
  it('splits on scan comments and reads the printed page', () => {
    const pages = splitPages('lead\n<!-- scan p007 | printed page 1 | margin -->\none\n<!-- scan p008 -->\ntwo');
    expect(pages.map((p) => [p.scan, p.printed, p.body.trim()])).toEqual([
      [null, null, 'lead'],
      ['p007', '1', 'one'],
      ['p008', null, 'two']
    ]);
  });

  it('drops an empty lead and merges a repeated page', () => {
    const pages = splitPages('\n<!-- scan p001 -->\na\n<!-- scan p001 -->\nb');
    expect(pages).toHaveLength(1);
    expect(pages[0]?.body).toContain('a');
    expect(pages[0]?.body).toContain('b');
  });
});

describe('alignPages', () => {
  it('gives one row per scan page, with an empty cell where one text lacks the page', () => {
    const pl = splitPages('<!-- scan p009 | printed page 3 -->\nA\n<!-- scan p011 -->\nC');
    const en = splitPages('<!-- scan p009 | printed page 3 -->\na\n<!-- scan p010 | printed page 4 -->\nb');
    const rows = alignPages(pl, en);
    expect(rows.map((r) => [r.scan, r.printed, r.pl?.body.trim() ?? null, r.en?.body.trim() ?? null])).toEqual([
      ['p009', '3', 'A', 'a'],
      ['p010', '4', null, 'b'],
      ['p011', null, 'C', null]
    ]);
  });
});
