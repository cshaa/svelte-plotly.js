<script lang="ts">
  import Plot from '$lib/Plot.svelte';
  import type { Data, FillParent, DebounceOptions } from '$lib/Plot.svelte';

  let y0 = 1;
  let useDefaultLib = true;
  let fillParent: FillParent = false;
  let debounce: DebounceOptions | number | undefined;

  let data: Data[];
  $: data = [
    {
      x: [1, 2, 3, 4, 5],
      y: [y0, 2, 4, 8, 16]
    }
  ];

  function addData() {
    data.push({
      x: [1, 2, 3, 4, 5],
      y: Array(5)
        .fill(0)
        .map(_ => 10 * Math.random())
    });
    data = data;
  }

  function changeY0() {
    y0++;
  }
</script>

<Plot
  {data}
  {fillParent}
  {debounce}
  layout={{
    margin: { t: 0 }
  }}
  libPlotly={useDefaultLib ? undefined : null}
  on:click={console.log}
  on:relayout={console.log}
/>

<div class="controls">
  <button on:click={addData}>Add trace</button>
  <button on:click={changeY0}>Increase y<sub>0</sub></button>
  <button on:click={() => (useDefaultLib = !useDefaultLib)}>Swap lib</button>
  <button on:click={() => (fillParent = false)}>Fixed size</button>
  <button on:click={() => (fillParent = true)}>Fill parent</button>
  <button on:click={() => (fillParent = 'width')}>Fill width</button>
  <button on:click={() => (fillParent = 'height')}>Fill height</button>
  <button on:click={() => (debounce = undefined)}>Don't debounce</button>
  <button on:click={() => (debounce = 500)}>Debounce 500ms</button>
  <button on:click={() => (debounce = { wait: 500, maxWait: 2000 })}>Debounce 500ms, max wait 2s</button>
</div>

<style lang="scss">
  :global(html, body, body > div) {
    padding: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
  }
  .controls {
    position: absolute;
    left: 0;
    bottom: 0;
  }
</style>
