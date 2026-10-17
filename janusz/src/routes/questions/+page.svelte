<script lang="ts">
  import QuestionItem from '#lib/components/QuestionItem.svelte';
  import { apiBaseUrl } from '#lib/config.ts';
  import type { Question } from '#lib/thesis/questions.ts';
  import { emptyAnswer, sendAll, toForm, type Answer, type Visitor } from '#lib/thesis/submit.ts';
  import { ApiClient, type SubmissionForm } from '#generated/com-bryzek-thesis.ts';

  let { data } = $props();

  // The page is prerendered, so its questions never change while it is open.
  // svelte-ignore state_referenced_locally
  const all: Question[] = [...data.questions.glossary, ...data.questions.judgments, ...data.questions.defects];

  let answers: Record<string, Answer> = $state(Object.fromEntries(all.map((q) => [q.id, emptyAnswer()])));
  let visitor: Visitor = $state({ name: '', background: '' });
  let sent: string[] = $state([]);
  let errors: Record<string, string> = $state({});
  let notice: string | null = $state(null);
  let sending = $state(false);
  let thanked = $state(false);

  function pending(): SubmissionForm[] {
    return all
      .filter((q) => !sent.includes(q.id))
      .map((q) => toForm(q, answers[q.id] ?? emptyAnswer(), visitor, data.siteVersion))
      .filter((f): f is SubmissionForm => f !== null);
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    const forms = pending();
    if (forms.length === 0) {
      notice = 'Nie wybrano żadnej odpowiedzi. · No answers chosen yet.';
      return;
    }
    sending = true;
    notice = null;
    errors = {};
    const outcome = await sendAll(new ApiClient({ baseUrl: apiBaseUrl, timeoutMs: 20000 }), forms, (id) => sent.push(id));
    sending = false;
    switch (outcome.kind) {
      case 'done':
        thanked = true;
        window.scrollTo({ top: 0 });
        break;
      case 'throttled':
        notice = `Wysłano zbyt wiele odpowiedzi naraz; pozostałe są zachowane, wyślij je ponownie za chwilę. · Too many answers sent at once; the rest are kept here, send them again shortly. (${outcome.message})`;
        break;
      case 'failed':
        notice = `Nie udało się wysłać; odpowiedzi są zachowane, spróbuj ponownie. · Sending failed; your answers are kept here, try again. (${outcome.message})`;
        break;
      case 'refused':
        errors = outcome.errors;
        notice = 'Niektórych odpowiedzi nie przyjęto; zobacz poniżej. · Some answers were not accepted; see below.';
        break;
    }
  }
</script>

<svelte:head>
  <title>Pytania · Questions — Janusz Bryzek 1978</title>
</svelte:head>

{#if thanked}
  <section class="thanks">
    <h1>Dziękujemy · Thank you</h1>
  </section>
{:else}
  <h1>Pytania · Questions</h1>
  <p class="lede">
    <span lang="pl">Odpowiedzi trafiają tylko do tłumaczenia i nigdzie nie są publikowane.</span> ·
    <span lang="en">Answers go to the translation only and are never published.</span>
  </p>

  <form class="questions" onsubmit={submit}>
    <fieldset class="visitor">
      <legend>O tobie (opcjonalnie) · About you (optional)</legend>
      <label class="field">Imię i nazwisko, do podziękowań · Name, for the credit <input type="text" bind:value={visitor.name} /></label>
      <label class="field"
        >Doświadczenie, np. inżynier MEMS · Background, e.g. MEMS engineer <input type="text" bind:value={visitor.background} /></label
      >
    </fieldset>

    {#snippet group(title: string, questions: Question[])}
      {#if questions.length > 0}
        <section>
          <h2>{title}</h2>
          <ol class="question-list">
            {#each questions as question (question.id)}
              <QuestionItem {question} bind:answer={answers[question.id]!} error={errors[question.id] ?? null} />
            {/each}
          </ol>
        </section>
      {/if}
    {/snippet}

    {@render group('Sporne terminy słownika · Contestable glossary terms', data.questions.glossary)}
    {@render group('Decyzje tłumacza · Judgment calls', data.questions.judgments)}
    {@render group('Błędy maszynopisu · Typescript defects', data.questions.defects)}

    {#if notice}
      <p class="notice" role="status">{notice}</p>
    {/if}
    <button type="submit" disabled={sending}>{sending ? 'Wysyłanie… · Sending…' : 'Wyślij · Send'}</button>
  </form>
{/if}
