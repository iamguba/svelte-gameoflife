<script lang="ts">
    import Cell from './Cell.svelte';
    import type { BoardStore } from '../stores/Board';
    import type { AlivePercentsCountStore } from '../stores/AlivePercentsCount';

    export let board: BoardStore;
    export let rows: number;
    export let cols: number;
    export let alivePercentsCount: AlivePercentsCountStore;

    const CELL_SIZE_PX = 8;

    const gridHeight = rows * CELL_SIZE_PX;
    const gridWidth = cols * CELL_SIZE_PX;
</script>

<style>
    svg {
        display: flex;
        margin: auto;
        padding-bottom: 2em;
    }

    rect.light {
        fill: hsl(var(--hue), 100%, 50%);
        z-index: -1;
    }
</style>

<svg width={gridWidth} height={gridHeight}>
    {#if $alivePercentsCount > 0}
        <rect
            class="light"
            style="--hue: {$alivePercentsCount}"
            width={gridWidth}
            height={gridHeight}
            x="0"
            y="0">
        </rect>
    {/if}

    {#each $board.grid as rowCells, row}
        {#each rowCells as isAlive, column}
            <Cell {isAlive} {row} {column} on:click={() => board.toggle(row, column)}/>
        {/each}
    {/each}
</svg>