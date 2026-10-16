<script lang="ts">
  import { resolve } from '$app/paths';
  import type { Section } from '#lib/thesis/chapter.ts';
  import { MODES, MODE_LABELS, MODE_STORAGE_KEY, type Mode } from '#lib/thesis/modes.ts';

  interface Props {
    current: Mode | null;
    // A section page switches to the same section in the other mode; otherwise to the mode's contents.
    section: Section | null;
  }

  let { current, section }: Props = $props();

  function remember(mode: Mode) {
    try {
      localStorage.setItem(MODE_STORAGE_KEY, mode);
    } catch {
      // Storage blocked (private mode, lockdown): the choice still applies to this link.
    }
  }
</script>

<nav class="modes" aria-label="Język · Language">
  {#each MODES as mode (mode)}
    <a
      href={section === null ? resolve('/[mode=mode]', { mode }) : resolve('/[mode=mode]/[section=section]', { mode, section })}
      aria-current={mode === current ? 'page' : undefined}
      onclick={() => remember(mode)}>{MODE_LABELS[mode]}</a
    >
  {/each}
</nav>
