<script lang="ts">
  let { data } = $props();
  const changelog = $derived(data.changelog);
</script>

<svelte:head>
  <title>Zmiany · Changelog — Janusz Bryzek 1978</title>
</svelte:head>

<h1>Zmiany · Changelog</h1>

{#if changelog.length === 0}
  <p class="empty">Brak zmian od publikacji. · No corrections yet since publication.</p>
{:else}
  <ol class="changelog">
    {#each changelog as entry, i (i)}
      <li>
        <time datetime={entry.date}>{entry.date}</time>
        {#each entry.changes as change, j (j)}
          <p>{change}</p>
        {/each}
        {#if entry.contributors.length > 0}
          <p class="credit">Dziękujemy · Thanks to {entry.contributors.join(', ')}</p>
        {/if}
      </li>
    {/each}
  </ol>
{/if}
