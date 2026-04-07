<script module lang="ts">
  import { debounce as debouncify } from 'lodash-es';

  import type { Data, Layout, Config, PlotlyHTMLElement } from 'plotly.js';

  export type FillParent = boolean | 'width' | 'height';
  import type { DebounceSettings } from 'lodash-es';

  export interface DebounceOptions extends DebounceSettings {
    wait: number;
  }

  export interface ButtonClickedEvent {
    menu: any;
    button: any;
    active: any;
  }

  export interface PlotUpdateEvent {
    data: Data;
    layout: Layout;
  }

  export const plotlyEvents = [
    'plotly_afterexport',
    'plotly_afterplot',
    'plotly_animated',
    'plotly_animating',
    'plotly_animatingframe',
    'plotly_animationinterrupted',
    'plotly_autosize',
    'plotly_beforeexport',
    'plotly_beforehover',
    'plotly_beforeplot',
    'plotly_buttonclicked',
    'plotly_click',
    'plotly_clickannotation',
    'plotly_deselect',
    'plotly_doubleclick',
    'plotly_framework',
    'plotly_hover',
    'plotly_legendclick',
    'plotly_legenddoubleclick',
    'plotly_react',
    'plotly_redraw',
    'plotly_relayout',
    'plotly_relayouting',
    'plotly_restyle',
    'plotly_selected',
    'plotly_selecting',
    'plotly_sliderchange',
    'plotly_sliderend',
    'plotly_sliderstart',
    'plotly_sunburstclick',
    'plotly_transitioned',
    'plotly_transitioning',
    'plotly_transitioninterrupted',
    'plotly_unhover',
    'plotly_update',
    'plotly_webglcontextlost'
  ] as const;
</script>

<script lang="ts">
  const browser = typeof window === 'object';

  const nextFrame = browser ? requestAnimationFrame : () => void 0;

  function loadPlotly() {
    if (!browser || libPlotly) return;

    if (window.Plotly) {
      libPlotly = window.Plotly;
    } else {
      import('plotly.js-dist').then(p => {
        if (libPlotly === undefined) libPlotly = 'default' in p ? p.default : p;
      });
    }
  }

  const DEFAULT_WIDTH = 500;
  const DEFAULT_HEIGHT = 300;

  interface Props {
    /** The HTML element wrapping the plot. */
    element?: HTMLDivElement;
    /** The inner HTML element containing the plot. */
    plot?: PlotlyHTMLElement;

    /**
     * Alternative Plotly bundle to use. If `undefined`, it defaults to
     * the `plotly.js-dist` package; if null, no plot will be drawn and
     * no library will be downloaded.
     */
    libPlotly: typeof import('plotly.js-dist') | null | undefined;

    /**
     * Array of trace data, see https://plot.ly/javascript/reference/
     */
    data: Data[];

    /**
     * Layout of the plot, see https://plot.ly/javascript/reference/#layout
     */
    layout?: Partial<Layout>;

    /**
     * Configuration, see https://plot.ly/javascript/configuration-options/
     */
    config?: Partial<Config>;

    /**
     * Automatically resize the plot to fill the width and/or
     * height of its parent element.
     */
    fillParent: FillParent;

    /**
     * Debounce all changes to the plot.
     */
    debounce?: number | DebounceOptions;

    /**
     * Class attribute that will be passed to the HTML element
     * wrapping the plot
     */
    class?: string;

    onEvent: ((event: (typeof plotlyEvents)[number], data: unknown) => void) | undefined;
  }

  let {
    element = $bindable(),
    plot = $bindable(),

    libPlotly,
    data,
    layout,
    config,
    fillParent,
    debounce,
    class: className,

    onEvent
  }: Props = $props();

  // set up
  $effect(() => {
    (window as any).global = window;
    loadPlotly();

    return () => {
      if (element) libPlotly?.purge(element);
    };
  });

  // state props
  let width: number = $state(DEFAULT_WIDTH);
  let height: number = $state(DEFAULT_HEIGHT);

  // updates
  const debounceWait = $derived(typeof debounce === 'object' ? debounce.wait : (debounce ?? 0));
  const debounceOptions = $derived(typeof debounce === 'object' ? debounce : {});

  const layout_ = $derived({ width, height, ...layout });
  const config_ = $derived({ displaylogo: false, ...config });

  $effect(() => {
    if (!plot || !onEvent) return;

    for (const event of plotlyEvents) {
      plot?.on(event as any, e => onEvent(event, e));
    }

    return () => {
      for (const event of plotlyEvents) {
        plot?.removeAllListeners?.(event);
      }
    };
  });

  const drawUndebounced = async () => {
    if (!libPlotly || !element) return;

    plot = await libPlotly.react(element, data, layout_, config_);
  };

  const draw = $derived(debouncify(drawUndebounced, debounceWait, debounceOptions));

  $effect(() => {
    void (void libPlotly, element, data, layout_, config_);
    draw();
  });

  // autosizing
  const fillParentWidth = $derived(fillParent === true || fillParent === 'width');
  const fillParentHeight = $derived(fillParent === true || fillParent === 'height');
  const parent = $derived(element?.parentElement ?? undefined);

  function onResize() {
    if (!parent || !element) return;

    const { offsetHeight, offsetWidth } = parent;
    const { paddingLeft, paddingTop, paddingRight, paddingBottom } =
      window.getComputedStyle(parent);

    const maxWidth = offsetWidth - parseInt(paddingLeft) - parseInt(paddingRight);
    const maxHeight = offsetHeight - parseInt(paddingTop) - parseInt(paddingBottom);

    width = fillParentWidth ? maxWidth : DEFAULT_WIDTH;
    height = fillParentHeight ? maxHeight : DEFAULT_HEIGHT;
  }

  $effect(() => {
    void fillParent;

    nextFrame(onResize);
  });

  $effect(() => {
    if (!parent) return;

    const resizeObserver = new ResizeObserver(onResize);

    if (parent) resizeObserver.observe(parent);
    return () => resizeObserver.disconnect();
  });
</script>

<div
  class={className}
  class:fillParent
  class:fillParentWidth
  class:fillParentHeight
  bind:this={element}
></div>

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
