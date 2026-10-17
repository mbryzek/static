// Answers on the questions page, and sending them to platform's POST /thesis/submissions
// (spec/thesis.json): one submission per answered question, carrying the visitor's optional name
// and background with each. Nothing the server stores is ever read back.

import { ApiClient, SubmissionAnswer, type SubmissionForm } from '#generated/com-bryzek-thesis.ts';
import { handleApiCall, isApiError } from '#generated/generated-util.ts';
import type { Question } from './questions.ts';

// What a visitor can pick. `unsure` is a defect's "not sure", sent as the spec's `skip`: no view.
export type Choice = 'agree' | 'prefer' | 'skip' | 'confirm' | 'disagree' | 'unsure';

export const CHOICES: Record<Question['kind'], Choice[]> = {
  glossary: ['agree', 'prefer', 'skip'],
  judgment: ['agree', 'prefer', 'skip'],
  defect: ['confirm', 'disagree', 'unsure']
};

export interface Answer {
  choice: Choice | null;
  // The term a visitor prefers to the glossary's (glossary questions only).
  preferred: string;
  // Why; for a judgment call, the visitor's answer to its question.
  reason: string;
}

export interface Visitor {
  name: string;
  background: string;
}

export function emptyAnswer(): Answer {
  return { choice: null, preferred: '', reason: '' };
}

const WIRE: Record<Choice, SubmissionAnswer> = {
  agree: SubmissionAnswer.Agree,
  prefer: SubmissionAnswer.Prefer,
  skip: SubmissionAnswer.Skip,
  confirm: SubmissionAnswer.Confirm,
  disagree: SubmissionAnswer.Disagree,
  unsure: SubmissionAnswer.Skip
};

function present(s: string): string | undefined {
  const t = s.trim();
  return t === '' ? undefined : t;
}

// The spec has one free-text field, so a preferred glossary term travels in it, labelled, ahead of
// the reason: "Preferred term: ...\n\nReason: ...".
function reasonText(question: Question, answer: Answer): string | undefined {
  const reason = present(answer.reason);
  const preferred = question.kind === 'glossary' && answer.choice === 'prefer' ? present(answer.preferred) : undefined;
  if (preferred === undefined) return reason;
  return reason === undefined ? `Preferred term: ${preferred}` : `Preferred term: ${preferred}\n\nReason: ${reason}`;
}

// The submission for one question, or null when the visitor picked nothing for it.
export function toForm(question: Question, answer: Answer, visitor: Visitor, siteVersion: string): SubmissionForm | null {
  if (answer.choice === null || !CHOICES[question.kind].includes(answer.choice)) return null;
  const form: SubmissionForm = { question_id: question.id, answer: WIRE[answer.choice], site_version: siteVersion };
  const reason = reasonText(question, answer);
  const name = present(visitor.name);
  const background = present(visitor.background);
  if (reason !== undefined) form.reason = reason;
  if (name !== undefined) form.name = name;
  if (background !== undefined) form.background = background;
  return form;
}

export type Outcome =
  // Every pending answer was stored.
  | { kind: 'done' }
  // Stopped: platform's per-address limit answered 429. Everything not yet sent stays pending.
  | { kind: 'throttled'; message: string }
  // Stopped: no answer from the server, or a server error. Everything not yet sent stays pending.
  | { kind: 'failed'; message: string }
  // Every other answer was stored; the server refused these, by question id.
  | { kind: 'refused'; errors: Record<string, string> };

// Sends each pending submission in turn. `sent` is told every id the server stored, as it is
// stored, so a page that stops halfway resends only what is left. A 429 or a failure stops the run:
// every later request would be refused the same way.
export async function sendAll(client: ApiClient, pending: SubmissionForm[], sent: (questionId: string) => void): Promise<Outcome> {
  const errors: Record<string, string> = {};
  for (const body of pending) {
    const result = await handleApiCall(() => client.createSubmission({ body }));
    if (!isApiError(result)) {
      sent(body.question_id);
      continue;
    }
    const message = result.errors.map((e) => e.message).join(' ');
    if (result.status === 429) return { kind: 'throttled', message };
    if (result.status === 422) {
      errors[body.question_id] = message;
      continue;
    }
    return { kind: 'failed', message };
  }
  return Object.keys(errors).length === 0 ? { kind: 'done' } : { kind: 'refused', errors };
}
