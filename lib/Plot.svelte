<script lang="ts">
    import { onMount } from 'svelte';
    let Plotly: null | typeof import("plotly.js");

    export let element: HTMLDivElement = null as never;

    console.log(element);

    onMount(async () => {
        Plotly = await import("plotly.js");
        console.log('loaded', Plotly);
    });
</script>

<div bind:this={element}></div>
