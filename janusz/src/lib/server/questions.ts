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
  const { glossary, source } = loadEdition();
  const questions = buildQuestions(glossary, brief as Brief, scanPages());
  // A pull of the real thesis publishes the brief's questions or nothing: a page asking only the
  // glossary half would read as the whole of what is open.
  if (source.repo === 'mbryzek/projects' && (questions.judgments.length === 0 || questions.defects.length === 0)) {
    throw new Error(
      'src/lib/data/questions.json holds no judgment calls or no typescript defects: transcribe them from dads-thesis/notes/reviewer-brief.md (README, "The questions page")'
    );
  }
  return questions;
}
