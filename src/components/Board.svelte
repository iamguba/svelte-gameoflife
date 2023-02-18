<script lang="ts">
    import Cell from './Cell.svelte';
    import type { BoardStore } from '../stores/Board';

    export let grid: BoardStore;
</script>

<style>
    svg {
        display: flex;
        margin: auto;
        padding-bottom: 2em;
    }
</style>

<svg width={grid.colsCount() * 8} height={grid.rowsCount() * 8}>
    {#each $grid as rowCells, row}
        {#each rowCells as isAlive, column}
            <Cell {isAlive} {row} {column} on:click={() => grid.toggle(row, column)}/>
        {/each}
    {/each}
</svg>