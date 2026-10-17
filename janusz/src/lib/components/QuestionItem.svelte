<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Question } from '#lib/thesis/questions.ts';
  import { CHOICES, type Answer, type Choice } from '#lib/thesis/submit.ts';

  interface Props {
    question: Question;
    answer: Answer;
    // The server's refusal of this answer, when it gave one.
    error: string | null;
  }

  let { question, answer = $bindable(), error }: Props = $props();

  const LABELS: Record<Question['kind'], Partial<Record<Choice, string>>> = {
    glossary: { agree: 'Zgadzam się · Agree', prefer: 'Wolę inny termin · Prefer another term', skip: 'Pomiń · Skip' },
    judgment: { agree: 'Zgadzam się · Agree', prefer: 'Inaczej · Otherwise', skip: 'Pomiń · Skip' },
    defect: { confirm: 'Potwierdzam · Confirm', disagree: 'Nie zgadzam się · Disagree', unsure: 'Nie wiem · Not sure' }
  };
</script>

<li class="question" id={question.id}>
  {#if question.kind === 'glossary'}
    <dl>
      <dt>Polski</dt>
      <dd lang="pl">{question.polish}</dd>
      <dt>English</dt>
      <dd lang="en">{question.english}</dd>
      {#if question.reasoning}
        <dt>Uzasadnienie słownika · Glossary's reasoning</dt>
        <dd lang="en">{question.reasoning}</dd>
      {/if}
    </dl>
  {:else if question.kind === 'judgment'}
    <dl>
      <dt>Polski</dt>
      <dd lang="pl">{question.polish}</dd>
      <dt>English</dt>
      <dd lang="en">{question.english}</dd>
      <dt>Pytanie · Question</dt>
      <dd>
        {#if question.question.pl}
          <span lang="pl">{question.question.pl}</span> ·
        {/if}
        <span lang="en">{question.question.en}</span>
      </dd>
    </dl>
  {:else}
    <dl>
      <dt>Strona · Page</dt>
      <dd>{question.page.printed ?? question.page.scan}</dd>
      <dt>Maszynopis · Typescript reads</dt>
      <dd lang="pl">{question.reading}</dd>
      <dt>Przyjęte w tłumaczeniu · Translation chose</dt>
      <dd>{question.chosen}</dd>
    </dl>
  {/if}

  {#if question.page}
    <p class="scan-link">
      <a href="{resolve('/[mode=mode]/[section=section]', { mode: 'pl-en', section: question.page.section })}#{question.page.scan}"
        >Skan · Scan, s. {question.page.printed ?? question.page.scan}</a
      >
    </p>
  {/if}

  <fieldset class="choices">
    <legend class="visually-hidden">Odpowiedź · Answer</legend>
    {#each CHOICES[question.kind] as choice (choice)}
      <label><input type="radio" name={question.id} value={choice} bind:group={answer.choice} /> {LABELS[question.kind][choice]}</label>
    {/each}
  </fieldset>

  {#if question.kind === 'glossary' && answer.choice === 'prefer'}
    <label class="field">Preferowany termin · Preferred term <input type="text" bind:value={answer.preferred} /></label>
    <label class="field">Uzasadnienie · Reason <textarea rows="2" bind:value={answer.reason}></textarea></label>
  {:else if question.kind === 'judgment'}
    <label class="field">Odpowiedź · Answer <textarea rows="2" bind:value={answer.reason}></textarea></label>
  {:else if question.kind === 'defect' && answer.choice === 'disagree'}
    <label class="field">Uzasadnienie · Reason <textarea rows="2" bind:value={answer.reason}></textarea></label>
  {/if}

  {#if error}
    <p class="error" role="alert">{error}</p>
  {/if}
</li>
