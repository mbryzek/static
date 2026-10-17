<script lang="ts">
  import { changelog } from '#lib/data/changelog.ts';
</script>

<svelte:head>
  <title>Zmiany · Changelog — Janusz Bryzek 1978</title>
</svelte:head>

<h1>Zmiany · Changelog</h1>

{#if changelog.length === 0}
  <p class="empty">Brak zmian od publikacji. · No corrections yet since publication.</p>
{:else}
  <ol class="changelog">
    {#each changelog as entry (entry.commit)}
      <li>
        <time datetime={entry.date}>{entry.date}</time>
        <p>{entry.summary}</p>
        {#if entry.contributors.length > 0}
          <p class="credit">Dziękujemy · Thanks to {entry.contributors.join(', ')}</p>
        {/if}
      </li>
    {/each}
  </ol>
{/if}
