<script lang="ts">
  import Contents from '#lib/components/Contents.svelte';
  import ModeSelector from '#lib/components/ModeSelector.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Spis treści · Contents — Janusz Bryzek 1978</title>
</svelte:head>

<ModeSelector current={data.mode} section={null} />
<Contents toc={data.toc} mode={data.mode} />
