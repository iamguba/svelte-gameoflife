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
        transition: fill 200ms linear;
    }

    rect.alive {
        fill: #4a32e4;
    }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<rect
    class:alive={isAlive}
    width="6"
    height="6"
    x={column * 6}
    y={row * 6}
    on:click>
</rect>