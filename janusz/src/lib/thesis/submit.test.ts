import { describe, expect, it } from 'vitest';
import { ApiClient, SubmissionAnswer, type SubmissionForm } from '#generated/com-bryzek-thesis.ts';
import type { DefectQuestion, JudgmentQuestion, TermQuestion } from './questions.ts';
import { emptyAnswer, sendAll, toForm } from './submit.ts';

const term: TermQuestion = { kind: 'glossary', id: 'glossary-mostek', polish: 'mostek', english: 'bridge', reasoning: '', page: null };
const judgment: JudgmentQuestion = { kind: 'judgment', id: 'judgment-1', polish: 'p', english: 'e', question: { en: 'q' }, page: null };
const defect: DefectQuestion = {
  kind: 'defect',
  id: 'defect-1',
  reading: 'r',
  chosen: 'c',
  page: { scan: 'p003', section: '1', printed: '1' }
};
const nobody = { name: '', background: '' };

describe('toForm', () => {
  it('sends nothing for a question left unanswered', () => {
    expect(toForm(term, emptyAnswer(), nobody, 'abc')).toBeNull();
  });

  it('carries a preferred term and its reason in reason, and the visitor on every answer', () => {
    const form = toForm(
      term,
      { choice: 'prefer', preferred: ' mostek pomiarowy ', reason: 'common usage' },
      { name: ' Jan ', background: 'MEMS engineer' },
      'abc'
    );
    expect(form).toEqual({
      question_id: 'glossary-mostek',
      answer: SubmissionAnswer.Prefer,
      reason: 'Preferred term: mostek pomiarowy\n\nReason: common usage',
      name: 'Jan',
      background: 'MEMS engineer',
      site_version: 'abc'
    });
  });

  it('leaves blank fields out rather than sending empty strings', () => {
    expect(toForm(judgment, { choice: 'agree', preferred: 'ignored', reason: '  ' }, nobody, 'abc')).toEqual({
      question_id: 'judgment-1',
      answer: SubmissionAnswer.Agree,
      site_version: 'abc'
    });
  });

  it('sends a defect’s "not sure" as skip, and refuses a choice the question does not offer', () => {
    expect(toForm(defect, { ...emptyAnswer(), choice: 'unsure' }, nobody, 'abc')?.answer).toBe(SubmissionAnswer.Skip);
    expect(toForm(defect, { ...emptyAnswer(), choice: 'agree' }, nobody, 'abc')).toBeNull();
  });
});

function form(id: string): SubmissionForm {
  return { question_id: id, answer: SubmissionAnswer.Agree, site_version: 'abc' };
}

// A fake platform: answers each POST with the next status in line.
function client(statuses: number[]): ApiClient {
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  return new ApiClient({
    baseUrl: 'https://api.test',
    fetch: async () => {
      const status = statuses.shift() ?? 500;
      if (status === 201) return json(201, { id: 'sub-1', received_at: '2026-10-16T00:00:00Z' });
      if (status === 429) return json(429, [{ message: 'Too many requests. Please try again in 40 seconds.', field: 'rate_limited' }]);
      if (status === 422) return json(422, [{ message: 'Reason must be at most 5000 characters', field: 'reason' }]);
      return new Response('', { status });
    }
  });
}

describe('sendAll', () => {
  it('stores every answer in turn', async () => {
    const sent: string[] = [];
    expect(await sendAll(client([201, 201]), [form('a'), form('b')], (id) => sent.push(id))).toEqual({ kind: 'done' });
    expect(sent).toEqual(['a', 'b']);
  });

  it('stops at a 429 with the server’s wait, leaving the rest unsent', async () => {
    const sent: string[] = [];
    const outcome = await sendAll(client([201, 429, 201]), [form('a'), form('b'), form('c')], (id) => sent.push(id));
    expect(outcome).toEqual({ kind: 'throttled', message: 'Too many requests. Please try again in 40 seconds.' });
    expect(sent).toEqual(['a']);
  });

  it('carries on past a refused answer and names it', async () => {
    const sent: string[] = [];
    const outcome = await sendAll(client([422, 201]), [form('a'), form('b')], (id) => sent.push(id));
    expect(outcome).toEqual({ kind: 'refused', errors: { a: 'Reason must be at most 5000 characters' } });
    expect(sent).toEqual(['b']);
  });

  it('stops on a server error', async () => {
    const outcome = await sendAll(client([503, 201]), [form('a'), form('b')], () => {});
    expect(outcome.kind).toBe('failed');
  });
});
