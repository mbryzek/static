import { describe, expect, it } from 'vitest';
import { isTranscriptionDescription, reading } from './reading.ts';

describe('reading', () => {
  it('removes a transcription description and the space before it', () => {
    const r = reading('Shown in Fig. 1 [handwritten correction in the margin, illegible].');
    expect(r.text).toBe('Shown in Fig. 1.');
    expect(r.stripped).toEqual(['[handwritten correction in the margin, illegible]']);
  });

  it('removes a description standing on its own line', () => {
    expect(reading('Janusz Bryzek\n\n[Library stamp in the upper left corner]\n\n1978').text).toBe('Janusz Bryzek\n\n\n\n1978');
  });

  it('keeps an uncertain reading, never as a link', () => {
    const r = reading('czujnika [?:\\(\\delta\\) missing](T) w [?]');
    expect(r.text).toBe('czujnika &#91;?:\\(\\delta\\) missing&#93;(T) w &#91;?&#93;');
    expect(r.stripped).toEqual([]);
  });

  it('attaches a note on its own line to the text above it', () => {
    const r = reading('The sum:\n\n$$ H = 1 $$\n[TN: labels as printed.]\n\nNext.', (n) => `^${n}`);
    expect(r.text).toBe('The sum:^1\n\n$$ H = 1 $$\n\nNext.');
    expect(r.notes).toEqual(['labels as printed.']);
  });

  it('leaves a note under a table where it is', () => {
    expect(reading('| a | b |\n\n[TN: as printed.]', (n) => `^${n}`).text).toBe('| a | b |\n\n^1');
  });

  it('lifts translator notes into numbered endnotes, in order', () => {
    const r = reading('One.[TN: First note.] Two.[TN: Second, with $[a, b]$.]', (n) => `^${n}`);
    expect(r.text).toBe('One.^1 Two.^2');
    expect(r.notes).toEqual(['First note.', 'Second, with $[a, b]$.']);
  });

  it('keeps a note whose text holds brackets whole', () => {
    expect(reading('x[TN: see [3] and [Library stamp on the cover]]').notes).toEqual(['see [3] and [Library stamp on the cover]']);
  });

  it('leaves citations, units, math, links, images and scan comments alone', () => {
    const md = [
      'In [1/°C] [3, 5] and $[a, b]$ and $$[x, y, z]$$.',
      '![Rys. 1. Mostek Wheatstone a](../figures/rys-01.png) [the paper is cited here](http://x)',
      '<!-- scan p007 | printed page 1 [some words here] -->',
      '`[not a description at all]`'
    ].join('\n');
    const r = reading(md);
    expect(r.text).toBe(md);
    expect(r.stripped).toEqual([]);
  });
});

describe('isTranscriptionDescription', () => {
  it.each([
    ['illegible', true],
    ['handwritten, top left: + 3 opinie', true],
    ['inserted above line: funkcji', true],
    ['3 ÷ 24', false],
    ['1, 32 ÷ 76', false],
    ['Dr Eng., Associate Professor', false],
    ['A method of temperature compensation of electronic measuring transducers.', false],
    ['?:likely T_1 + T_2 = 2T_0', false],
    ['3, 5', false],
    ['12', false],
    ['mV/°C', false],
    ['1/°C', false]
  ])('%s -> %s', (content, expected) => {
    expect(isTranscriptionDescription(content)).toBe(expected);
  });
});
