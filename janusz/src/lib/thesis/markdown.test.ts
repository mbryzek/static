import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './markdown.ts';

describe('renderMarkdown', () => {
  it('reads an indented typescript paragraph as prose, with its math typeset', () => {
    const html = renderMarkdown('     Let the generators \\(H_{o}\\) be given.');
    expect(html).not.toContain('<pre>');
    expect(html).toContain('class="katex"');
  });

  it('keeps lined-up entries on their own lines', () => {
    expect(renderMarkdown('                0 - 5 mA\n                4 - 20 mA')).toBe('<p>0 - 5 mA<br>4 - 20 mA</p>\n');
  });

  it('keeps typed numbering as typed, never renumbered as a list', () => {
    const html = renderMarkdown('8. BIBLIOGRAPHY\n\n1. Zias A.R.\n2. Bryzek J.');
    expect(html).not.toContain('<ol');
    expect(html).toContain('8. BIBLIOGRAPHY');
    expect(html).toContain('1. Zias A.R.<br>2. Bryzek J.');
  });
});
