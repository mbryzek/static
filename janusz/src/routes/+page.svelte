<script lang="ts">
  import { onMount } from 'svelte';
  import Contents from '#lib/components/Contents.svelte';
  import ModeSelector from '#lib/components/ModeSelector.svelte';
  import { DEFAULT_MODE, isMode, MODE_STORAGE_KEY, type Mode } from '#lib/thesis/modes.ts';

  let { data } = $props();

  // The contents follow the reader's last choice of language; English until they make one.
  let mode = $state<Mode>(DEFAULT_MODE);

  onMount(() => {
    try {
      const stored = localStorage.getItem(MODE_STORAGE_KEY);
      if (stored !== null && isMode(stored)) mode = stored;
    } catch {
      // Storage blocked: stay on the default.
    }
  });
</script>

<svelte:head>
  <title>Janusz Bryzek — Metoda kompensacji wpływu temperatury (1978)</title>
  <meta
    name="description"
    content="Janusz Bryzek's 1978 doctoral thesis on temperature compensation in semiconductor pressure transducers, in Polish and in English translation."
  />
</svelte:head>

<section class="landing">
  <h1 lang="pl">Metoda kompensacji wpływu temperatury w półprzewodnikowych przetwornikach ciśnienia</h1>
  <p class="subtitle">A Method of Temperature Compensation in Semiconductor Pressure Transducers</p>
  <p class="byline">Janusz Bryzek · Politechnika Warszawska · 1978</p>

  <ModeSelector current={mode} section="front" />

  <Contents toc={data.toc} {mode} />
</section>
