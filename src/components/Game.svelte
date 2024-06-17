<script lang="ts">
	import GameButton from './GameButton.svelte';
	import CanvasBoard from './CanvasBoard.svelte';

	import { createBoard, exportCells } from '../stores/Board';
	import { createAliveCount } from '../stores/AliveCount';
	import { createAlivePercentsCount } from '../stores/AlivePercentsCount';
	import { createPlayer } from '../stores/Player';

	import { onMount, onDestroy } from 'svelte';

	import gameOfLife from '../examples/gameoflife.json';

	export let rows: number;
	export let cols: number;

	const board = createBoard(rows, cols);
	const aliveCount = createAliveCount(board);
	const alivePercentsCount = createAlivePercentsCount(board, aliveCount);
	const boardPlayer = createPlayer(board);

	let importFiles: FileList;
	let importInput: HTMLInputElement;

	onMount(() => {
		board.importFrom(JSON.stringify(gameOfLife));
	});

	onDestroy(() => {
		boardPlayer.pause();
	});

	function handlePlayPause() {
		isPlaying ? boardPlayer.pause() : boardPlayer.play();
	}

	function handleExport() {
		const link = document.createElement('a');
		const content = exportCells($board.grid);
		const file = new Blob([content], { type: 'application/json' });

		link.href = URL.createObjectURL(file);
		link.download = 'export.json';

		link.click();
		URL.revokeObjectURL(link.href);
	}

	function handleImportClick() {
		importInput.click();
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

	$: isPlaying = $boardPlayer;
	$: isEmpty = $aliveCount === 0;
	$: isNotReadyForExport = isPlaying || isEmpty;
	$: playPauseTitle = isPlaying ? 'Pause' : 'Play';

	$: if (importFiles && importFiles[0]) {
		readImport(importFiles[0])
			.then((importData) => board.importFrom(importData))
			.catch((e) => {
				const errorMessage = (<Error>e).message;
				alert(`Error importing file: "${errorMessage}"`);
			})
			.finally(() => (importInput.value = ''));
	}
</script>

<main>
	<CanvasBoard {...{ board, rows, cols, alivePercentsCount }} />

	<section>
		<GameButton title={playPauseTitle} disabled={isEmpty} on:click={handlePlayPause} />
		<GameButton title="Next Step" disabled={isNotReadyForExport} on:click={board.nextGen} />
		<GameButton title="Reset" disabled={isNotReadyForExport} on:click={board.reset} />
		<GameButton title="Random" disabled={isPlaying} on:click={board.randomSeed} />
		<GameButton title="Export" disabled={isNotReadyForExport} on:click={handleExport} />
		<GameButton title="Import" disabled={isPlaying} on:click={handleImportClick} />
	</section>

	<section>
		<GameButton title="classic game of life" disabled={!$board.isDayNight} on:click={() => board.setIsDayNight(false)} />
		<GameButton title="day night" disabled={$board.isDayNight} on:click={() => board.setIsDayNight(true)} />
	</section>
</main>

<input type="file" accept="application/json" bind:files={importFiles} bind:this={importInput} />

<aside>
	<p>Cells alive: {$aliveCount}</p>
	<p>Percents alive: {$alivePercentsCount}</p>
	<p>Steps: {$board.steps}</p>
</aside>

<style>
	main {
		width: 60%; /* Adjust width as needed */
    margin: 0 auto;
	}

	section {
		width: 100%;
		margin: 0 auto;
		padding-bottom: 2em;
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

	input[type='file'] {
		display: none;
	}
</style>
