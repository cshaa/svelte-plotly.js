<script lang="ts">
  import Plot from '$lib/index.js';
  import type { Data, FillParent, DebounceOptions, Config } from '$lib/index.js';

  // FA icons borrowed for testing purposes only
  const MAXIMIZE_ICON = {
    width: 448,
    height: 512,
    path: 'M447.1 319.1v135.1c0 13.26-10.75 23.1-23.1 23.1h-135.1c-12.94 0-24.61-7.781-29.56-19.75c-4.906-11.1-2.203-25.72 6.937-34.87l30.06-30.06L224 323.9l-71.43 71.44l30.06 30.06c9.156 9.156 11.91 22.91 6.937 34.87C184.6 472.2 172.9 479.1 160 479.1H24c-13.25 0-23.1-10.74-23.1-23.1v-135.1c0-12.94 7.781-24.61 19.75-29.56C23.72 288.8 27.88 288 32 288c8.312 0 16.5 3.242 22.63 9.367l30.06 30.06l71.44-71.44L84.69 184.6L54.63 214.6c-9.156 9.156-22.91 11.91-34.87 6.937C7.798 216.6 .0013 204.9 .0013 191.1v-135.1c0-13.26 10.75-23.1 23.1-23.1h135.1c12.94 0 24.61 7.781 29.56 19.75C191.2 55.72 191.1 59.87 191.1 63.1c0 8.312-3.237 16.5-9.362 22.63L152.6 116.7l71.44 71.44l71.43-71.44l-30.06-30.06c-9.156-9.156-11.91-22.91-6.937-34.87c4.937-11.95 16.62-19.75 29.56-19.75h135.1c13.26 0 23.1 10.75 23.1 23.1v135.1c0 12.94-7.781 24.61-19.75 29.56c-11.1 4.906-25.72 2.203-34.87-6.937l-30.06-30.06l-71.43 71.43l71.44 71.44l30.06-30.06c9.156-9.156 22.91-11.91 34.87-6.937C440.2 295.4 447.1 307.1 447.1 319.1z'
  };
  const MINIMIZE_ICON = {
    width: 512,
    height: 512,
    path: 'M200 287.1H64c-12.94 0-24.62 7.797-29.56 19.75c-4.969 11.97-2.219 25.72 6.937 34.87l30.06 30.06l-62.06 62.07c-12.49 12.5-12.5 32.75-.0012 45.25l22.62 22.62c12.5 12.5 32.76 12.5 45.26 .0012l62.06-62.07l30.06 30.06c6.125 6.125 14.31 9.375 22.62 9.375c4.125 0 8.281-.7969 12.25-2.437c11.97-4.953 19.75-16.62 19.75-29.56V311.1C224 298.7 213.3 287.1 200 287.1zM312 224h135.1c12.94 0 24.62-7.797 29.56-19.75c4.969-11.97 2.219-25.72-6.937-34.87l-30.06-30.06l62.06-62.07c12.5-12.5 12.5-32.76 .0003-45.26l-22.62-22.62c-12.5-12.5-32.76-12.5-45.26-.0003l-62.06 62.07l-30.06-30.06c-9.156-9.141-22.87-11.84-34.87-6.937C295.8 39.39 288 51.06 288 64v135.1C288 213.3 298.7 224 312 224zM204.3 34.44C192.3 29.47 178.5 32.22 169.4 41.38L139.3 71.44L77.25 9.374C64.75-3.123 44.49-3.123 31.1 9.374l-22.63 22.63c-12.49 12.49-12.49 32.75 .0018 45.25l62.07 62.06L41.38 169.4C35.25 175.5 32 183.7 32 192c0 4.125 .7969 8.281 2.438 12.25C39.39 216.2 51.07 224 64 224h135.1c13.25 0 23.1-10.75 23.1-23.1V64C224 51.06 216.2 39.38 204.3 34.44zM440.6 372.7l30.06-30.06c9.141-9.156 11.84-22.88 6.938-34.87C472.6 295.8 460.9 287.1 448 287.1h-135.1c-13.25 0-23.1 10.75-23.1 23.1v135.1c0 12.94 7.797 24.62 19.75 29.56c11.97 4.969 25.72 2.219 34.87-6.937l30.06-30.06l62.06 62.06c12.5 12.5 32.76 12.5 45.26 .0002l22.62-22.62c12.5-12.5 12.5-32.76 .0002-45.26L440.6 372.7z'
  };

  let y0 = 1;
  let useDefaultLib = true;
  let fillParent: FillParent = false;
  let debounce: DebounceOptions | number | undefined;

  let fullscreen = false;
  $: {
    if (fullscreen) fillParent = true;
    else fillParent = false;
  }

  let data: Data[];
  $: data = [
    {
      x: [1, 2, 3, 4, 5],
      y: [y0, 2, 4, 8, 16]
    }
  ];

  let config: Partial<Config>;
  $: config = {
    modeBarButtonsToAdd: [
      {
        name: 'fullscreen',
        title: fullscreen ? 'Disable Fullscreen' : 'Enable Fullscreen',
        icon: fullscreen ? MINIMIZE_ICON : MAXIMIZE_ICON,
        click: () => (fullscreen = !fullscreen)
      }
    ]
  };

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

<main>
  <section class="plot">
    <Plot
      {data}
      {fillParent}
      {debounce}
      {config}
      layout={{
        margin: { t: 0 }
      }}
      libPlotly={useDefaultLib ? undefined : null}
      on:click={console.log}
      on:relayout={console.log}
    />
  </section>

  <section class="controls">
    <button on:click={addData}>Add trace</button>
    <button on:click={changeY0}>Increase y<sub>0</sub></button>
    <button on:click={() => (useDefaultLib = !useDefaultLib)}>Swap lib</button>
    <button on:click={() => (fillParent = false)}>Fixed size</button>
    <button on:click={() => (fillParent = true)}>Fill parent</button>
    <button on:click={() => (fillParent = 'width')}>Fill width</button>
    <button on:click={() => (fillParent = 'height')}>Fill height</button>
    <button on:click={() => (debounce = undefined)}>Don't debounce</button>
    <button on:click={() => (debounce = 500)}>Debounce 500ms</button>
    <button on:click={() => (debounce = { wait: 500, maxWait: 2000 })}
      >Debounce 500ms, max wait 2s</button
    >
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
