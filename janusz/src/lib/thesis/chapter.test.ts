import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildChapter, takeTitle } from './chapter.ts';
import { figurePath } from './markdown.ts';

const fixture = (path: string) => readFileSync(new URL(`../../../fixtures/dads-thesis/${path}`, import.meta.url), 'utf8');

describe('buildChapter', () => {
  const en = buildChapter('1', 'en', fixture('en/1.md'));

  it('takes the first heading as the title and keeps it out of the text', () => {
    expect(en.titleText).toBe('1. Introduction');
    expect(en.pages.map((p) => p.html).join('')).not.toContain('Introduction</h');
  });

  it('typesets inline and display math with KaTeX', () => {
    const html = en.pages.map((p) => p.html).join('');
    expect(html).toContain('class="katex"');
    expect(html).toContain('class="math-display"');
    expect(html).not.toContain('$R(T)');
  });

  it('points figures at the downscaled copy', () => {
    expect(en.pages.map((p) => p.html).join('')).toContain('src="/figures/rys-01.png"');
  });

  it('renders translator notes as linked endnotes, math included', () => {
    expect(en.notes).toHaveLength(2);
    expect(en.notes[1]).toContain('class="katex"');
    expect(en.pages.map((p) => p.html).join('')).toContain('<sup class="tn" id="tn-en-1-ref"><a href="#tn-en-1">1</a></sup>');
  });

  it('strips transcription descriptions in Polish too', () => {
    const pl = buildChapter('front', 'pl', fixture('source/pl/sections/front.md'));
    expect(pl.pages.map((p) => p.html).join('')).not.toContain('Pieczątka');
  });

  it('keeps the scan pages', () => {
    expect(en.pages.map((p) => [p.scan, p.printed])).toEqual([
      ['p007', '1'],
      ['p008', '2']
    ]);
  });
});

describe('takeTitle', () => {
  it('falls back when a section has no heading', () => {
    expect(takeTitle('text only').title).toBeNull();
    expect(buildChapter('front', 'pl', 'text only').titleText).toBe('Strona tytułowa');
  });
});

describe('figurePath', () => {
  it.each([
    ['../../figures/rys-01.png', '/figures/rys-01.png'],
    ['figures/RYS-12.PNG', '/figures/rys-12.png'],
    ['https://example.com/photo.jpg', null]
  ])('%s -> %s', (href, expected) => {
    expect(figurePath(href)).toBe(expected);
  });
});
