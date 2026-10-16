// The reading text of one section: what a reader sees, as opposed to the transcription.
//
// A port of reading() in the projects repo's dads-thesis/checks/assemble.py, which builds the
// assembled reading edition. Two rules:
//
//   1. A bracketed transcription description ("[Library stamp in the upper left corner]",
//      "[handwritten correction in the margin, illegible]") describes the scan rather than
//      being text of the thesis, so it is removed.
//   2. A translator note "[TN: ...]" is lifted out of the text into a numbered endnote, and a
//      marker takes its place.
//
// Everything that uses square brackets for its own purpose is left alone: LaTeX math ($[a, b]$),
// HTML comments (the scan page markers), inline code, Markdown links and images, citations
// ("[3, 5]") and units ("[1/°C]"). Every removed span is returned in `stripped`, which
// scripts/pull-content.sh writes to content/stripped.txt so each pull can be read over for a
// span that was the author's own text.
//
// This module imports nothing, so scripts/stripped-report.ts can run it under plain node.

export interface Reading {
  text: string;
  notes: string[];
  stripped: string[];
}

// Spans that are opaque to both rules, in the order they are tried.
const OPAQUE = /<!--[\s\S]*?-->|\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$\n]+?\$|`[^`\n]*`/g;

// Private-use characters, which no text of the thesis carries.
const PLACEHOLDER = /\uE000(\d+)\uE001/g;

const TN = /^TN:\s*/;

// One-word descriptions that are always the transcriber's ([illegible], [blank]).
const MARKER_WORDS = new Set(['illegible', 'blank', 'stamp', 'signature', 'nieczytelne', 'pieczątka', 'podpis', 'sic']);

// A transcription description: a descriptor with a colon ("Figure: ..."), a known marker word, or
// a phrase of three or more words. Citations and units are one or two tokens and never match.
export function isTranscriptionDescription(content: string): boolean {
  const t = content.trim();
  if (t === '' || /^[\d\s,;.–-]+$/.test(t)) return false;
  if (/^\p{L}[\p{L} -]*:/u.test(t)) return true;
  if (MARKER_WORDS.has(t.toLowerCase())) return true;
  return t.split(/\s+/).length >= 3;
}

// The index of the `]` closing the `[` at `open`, counting nested brackets; -1 when unbalanced.
function closing(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '[') depth++;
    else if (text[i] === ']') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

// Removing a span must not leave two spaces, or a space before punctuation, behind it.
function trimBeforeRemoval(before: string, next: string | undefined): string {
  return next === undefined || /[ \t.,;:!?)\n]/.test(next) ? before.replace(/[ \t]+$/, '') : before;
}

export function reading(markdown: string, noteMarker: (n: number) => string = (n) => `[${n}]`): Reading {
  const opaque: string[] = [];
  const masked = markdown.replace(OPAQUE, (m) => `\uE000${opaque.push(m) - 1}\uE001`);
  const restore = (s: string) => s.replace(PLACEHOLDER, (_, i: string) => opaque[Number(i)] ?? '');

  const notes: string[] = [];
  const stripped: string[] = [];
  let out = '';
  let i = 0;
  while (i < masked.length) {
    const open = masked.indexOf('[', i);
    if (open < 0) {
      out += masked.slice(i);
      break;
    }
    const close = closing(masked, open);
    if (close < 0) {
      out += masked.slice(i);
      break;
    }
    const inner = masked.slice(open + 1, close);
    const isLinkText = masked[open - 1] === '!' || masked[close + 1] === '(' || masked[close + 1] === '[' || masked[close + 1] === ':';
    if (!isLinkText && TN.test(inner)) {
      notes.push(restore(inner.replace(TN, '').trim()));
      out += masked.slice(i, open) + noteMarker(notes.length);
    } else if (!isLinkText && isTranscriptionDescription(restore(inner))) {
      stripped.push(restore(masked.slice(open, close + 1)));
      out = trimBeforeRemoval(out + masked.slice(i, open), masked[close + 1]);
    } else {
      out += masked.slice(i, close + 1);
    }
    i = close + 1;
  }
  return { text: restore(out).replace(/^[ \t]+$/gm, ''), notes, stripped };
}
