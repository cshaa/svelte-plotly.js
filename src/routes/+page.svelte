<script lang="ts">
  import { faExpand, faCompress, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
  import { PlotV2, faToPlotly } from '$lib/index.js';
  import type { ModeBarDefaultButtons, ModeBarButtonAny } from 'plotly.js';
  import type { Data, FillParent, DebounceOptions, Config } from '$lib/index.js';

  let y0 = $state(1);
  let useDefaultLib = $state(true);
  let staticPlot = $state(false);
  let showLogo = $state(false);
  let modeBarButtons: ModeBarButtonAny[][] | undefined = $state(undefined);
  let buttonsToRemove: ModeBarDefaultButtons[] = $state(['autoScale2d']);
  let debounce: DebounceOptions | number | undefined = $state();

  let fullscreen = $state(false);
  let fillParent: FillParent = $derived(fullscreen);

  // svelte-ignore state_referenced_locally
  let data: Data[] = $state([{ x: [1, 2, 3, 4, 5], y: [y0, 2, 4, 8, 16] }]);

  let config: Partial<Config> = $derived({
    modeBarButtonsToAdd: [
      {
        name: 'fullscreen',
        title: fullscreen ? 'Disable Fullscreen' : 'Enable Fullscreen',
        icon: fullscreen ? faToPlotly(faCompress) : faToPlotly(faExpand),
        click: () => (fullscreen = !fullscreen)
      }
    ],
    modeBarButtonsToRemove: [...(buttonsToRemove ?? [])],
    modeBarButtons,

    staticPlot,
    displaylogo: showLogo
  });

  function addData() {
    data.push({
      x: [1, 2, 3, 4, 5],
      y: Array(5)
        .fill(0)
        .map(_ => 10 * Math.random())
    });
  }
</script>

<main>
  <section class="plot">
    <PlotV2
      {data}
      {fillParent}
      {debounce}
      {config}
      layout={{ margin: { t: 0 } }}
      libPlotly={useDefaultLib ? undefined : null}
      onEvent={(event, args) => {
        if (event === 'plotly_click' || event === 'plotly_relayout') console.log(args);
      }}
    />
  </section>

  <section class="controls">
    <button onclick={addData}>Add trace</button>
    <button onclick={() => (y0 += 1)}>Increase y<sub>0</sub></button>
    <button onclick={() => (useDefaultLib = !useDefaultLib)}>Swap lib</button>
    <button onclick={() => (fillParent = false)}>Fixed size</button>
    <button onclick={() => (fillParent = true)}>Fill parent</button>
    <button onclick={() => (fillParent = 'width')}>Fill width</button>
    <button onclick={() => (fillParent = 'height')}>Fill height</button>
    <button onclick={() => (debounce = undefined)}>Don't debounce</button>
    <button onclick={() => (debounce = 500)}>Debounce 500ms</button>
    <button onclick={() => (debounce = { wait: 500, maxWait: 2000 })}
      >Debounce 500ms, max wait 2s</button
    >
    <button onclick={() => (staticPlot = !staticPlot)}>Toggle static plot</button>
    <button onclick={() => (showLogo = !showLogo)}>Toggle Plotly logo</button>
    <button
      onclick={() => {
        buttonsToRemove =
          buttonsToRemove.length > 1
            ? ['autoScale2d']
            : ['zoomIn2d', 'zoomOut2d', 'zoom2d', 'autoScale2d'];
      }}>Toggle zoom buttons</button
    >
    <button
      onclick={() => {
        modeBarButtons ??= [];
        modeBarButtons.push([
          {
            name: `foobar${modeBarButtons.length}`,
            title: `Foobar #${modeBarButtons.length}`,
            icon: faToPlotly(faInfoCircle),
            click: () => {}
          }
        ]);
      }}>Add custom button</button
    >
    <button
      onclick={() => {
        if (modeBarButtons?.length && modeBarButtons[0].length) {
          (modeBarButtons[0][0] as any).title = prompt('Enter new name');
          modeBarButtons = modeBarButtons;
        }
      }}>Rename first custom button</button
    >
    <button onclick={() => (modeBarButtons = undefined)}>Remove custom buttons</button>
  </section>
</main>

<style lang="scss">
  :global(html, body, body > div) {
    padding: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
  }
  main {
    display: flex;
    flex-direction: column;
    justify-items: stretch;

    width: 100vw;
    height: 100vh;

    .plot {
      flex-grow: 1;
      margin: 1rem;
    }
  }
</style>
