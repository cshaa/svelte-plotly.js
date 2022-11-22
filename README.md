# Plotly.js for Svelte
This is an unofficial package that lets you efficiently use [plotly.js](https://plotly.com/javascript/) inside your Svelte or SvelteKit app.

## Usage

1. Install using `yarn add svelte-plotly.js` or `npm install svelte-plotly.js`.
2. Choose a Plotly distribution:
   * If you want to use `plotly.js-dist`, just install it.
   * If you want to use a different distribution, take a look at [this section](#custom-plotly-distribution).
3. Use in your app:

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

## Custom Plotly distribution
Let's say you want to use svelte-plotly.js with a custom Plotly.js distribution, for example [`plotly.js-basic-dist-min`](https://www.npmjs.com/package/plotly.js-basic-dist-min). If you use Vite for bundling, the recommended way to do this would be to install `plotly.js-basic-dist-min` and then register it as an alias for `plotly.js-dist` by adding the following to your [`vite.config.js`](https://vitejs.dev/config/shared-options.html#resolve-alias):
```js
resolve: {
  alias: {
    "plotly.js-dist": "plotly.js-basic-dist-min",
    lodash: "lodash-es",
  },
},
```
If you don't use Vite, or this approach doesn't work for you, you can also use the `libPlotly` prop of the `Plotly` component:
```svelte
<script lang="ts">
  import Plot from 'svelte-plotly.js';
  import libPlotly from 'plotly.js-basic-dist-min';
</script>

<Plot {libPlotly} ... />
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

## Events
_**NOTE:** Due to Plotly's atrocious documentation, most events aren't even mentioned anywhere. Links to source code are provided as the bare minimum information about each event._

| Prop | Callback argument | Description
| ---- | ----------------- | -------------
| `on:afterExport` | — | ?
| `on:afterPlot` | — | triggers each time a chart is plotted, or re-plotted after the restyling or relayout of a plot [(docs)](https://plotly.com/javascript/plotlyjs-events/#afterplot-event), [(src)](https://github.com/plotly/plotly.js/blob/11699489c248767619f1f73cde4295f001ec37c3/src/plot_api/plot_api.js#L405)
| `on:animated` | — | triggers once an animation finished playing [(demo)](https://codepen.io/csha/pen/NWYJGgg), [(docs)](https://plotly.com/javascript/plotlyjs-events/#additional-events), [(src 1)](https://github.com/plotly/plotly.js/blob/11699489c248767619f1f73cde4295f001ec37c3/src/plot_api/plot_api.js#L405), [(src 2)](https://github.com/plotly/plotly.js/blob/11699489c248767619f1f73cde4295f001ec37c3/src/plot_api/plot_api.js#L3445)
| `on:animating` | — | ? [(src)](https://github.com/plotly/plotly.js/blob/11699489c248767619f1f73cde4295f001ec37c3/src/plot_api/plot_api.js#L3308)
| `on:animatingFrame` | [`FrameAnimationEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L126) | ? [(src)](https://github.com/plotly/plotly.js/blob/11699489c248767619f1f73cde4295f001ec37c3/src/plot_api/plot_api.js#L3293)
| `on:animationInterrupted` | — | ? [(src)](https://github.com/plotly/plotly.js/blob/11699489c248767619f1f73cde4295f001ec37c3/src/plot_api/plot_api.js#L3189)
| `on:autoSize` | — | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#additional-events)
| `on:beforeExport` | — | ?
| `on:beforeHover` | [`PlotMouseEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L69) | ?
| `on:beforePlot` | [`BeforePlotEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L243) | ? [(src)](https://github.com/plotly/plotly.js/blob/11699489c248767619f1f73cde4295f001ec37c3/src/plot_api/plot_api.js#L72)
| `on:buttonClicked` | [`ButtonClickedEvent`](https://github.com/m93a/svelte-plotly.js/blob/c59b0bad033960797200e359136befae87379ab6/src/lib/Plot.svelte#L46) | ?
| `on:click` | [`PlotMouseEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L69) | ? [(docs 1)](https://plotly.com/javascript/plotlyjs-events/#click-event), [(docs 2)](https://plotly.com/javascript/click-events/)
| `on:clickAnnotation` | [`ClickAnnotationEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L119) | ?
| `on:deselect` | — | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#additional-events)
| `on:doubleClick` | — | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#double-click-event)
| `on:framework` | — | ?
| `on:hover` | [`PlotHoverEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L74) | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#hover-event)
| `on:legendClick` | [`LegendClickEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L138) | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#legend-click-events)
| `on:legendDoubleClick` | [`LegendClickEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L138) | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#legend-click-events)
| `on:react` | [`PlotUpdateEvent`](https://github.com/m93a/svelte-plotly.js/blob/c59b0bad033960797200e359136befae87379ab6/src/lib/Plot.svelte#L52) | ?
  | `on:redraw` | — | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#additional-events)
| `on:relayout` | [`PlotRelayoutEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L110) | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#update-data)
| `on:relayouting` | [`PlotRelayoutEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L110) | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#update-data)
| `on:restyle` | [`PlotRestyleEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L102) | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#update-data)
| `on:selected` | [`PlotSelectionEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L92) | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#select-event)
| `on:selecting` | [`PlotSelectionEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L92) | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#select-event)
| `on:sliderChange` | [`SliderChangeEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L203) | ?
| `on:sliderEnd` | [`SliderEndEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L214) | ?
| `on:sliderStart` | [`SliderStartEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L210) | ?
| `on:sunburstClick` | [`SunburstClickEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L219) | ?
| `on:transitioned` | — | ?
| `on:transitioning` | — | ?
| `on:transitionInterrupted` | — | ?
| `on:unhover` | [`PlotMouseEvent`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0852d33e37bc8fff1fe99cc328bde65e84e3e1c0/types/plotly.js/index.d.ts#L69) | ?
| `on:update` | [`PlotUpdateEvent`](https://github.com/m93a/svelte-plotly.js/blob/c59b0bad033960797200e359136befae87379ab6/src/lib/Plot.svelte#L52) | ?
| `on:webGLContextLost` | — | ? [(docs)](https://plotly.com/javascript/plotlyjs-events/#additional-events)

# Roadmap
 * [x] add autosizing
 * [x] add debouncing
 * [x] add event redirecting
 * [ ] add unit tests
 * [ ] add SSR rendering to an image
