<script lang="ts">
  import Plot from '$lib/Plot.svelte';
  import type { Data } from '$lib/Plot.svelte';

  let y0 = 1;

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
        .map((_) => 10 * Math.random())
    });
    data = data;
  }

  function changeY0() {
    y0++;
  }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<Plot
  {data}
  layout={{
    margin: { t: 0 }
  }}
/>

<button on:click={addData}>Add trace</button>
<button on:click={changeY0}>Increase y<sub>0</sub></button>
