<script context="module" lang="ts">
  import type { Data, Layout, Config, PlotlyHTMLElement } from 'plotly.js';
  export type { Data, Layout, Config, PlotlyHTMLElement };
  export type FillParent = boolean | 'width' | 'height';
  import type { DebounceSettings } from 'lodash-es';
  export interface DebounceOptions extends DebounceSettings {
    wait: number;
  }
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { debounce as debouncify } from 'lodash-es';
  const browser = typeof window === 'object';
  type not = undefined | null;

  const nextFrame = browser ? requestAnimationFrame : () => void 0;

  async function loadPlotly() {
    if (!browser) return;
    if (libPlotly === undefined) {
      const p = await import('plotly.js-dist');
      if (libPlotly === undefined) libPlotly = p;
    }
  }

  const DEFAULT_WIDTH = 500;
  const DEFAULT_HEIGHT = 300;

  // bind props
  export let element: HTMLDivElement | not = undefined;
  export let plot: PlotlyHTMLElement | not = undefined;

  // input props
  export let libPlotly: typeof import('plotly.js-dist') | null | undefined = undefined;
  export let data: Data[];
  export let layout: Partial<Layout> | undefined = undefined;
  export let config: Partial<Config> | undefined = undefined;
  export let fillParent: FillParent = false;
  export let debounce: number | DebounceOptions = 0;
  let className = '';
  export { className as class };

  // set up
  onMount(async () => {
    (window as any).global = window;
    loadPlotly();
  });

  // state props
  let datarevision = 0;
  let previousLib = libPlotly;
  let width: number = DEFAULT_WIDTH;
  let height: number = DEFAULT_HEIGHT;

  // updates
  $: debounceWait = typeof debounce === 'object' ? debounce.wait : debounce ?? 0;
  $: debounceOptions = typeof debounce === 'object' ? debounce : {};
  $: data, (datarevision = (datarevision + 1) % 1000);
  $: layout_ = { datarevision, width, height, ...layout };
  $: config_ = { displaylogo: false, ...config };
  $: draw(libPlotly, element, data, layout_, config_);
  $: {
    if (element && previousLib !== libPlotly) previousLib?.purge(element);
    previousLib = libPlotly;
    loadPlotly();
  }

  const drawUndebounced = (
    lib: typeof libPlotly,
    e: HTMLDivElement | not,
    d: Data[],
    l: Partial<Layout>,
    c: Partial<Config>
  ) => {
    if (e) lib?.react(e, d, l, c).then(p => (plot = p));
  };

  $: draw = debouncify(drawUndebounced, debounceWait, debounceOptions);

  // destroy
  onDestroy(() => element && libPlotly?.purge(element));

  // autosizing
  $: fillParent, nextFrame(onResize);
  $: fillParentWidth = fillParent === true || fillParent === 'width';
  $: fillParentHeight = fillParent === true || fillParent === 'height';
  $: parent = element?.parentElement;
  let lastParent: typeof parent = null;
  $: {
    parentMounted(parent);
    parentUnmounted(lastParent);
    lastParent = parent;
  }

  let resizeObserver: ResizeObserver | not;
  onMount(() => (resizeObserver = new ResizeObserver(onResize)));
  const parentMounted = (parent: Element | not) => parent && resizeObserver?.observe(parent);
  const parentUnmounted = (parent: Element | not) => parent && resizeObserver?.unobserve(parent);

  function onResize() {
    if (!parent || !element) return;

    const { offsetHeight, offsetWidth } = parent;
    const { paddingLeft, paddingTop, paddingRight, paddingBottom } =
      window.getComputedStyle(parent);

    const maxWidth = offsetWidth - parseInt(paddingLeft) - parseInt(paddingRight);
    const maxHeight = offsetHeight - parseInt(paddingTop) - parseInt(paddingRight);

    width = fillParentWidth ? maxWidth : DEFAULT_WIDTH;
    height = fillParentHeight ? maxHeight : DEFAULT_HEIGHT;
  }
</script>

<div
  class={className}
  class:fillParent
  class:fillParentWidth
  class:fillParentHeight
  bind:this={element}
/>

<style lang="scss">
  .fillParent {
    overflow: visible;
  }
  .fillParentWidth {
    width: 0 !important;
    max-width: 0 !important;
  }
  .fillParentHeight {
    height: 0 !important;
    max-height: 0 !important;
  }
</style>
