# Plotly.js for Svelte
This is an unofficial package that lets you efficiently use [plotly.js](https://plotly.com/javascript/) inside your Svelte or SvelteKit app.

## Usage

1. Install using `yarn add svelte-plotly.js` or `npm install svelte-plotly.js`.
2. Use in your app

```svelte
<script lang="ts">
  import Plot from 'svelte-plotly.js';

  const data = [
    {
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 4, 8, 16]
    }
  ];
</script>

<Plot
  {data}
  layout={{
    margin: { t: 0 }
  }}
  fillParent='width'
  debounce={250}
/>
```

## Properties
| Prop      | Type        | Description
| --------- | ----------- | -------------
| **required `data`** | `Data[]`| array of trace data, see https://plot.ly/javascript/reference/
| `layout`  | `Partial<Layout>` | layout of the plot, see https://plot.ly/javascript/reference/#layout
| `config`  | `Partial<Config>` | configuration, see https://plot.ly/javascript/configuration-options/
| `class`   | `string`          | class that will be passed to the HTML element wrapping the plot
| `fillParent` | `boolean \| 'width' \| 'height'` | automatically resize the plot to fill the width and/or height of its parent element
| `debounce` | `number \| DebounceOptions` | debounce all changes to the plot
| `libPlotly` | `Plotly \| null \| undefined` | an alternative Plotly bundle to use; if undefined, it defaults to the `plotly.js-dist` package; if null, no plot will be drawn and no library will be downloaded
| `bind:element` | `HTMLDivElement` | the HTML element wrapping the plot
| `bind:plot` | `PlotlyHTMLElement` | the inner HTML element containing the plot


# Roadmap
 * [x] add autosizing
 * [x] add debouncing
 * [ ] add unit tests
 * [ ] add SSR rendering to an image
