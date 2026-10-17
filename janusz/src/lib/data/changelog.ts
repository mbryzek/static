// The changelog page: one entry per republish that took corrections from readers, crediting each
// contributor. Empty at launch; the corrections intake appends an entry when it republishes.

import entries from './changelog.json';

export interface ChangelogEntry {
  // YYYY-MM-DD, the day the corrected text was published.
  date: string;
  // What changed, in a sentence.
  summary: string;
  // How each contributor asked to be credited.
  contributors: string[];
  // The projects repo commit the republished text was pulled from.
  commit: string;
}

export const changelog: ChangelogEntry[] = [...(entries as ChangelogEntry[])].sort((a, b) => b.date.localeCompare(a.date));
