// Every span reading() removes as a transcription description, one per line, so a pull can be read
// over for a span that was the author's own text. Usage: node scripts/stripped-report.ts <content dir>

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { reading } from '../src/lib/thesis/reading.ts';

const dir = process.argv[2];
if (!dir) throw new Error('usage: node scripts/stripped-report.ts <content dir>');

for (const lang of ['pl', 'en']) {
  for (const file of readdirSync(join(dir, lang)).sort()) {
    const { stripped, notes } = reading(readFileSync(join(dir, lang, file), 'utf8'));
    for (const span of stripped) console.log(`${lang}/${file}\tstripped\t${span.replace(/\s+/g, ' ')}`);
    console.log(`${lang}/${file}\tnotes\t${notes.length}`);
  }
}
