<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const commit = $derived(page.data['source']?.commit as string | undefined);
  const path = $derived(page.url.pathname);
</script>

<header class="site-header">
  <a class="site-title" href={resolve('/')}>Janusz Bryzek <span class="year">1978</span></a>
  <nav class="site-nav" aria-label="Strona · Site">
    <a href={resolve('/')} aria-current={path === '/' ? 'page' : undefined}>Spis treści · Contents</a>
    <a href={resolve('/glossary')} aria-current={path === '/glossary' ? 'page' : undefined}>Słownik · Glossary</a>
    <a href={resolve('/changelog')} aria-current={path === '/changelog' ? 'page' : undefined}>Zmiany · Changelog</a>
  </nav>
</header>

<main>
  {@render children()}
</main>

<footer class="site-footer">
  <p>
    Janusz Bryzek, <i>Metoda kompensacji wpływu temperatury w półprzewodnikowych przetwornikach ciśnienia</i>, praca doktorska, Politechnika
    Warszawska, 1978.
  </p>
  {#if commit}
    <p class="revision">Tekst · Text: {commit.slice(0, 12)}</p>
  {/if}
</footer>
