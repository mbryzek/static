<script lang="ts">
  interface Props {
    scan: string | null;
    printed: string | null;
  }

  let { scan, printed }: Props = $props();
</script>

{#if scan}
  <a class="page-label" id={scan} href="#{scan}" title="Skan {scan}">
    {#if printed}s. {printed}{:else}{scan}{/if}
  </a>
{/if}
