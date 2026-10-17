// The questions page's questions, built once per build from the pulled edition and
// src/lib/data/questions.json.

import brief from '#lib/data/questions.json';
import { buildQuestions, type Brief, type Questions, type ScanPage } from '#lib/thesis/questions.ts';
import { loadEdition } from './content.ts';

function scanPages(): ScanPage[] {
  return loadEdition().chapters.pl.flatMap((c) =>
    c.pages.flatMap((p) =>
      p.scan === null ? [] : [{ scan: p.scan, section: c.section, printed: p.printed, text: p.html.replace(/<[^>]*>/g, ' ') }]
    )
  );
}

export function loadQuestions(): Questions {
  return buildQuestions(loadEdition().glossary, brief as Brief, scanPages());
}
