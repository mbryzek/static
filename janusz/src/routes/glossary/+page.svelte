<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>Słownik · Glossary — Janusz Bryzek 1978</title>
</svelte:head>

<h1>Słownik · Glossary</h1>

<table class="glossary">
  <thead>
    <tr>
      <th scope="col">Polski</th>
      <th scope="col">English</th>
      <th scope="col">Uwagi · Notes</th>
    </tr>
  </thead>
  <tbody>
    {#each data.terms as term (term.polish + term.english)}
      <tr>
        <td lang="pl">{term.polish}</td>
        <td lang="en">{term.english}</td>
        <td lang="en">{term.notes}</td>
      </tr>
    {/each}
  </tbody>
</table>
