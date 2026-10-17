// The changelog page: one entry per republish that took corrections from readers, crediting each
// contributor. Read from dads-thesis/CHANGELOG.md, which the corrections intake
// (dads-thesis/checks/intake.py) writes and scripts/pull-content.sh copies with the text, so a
// republish from a new commit carries its own credits. Absent until the first correction lands.
//
//   ## 2026-10-20
//
//   - Glossary: "TCR" for współczynnik temperaturowy rezystancji, in every section.
//
//   Thanks to:
//   - Anna Nowak

export interface ChangelogEntry {
  // YYYY-MM-DD, the day the corrections were taken.
  date: string;
  // What changed, a sentence each.
  changes: string[];
  // How each contributor asked to be credited.
  contributors: string[];
}

const HEADING = /^## (\d{4}-\d{2}-\d{2})\s*$/;
const ITEM = /^- (.+)$/;

// Every entry, newest first.
export function parseChangelog(markdown: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  let entry: ChangelogEntry | null = null;
  let thanks = false;
  for (const line of markdown.split(/\r?\n/)) {
    const heading = HEADING.exec(line);
    if (heading?.[1]) {
      entry = { date: heading[1], changes: [], contributors: [] };
      entries.push(entry);
      thanks = false;
    } else if (entry && /^Thanks to:\s*$/.test(line)) {
      thanks = true;
    } else if (entry) {
      const item = ITEM.exec(line)?.[1]?.trim();
      if (item) (thanks ? entry.contributors : entry.changes).push(item);
    }
  }
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}
