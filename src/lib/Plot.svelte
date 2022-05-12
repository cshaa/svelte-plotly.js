<script context="module" lang="ts">
  import type { Data, Layout, Config, PlotlyHTMLElement } from 'plotly.js';
  export type { Data, Layout, Config, PlotlyHTMLElement };
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let Plotly: null | typeof import('plotly.js-dist');
  let datarevision = 0;

  // set up
  onMount(async () => {
    (window as any).global = window;
    Plotly = await import('plotly.js-dist');
  });

  // bind props
  export let element: HTMLDivElement = null as never;
  export let plot: PlotlyHTMLElement = null as never;

  // input props
  export let data: Data[];
  export let layout: Partial<Layout> | undefined = undefined;
  export let config: Partial<Config> | undefined = undefined;
  let className = '';
  export { className as class };

  // update
  $: data, (datarevision = (datarevision + 1) % 1000);
  $: layoutWithRevison = { datarevision, ...layout };
  $: configWithoutLogo = { displaylogo: false, ...config };
  $: Plotly?.react(element, data, layoutWithRevison, configWithoutLogo).then(p => (plot = p));

  // destroy
  onDestroy(() => {
    Plotly?.purge(plot);
  });
</script>

<div class={className} bind:this={element} />
