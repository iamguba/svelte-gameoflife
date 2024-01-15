import { writable, type Writable } from 'svelte/store';

export type BoardGrid = Array<Array<boolean>>;

export type Board = {
	grid: BoardGrid;
	steps: number;
};

export type BoardStore = {
	subscribe: Writable<Board>['subscribe'];
	toggle: (row: number, column: number) => void;
	importFrom: (importData: string) => void;
	randomSeed: () => void;
	reset: () => void;
	nextGen: () => void;
};

type ExportColumn = Array<number>;
type ExportRow = [number, ExportColumn];

export const DEAD = false;
export const ALIVE = true;

export function createBoard(rows: number, cols: number): BoardStore {
	const { subscribe, set, update } = writable({
		grid: getEmptyGrid(rows, cols),
		steps: 0
	});

	const toggle = (row: number, column: number) =>
		update((board) => {
			board.grid[row][column] = !board.grid[row][column];
			return board;
		});

	const nextGen = () => update((board) => getNextGen(board));

	const reset = () =>
		set({
			grid: getEmptyGrid(rows, cols),
			steps: 0
		});

	const randomSeed = () =>
		set({
			grid: getRandomSeedGrid(rows, cols),
			steps: 0
		});

	const importFrom = (importData: string) =>
		set({
			grid: getImportedGrid(rows, cols, importData),
			steps: 0
		});

	return {
		subscribe,
		toggle,
		reset,
		randomSeed,
		nextGen,
		importFrom
	};
}

export function exportCells(grid: BoardGrid): string {
	const rows: Array<ExportRow> = [];

	grid.forEach((rowCells, row) => {
		const columns: ExportColumn = [];

		rowCells.forEach((cell, column) => {
			if (cell === ALIVE) {
				columns.push(column);
			}
		});

		if (columns.length) {
			rows.push([row, columns]);
		}
	});

	return JSON.stringify(rows);
}

function getEmptyGrid(rows: number, cols: number): BoardGrid {
	return new Array(rows).fill(null).map(() => new Array(cols).fill(DEAD));
}

function getRandomSeedGrid(rows: number, cols: number): BoardGrid {
	return new Array(rows).fill(null).map(() => {
		const column = new Array(cols).fill(null);

		column.forEach((_, index) => {
			column[index] = Math.random() > 0.6 ? ALIVE : DEAD;
		});

		return column;
	});
}

function getImportedGrid(rows: number, cols: number, importData: string): BoardGrid {
	const decoded = JSON.parse(importData);

	if (!Array.isArray(decoded)) {
		throw new Error('Invalid file structure!');
	}

	const grid = getEmptyGrid(rows, cols);

	decoded.forEach(([rowIndex, columns]) => {
		if (!Number.isInteger(rowIndex) || rowIndex < 0 || rowIndex >= rows) {
			throw new Error(`Invalid row index ${rowIndex}`);
		}

		if (!Array.isArray(columns)) {
			throw new Error(`Invalid column data at row index ${rowIndex}`);
		}

		columns.forEach((columnIndex) => {
			if (!Number.isInteger(columnIndex) || columnIndex < 0 || columnIndex >= cols) {
				throw new Error(`Invalid column index ${columnIndex}`);
			}

			grid[rowIndex][columnIndex] = ALIVE;
		});
	});

	return grid;
}

function getGridSize(grid: BoardGrid): [number, number] {
	return [grid.length, grid[0].length];
}

function countAliveNeighbours(grid: BoardGrid, row: number, column: number): number {
	const [rowsCount, colsCount] = getGridSize(grid);

	const coors: [number, number][] = [
		[row - 1, column - 1],
		[row - 1, column],
		[row - 1, column + 1],
		[row, column - 1],
		[row, column + 1],
		[row + 1, column - 1],
		[row + 1, column],
		[row + 1, column + 1]
	];

	const isValidCoor = ([r, c]: [number, number]) =>
		!(r < 0 || c < 0 || r >= rowsCount || c >= colsCount);

	const getCell = ([r, c]: [number, number]) => grid[r][c];

	const isAlive = (cell: boolean) => cell === ALIVE;

	return coors.filter(isValidCoor).map(getCell).filter(isAlive).length;
}

function getNextGen(board: Board): Board {
	console.time('nextGen');

	const { grid, steps } = board;
	const [rowsCount, colsCount] = getGridSize(grid);

	const newGrid = getEmptyGrid(rowsCount, colsCount);

	grid.forEach((rowCells, row) => {
		rowCells.forEach((prevState, column) => {
			const aliveNeighbours = countAliveNeighbours(grid, row, column);
			const nextState = getNextCellStateDayNight(prevState, aliveNeighbours);

			newGrid[row][column] = nextState;
		});
	});

	console.timeEnd('nextGen');

	return { grid: newGrid, steps: steps + 1 };
}

function getNextCellState(prevState: boolean, aliveNeighbours: number): boolean {
	if (prevState === ALIVE) {
		return aliveNeighbours === 2 || aliveNeighbours === 3;
	}

	return aliveNeighbours === 3;
}

function getNextCellStateDayNight(prevState: boolean, aliveNeighbours: number): boolean {
	if (prevState === ALIVE) {
		return [3, 4, 6, 7, 8].includes(aliveNeighbours);
	}

	return [3, 6, 7, 8].includes(aliveNeighbours);
}
