// Scan pages. Both texts carry the transcriber's page comments,
//
//   <!-- scan p012 | printed page 7 ... -->
//
// one at the top of every page of the scanned typescript, so a section splits into the pages it
// was typed on and the Polish and English sections line up page by page on the scan id.

export interface Page {
  // The scan page id ("p012"); null for any text before the first comment.
  scan: string | null;
  // The page number printed on the typescript page, when the comment carries one.
  printed: string | null;
  body: string;
}

export interface Row<T> {
  scan: string | null;
  printed: string | null;
  pl: T | null;
  en: T | null;
}

const SCAN = /<!--\s*scan\s+(p\d+)\b([^>]*?)-->/g;
const PRINTED = /printed page\s+([^\s|]+)/;

export function splitPages(markdown: string): Page[] {
  const pages: Page[] = [];
  let current: Page = { scan: null, printed: null, body: '' };
  let last = 0;
  for (const m of markdown.matchAll(SCAN)) {
    current.body += markdown.slice(last, m.index);
    pages.push(current);
    current = { scan: m[1] ?? null, printed: PRINTED.exec(m[2] ?? '')?.[1] ?? null, body: '' };
    last = m.index + m[0].length;
  }
  current.body += markdown.slice(last);
  pages.push(current);

  // A page repeated in one text (a comment duplicated by the transcriber) reads as one page.
  const merged: Page[] = [];
  for (const page of pages) {
    const same = merged.find((p) => p.scan === page.scan);
    if (same) same.body += '\n\n' + page.body;
    else merged.push({ ...page });
  }
  return merged.filter((p) => p.scan !== null || p.body.trim() !== '');
}

function scanNumber(scan: string | null): number {
  return scan === null ? -1 : Number(scan.slice(1));
}

// One row per scan page present in either text, in scan order; a page only one text has gets an
// empty cell on the other side rather than shifting every later row.
export function alignPages<T extends { scan: string | null; printed: string | null }>(pl: T[], en: T[]): Row<T>[] {
  const scans = [...new Set([...pl, ...en].map((p) => p.scan))].sort((a, b) => scanNumber(a) - scanNumber(b));
  return scans.map((scan) => {
    const left = pl.find((p) => p.scan === scan) ?? null;
    const right = en.find((p) => p.scan === scan) ?? null;
    return { scan, printed: left?.printed ?? right?.printed ?? null, pl: left, en: right };
  });
}
