<script>
    export let isAlive = false;

    const COLOR_DEAD = '#d5d5d5';
    const COLOR_ALIVE = '#028b26';

    $: color = isAlive ? COLOR_ALIVE : COLOR_DEAD;
</script>

<style>
    div {
        display: flex;
        width: 0.8em;
        height: 0.8em;
        background-color: var(--color);
        border: 0.1em solid whitesmoke;
    }
</style>

<div style="--color: {color}" on:click></div>