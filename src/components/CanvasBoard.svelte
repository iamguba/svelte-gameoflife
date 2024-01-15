<script lang="ts">
	import { Canvas, Layer } from 'svelte-canvas';

	import type { BoardStore } from '../stores/Board';
	import type { AlivePercentsCountStore } from '../stores/AlivePercentsCount';

	export let board: BoardStore;
	export let rows: number;
	export let cols: number;
	export let alivePercentsCount: AlivePercentsCountStore;

	type LayoutProps = {
		context: CanvasRenderingContext2D;
		width: number;
		height: number;
	};

	const CELL_SIZE_PX = 3;
	const CELL_DEAD_FILL = '#101010';
	const CELL_STROKE_FILL = 'black';

	const gridHeight = rows * CELL_SIZE_PX;
	const gridWidth = cols * CELL_SIZE_PX;

	function updateBackground({ context }: LayoutProps) {
		context.fillStyle = CELL_DEAD_FILL;
		context.fillStyle = `hsl(${(360 * (100 - $alivePercentsCount)) / 100}, 100%, 7%)`;
		context.fillRect(0, 0, gridWidth, gridHeight);

		context.strokeStyle = CELL_STROKE_FILL;

		for (let row = 0; row < rows; row++) {
			for (let column = 0; column < cols; column++) {
				context.strokeRect(column * CELL_SIZE_PX, row * CELL_SIZE_PX, CELL_SIZE_PX, CELL_SIZE_PX);
			}
		}
	}

	function updateBoard({ context }: LayoutProps) {
		context.fillStyle = `hsl(${$alivePercentsCount}, 100%, 60%)`;

		for (let row = 0; row < rows; row++) {
			for (let column = 0; column < cols; column++) {
				if ($board.grid[row][column]) {
					context.fillRect(
						column * CELL_SIZE_PX + 1,
						row * CELL_SIZE_PX + 1,
						CELL_SIZE_PX - 1,
						CELL_SIZE_PX - 1
					);
				}
			}
		}
	}
</script>

<Canvas autoplay width={gridWidth} height={gridHeight}>
	<Layer render={updateBackground} />
	<Layer render={updateBoard} />
</Canvas>

<style>
</style>
