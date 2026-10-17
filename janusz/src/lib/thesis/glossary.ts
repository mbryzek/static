// glossary/glossary.csv: one term per row, columns polish, english, notes (RFC 4180 quoting).

export interface Term {
  polish: string;
  english: string;
  notes: string;
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim() !== ''));
}

// Columns are found by header name, so a column added to the CSV later does not shift these.
export function parseGlossary(text: string): Term[] {
  const [header, ...rows] = parseCsv(text.replace(/^\uFEFF/, ''));
  if (!header) return [];
  const col = (name: string) => {
    const i = header.findIndex((h) => h.trim().toLowerCase() === name);
    if (i < 0) throw new Error(`glossary.csv has no "${name}" column (header: ${header.join(',')})`);
    return i;
  };
  const [pl, en, notes] = [col('polish'), col('english'), col('notes')];
  return rows
    .map((r) => ({ polish: (r[pl] ?? '').trim(), english: (r[en] ?? '').trim(), notes: (r[notes] ?? '').trim() }))
    .sort((a, b) => a.polish.localeCompare(b.polish, 'pl'));
}
