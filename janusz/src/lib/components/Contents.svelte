<script lang="ts">
  import { resolve } from '$app/paths';
  import type { TocEntry } from '#lib/thesis/chapter.ts';
  import type { Mode } from '#lib/thesis/modes.ts';

  interface Props {
    toc: TocEntry[];
    mode: Mode;
  }

  let { toc, mode }: Props = $props();
</script>

<ol class="contents">
  {#each toc as entry (entry.section)}
    <li>
      <a href={resolve('/[mode=mode]/[section=section]', { mode, section: entry.section })}>
        {#if mode === 'en'}
          {entry.en}
        {:else if mode === 'pl'}
          <span lang="pl">{entry.pl}</span>
        {:else}
          <span lang="pl">{entry.pl}</span> <span class="secondary">{entry.en}</span>
        {/if}
      </a>
    </li>
  {/each}
</ol>
