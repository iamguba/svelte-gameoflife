<script>
    export let isAlive = false;
    export let row = 0;
    export let column = 0;
</script>

<style>
    rect {
        fill: #101010;
        stroke: black;
        stroke-width: 1px;
    }

    rect.alive {
        fill: #31bf4d;
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