// Markdown to HTML at build time, with the thesis's LaTeX typeset by KaTeX and its figures pointed
// at the downscaled copies scripts/pull-content.sh writes to static/figures/.

import katex from 'katex';
import { Marked, type TokenizerAndRendererExtension, type Tokens } from 'marked';

function tex(source: string, displayMode: boolean): string {
  return katex.renderToString(source.trim(), { displayMode, throwOnError: false });
}

interface MathToken extends Tokens.Generic {
  text: string;
}

// $$ ... $$ or \[ ... \] standing as its own block.
const blockMath: TokenizerAndRendererExtension = {
  name: 'blockMath',
  level: 'block',
  start: (src) => src.match(/\$\$|\\\[/)?.index,
  tokenizer(src) {
    const m = /^(?:\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\])[ \t]*(?:\n|$)/.exec(src);
    if (!m) return undefined;
    return { type: 'blockMath', raw: m[0], text: m[1] ?? m[2] ?? '' };
  },
  renderer: (token) => `<div class="math-display">${tex((token as MathToken).text, true)}</div>\n`
};

// $ ... $ or \( ... \) inside a paragraph. A $ followed by a space or a digit-and-space is a price
// or a stray dollar sign, not math.
const inlineMath: TokenizerAndRendererExtension = {
  name: 'inlineMath',
  level: 'inline',
  start: (src) => src.match(/\$|\\\(/)?.index,
  tokenizer(src) {
    const m = /^(?:\$\$([\s\S]+?)\$\$|\$(?!\s)([^$\n]+?)(?<!\s)\$|\\\(([\s\S]+?)\\\))/.exec(src);
    if (!m) return undefined;
    const display = m[1] !== undefined;
    return { type: 'inlineMath', raw: m[0], text: m[1] ?? m[2] ?? m[3] ?? '', display };
  },
  renderer: (token) => tex((token as MathToken).text, Boolean((token as MathToken)['display']))
};

const FIGURE = /(rys-\d+)\.(?:png|jpe?g)$/i;

// The site path of a figure the text links to, or null for any other image.
export function figurePath(href: string): string | null {
  const m = FIGURE.exec(href);
  return m ? `/figures/${m[1]?.toLowerCase()}.png` : null;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

const marked = new Marked({
  async: false,
  gfm: true,
  extensions: [blockMath, inlineMath],
  renderer: {
    image({ href, text }: Tokens.Image) {
      const src = figurePath(href) ?? href;
      return `<img class="figure" src="${escapeAttr(src)}" alt="${escapeAttr(text)}" loading="lazy" />`;
    },
    // Headings move down one level: the page's own <h1> is the chapter title.
    heading({ tokens, depth }: Tokens.Heading) {
      const level = Math.min(depth + 1, 6);
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
    }
  }
});

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown) as string;
}

export function renderInline(markdown: string): string {
  return marked.parseInline(markdown) as string;
}
