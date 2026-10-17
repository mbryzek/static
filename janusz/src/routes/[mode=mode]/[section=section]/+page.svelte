<script lang="ts">
  import Endnotes from '#lib/components/Endnotes.svelte';
  import ModeSelector from '#lib/components/ModeSelector.svelte';
  import PageLabel from '#lib/components/PageLabel.svelte';
  import { resolve } from '$app/paths';
  import { htmlLang, type Mode } from '#lib/thesis/modes.ts';

  let { data } = $props();

  const single = $derived(data.mode === 'pl' ? data.pl : data.mode === 'en' ? data.en : null);
  const titleText = $derived((data.pl ?? data.en)?.titleText ?? '');

  function title(section: string | null, mode: Mode): string {
    const entry = data.toc.find((t) => t.section === section);
    if (!entry) return '';
    return mode === 'en' ? entry.en : entry.pl;
  }
</script>

<svelte:head>
  <title>{titleText} — Janusz Bryzek 1978</title>
</svelte:head>

<ModeSelector current={data.mode} section={data.section} />

<article class="chapter" class:side-by-side={data.mode === 'pl-en'} lang={htmlLang(data.mode)}>
  {#if single}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time rendering of the thesis text from the projects repo -->
    <h1>{@html single.title}</h1>
    {#each single.pages as page, i (page.scan ?? `lead-${i}`)}
      <div class="page">
        <PageLabel scan={page.scan} printed={page.printed} />
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time rendering of the thesis text from the projects repo -->
        {@html page.html}
      </div>
    {/each}
    <Endnotes notes={single.notes} lang={single.lang} />
  {:else if data.pl && data.en}
    <div class="row titles">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time rendering of the thesis text from the projects repo -->
      <h1 lang="pl">{@html data.pl.title}</h1>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time rendering of the thesis text from the projects repo -->
      <h1 lang="en" class="secondary-title">{@html data.en.title}</h1>
    </div>
    {#each data.rows as row, i (row.scan ?? `lead-${i}`)}
      <div class="row">
        <PageLabel scan={row.scan} printed={row.printed} />
        <div class="cell" lang="pl">
          {#if row.pl}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time rendering of the thesis text from the projects repo -->
            {@html row.pl.html}
          {/if}
        </div>
        <div class="cell" lang="en">
          {#if row.en}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -- build-time rendering of the thesis text from the projects repo -->
            {@html row.en.html}
          {/if}
        </div>
      </div>
    {/each}
    <div class="row">
      <div class="cell"><Endnotes notes={data.pl.notes} lang="pl" /></div>
      <div class="cell"><Endnotes notes={data.en.notes} lang="en" /></div>
    </div>
  {/if}
</article>

<nav class="chapter-nav" aria-label="Rozdziały · Chapters">
  {#if data.prev}
    <a rel="prev" href={resolve('/[mode=mode]/[section=section]', { mode: data.mode, section: data.prev })}
      >← {title(data.prev, data.mode)}</a
    >
  {:else}
    <span></span>
  {/if}
  {#if data.next}
    <a rel="next" href={resolve('/[mode=mode]/[section=section]', { mode: data.mode, section: data.next })}
      >{title(data.next, data.mode)} →</a
    >
  {/if}
</nav>
