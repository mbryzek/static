<script lang="ts">
  import { noteId, type Lang } from '#lib/thesis/sections.ts';

  interface Props {
    notes: string[];
    lang: Lang;
  }

  let { notes, lang }: Props = $props();
</script>

{#if notes.length > 0}
  <section class="endnotes" {lang}>
    <h2>{lang === 'pl' ? 'Przypisy tłumacza' : "Translator's notes"}</h2>
    <ol>
      {#each notes as note, i (i)}
        <li id={noteId(lang, i + 1)}>
          <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time rendering of a [TN: ...] note from the projects repo -->
          {@html note}
          <a class="back" href="#{noteId(lang, i + 1)}-ref" aria-label="Wróć · Back">↩</a>
        </li>
      {/each}
    </ol>
  </section>
{/if}
