import { type BoardStore, type BoardGrid, ALIVE } from './Board';
import { derived, type Readable } from 'svelte/store';

export type AliveCountStore = Readable<number>;

export function createAliveCount(board: BoardStore): AliveCountStore {
	const aliveCountStore = derived(board, ($board) => countAlive($board.grid));
	return aliveCountStore;
}

function countAlive(grid: BoardGrid): number {
	let count = 0;

	grid.forEach((rowCells) => {
		rowCells.forEach((cell) => (count += cell === ALIVE ? 1 : 0));
	});

	return count;
}
