<script lang="ts">
    export let isAlive: boolean;
    export let row: number;
    export let column: number;
</script>

<style>
    rect {
        fill: #101010;
        stroke: black;
        stroke-width: 1px;
        opacity: 100%;
    }

    rect.alive {
        opacity: 20%;
    }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<rect
    class:alive={isAlive}
    width="8"
    height="8"
    x={column * 8}
    y={row * 8}
    on:click>
</rect>