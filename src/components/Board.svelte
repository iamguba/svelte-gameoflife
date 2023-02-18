<script lang="ts">
    import Cell from './Cell.svelte';
    import type { BoardStore } from '../stores/Board';

    export let grid: BoardStore;
</script>

<svg width={grid.colsCount() * 6} height={grid.rowsCount() * 6}>
    {#each $grid as rowCells, row}
        {#each rowCells as isAlive, column}
            <Cell {isAlive} {row} {column} on:click={() => grid.toggle(row, column)}/>
        {/each}
    {/each}
</svg>