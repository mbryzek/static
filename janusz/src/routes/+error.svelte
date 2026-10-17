<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>{page.status} — Janusz Bryzek 1978</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<h1>{page.status}</h1>
<p>{page.status === 404 ? 'Nie ma takiej strony. · This page does not exist.' : page.error?.message}</p>
<p><a href={resolve('/')}>Spis treści · Contents</a></p>
