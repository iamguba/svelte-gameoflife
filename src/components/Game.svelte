<script lang="ts">
    import Board from "./Board.svelte";
    import GameButton from "./GameButton.svelte";
    import { createBoard, exportCells } from '../stores/Board';
    import gameOfLife from '../examples/gameoflife.json';
    import { onMount, onDestroy } from 'svelte';

    export let rows;
    export let cols;

    const grid = createBoard(rows, cols);

    let interval: NodeJS.Timeout | null = null;

    let aliveCount = 0;
    let stepsCount = 0;

    let importFiles: FileList | null = null;
    let importInput: HTMLInputElement | null = null;

    onMount(() => {
        grid.importFrom(JSON.stringify(gameOfLife));
    });

    onDestroy(() => {
        interval && clearInterval(interval);
    });

    grid.aliveCount.subscribe((count) => {
        aliveCount = count;
    });

    grid.stepsCount.subscribe((steps) => {
        stepsCount = steps;
    });

    function handlePlayPause() {
        if (interval) {
            clearInterval(interval);
            interval = null;
            return;
        }

        interval = setInterval(grid.nextGen, 100);
    }

    function handleExport() {
        const link = document.createElement('a');
        const content = exportCells($grid);
        const file = new Blob([content], { type: 'application/json' });

        link.href = URL.createObjectURL(file);
        link.download = 'export.json';

        link.click();
        URL.revokeObjectURL(link.href);
    }

    function handleImportClick() {
        importInput?.click();
    }

    function readImport(importFile: File): Promise<string> {
        return new Promise((ok) => {
            const reader = new FileReader();

            reader.onloadend = (event) => {
                const importData = event.target?.result;
                ok(String(importData));
            };

            reader.readAsText(importFile);
        });
    }

    $: isPlaying = !!interval;
    $: isEmpty = !aliveCount;
    $: isNonExported = isPlaying || isEmpty;
    $: playPauseTitle = isPlaying ? 'Pause' : 'Play';

    $: if (importFiles && importFiles[0]) {
        readImport(importFiles[0])
            .then((importData) => grid.importFrom(importData))
            .catch((e) => {
                const errorMessage = (<Error>e).message;
                alert(`Error importing file: "${errorMessage}"`);
            })
            .finally(() => (<HTMLInputElement>importInput).value = '')
    }
    
</script>

<style>
    section {
        display: flex;
        margin: auto;
        padding-bottom: 1em;
    }

    aside {
        color: #cacaca;
        font-size: 1em;
        font-family: sans-serif;
        line-height: 40%;
        cursor: default;
        text-transform: lowercase;
    }

    aside p:hover {
        color: whitesmoke;
    }

    .break {
        flex-basis: 100%;
        height: 0;
    }

    input[type="file"] {
        display: none;
    }
</style>

<Board {grid}/>

<section>
    <GameButton title={playPauseTitle} disabled={isEmpty} on:click={handlePlayPause}/>
    <GameButton title="Next Step" disabled={isNonExported} on:click={grid.nextGen}/>
    <GameButton title="Reset" disabled={isNonExported} on:click={grid.reset}/>
    <GameButton title="Random" disabled={isPlaying} on:click={grid.randomSeed}/>
    <GameButton title="Export" disabled={isNonExported} on:click={handleExport}/>
    <GameButton title="Import" disabled={isPlaying} on:click={handleImportClick}/>
</section>

<input
    type="file"
    accept="application/json"
    bind:files={importFiles}
    bind:this={importInput}
/>

<div class="break"></div>

<aside>
    <p>Cells alive: {aliveCount}</p>
    <p>Steps: {stepsCount}</p>
</aside>