<script lang="ts">
    import Cell from './Cell.svelte';
    import type { BoardStore } from '../stores/Board';

    export let grid: BoardStore;
</script>

<style>
    div {
        display: flex;
        flex-wrap: wrap;
        width: calc(1em * var(--cols))
    }
</style>

<div style="--cols: {grid.colsCount()}">
{#each $grid as rowCells, row}
    {#each rowCells as isAlive, column}
        <Cell {isAlive} on:click={() => grid.toggle(row, column)}/>
    {/each}
{/each}
</div>