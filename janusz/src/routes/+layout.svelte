<script lang="ts">
  import 'katex/dist/katex.min.css';
  import '../app.css';
  import Shell from '#lib/components/Shell.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<Shell>
  {@render children()}
</Shell>
