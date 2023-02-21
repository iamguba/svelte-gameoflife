import { writable, type Writable } from 'svelte/store';

export type BoardGrid = Array<Array<boolean>>;

export type Board = {
    grid: BoardGrid,
    steps: number
};

export type BoardStore = {
    subscribe: Writable<Board>['subscribe'],
    toggle: (row: number, column: number) => void,
    importFrom: (importData: string) => void,
    randomSeed: () => void,
    reset: () => void,
    nextGen: () => void,
};

export const DEAD = false;
export const ALIVE = true;

export function createBoard(rows: number, cols: number): BoardStore {
    const { subscribe, set, update } = writable({
        grid: getEmptyGrid(rows, cols),
        steps: 0
    });

    const toggle = (row: number, column: number) => update((board) => {
        board.grid[row][column] = !board.grid[row][column];
        return board;
    });

    const reset = () => set({
        grid: getEmptyGrid(rows, cols),
        steps: 0
    });

    const nextGen = () => update((board) => getNextGen(board));

    const randomSeed = () => set({
        grid: getRandomSeedGrid(rows, cols),
        steps: 0
    });

    const importFrom = (importData: string) => set({
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
    const rows: Array<Array<number | Array<number>>> = [];

    grid.forEach((rowCells, row) => {
        const columns: Array<number> = [];

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
    return (new Array(rows).fill(null)).map(() => (new Array(cols)).fill(DEAD));
}

function getRandomSeedGrid(rows: number, cols: number): BoardGrid {
    return (new Array(rows).fill(null)).map(() => {
        const column = (new Array(cols)).fill(null);
        
        column.forEach((_, index) => {
            column[index] = (Math.random() > 0.8) ? ALIVE : DEAD;
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

    const coors = [
        [row - 1, column - 1], [row - 1, column], [row - 1, column + 1],
        [row, column - 1], [row, column + 1],
        [row + 1, column - 1], [row + 1, column], [row + 1, column + 1],
    ];

    const isValidCoor = (r: number, c: number) =>
        !(r < 0 || c < 0 || r >= rowsCount || c >= colsCount);

    return coors
        .filter(([r, c]) => isValidCoor(r, c))
        .map(([r, c]) => grid[r][c])
        .filter((cell) => cell === ALIVE)
        .length;
}

function getNextGen(board: Board): Board {
    const { grid, steps } = board;
    const [rowsCount, colsCount] = getGridSize(grid);

    const newGrid = getEmptyGrid(rowsCount, colsCount);

    grid.forEach((rowCells, row) => {
        rowCells.forEach((isAlive, column) => {
            const aliveNeighbours = countAliveNeighbours(grid, row, column);

            switch (true) {
                case (isAlive && aliveNeighbours < 2):
                case (isAlive && aliveNeighbours > 3):
                    newGrid[row][column] = DEAD;
                    break;
                
                case (isAlive && (aliveNeighbours === 2 || aliveNeighbours === 3)):
                case (!isAlive && aliveNeighbours === 3):
                    newGrid[row][column] = ALIVE;
                    break;

                default: 
                    newGrid[row][column] = DEAD;
            }
        });
    });

    return { grid: newGrid, steps: steps + 1 };
}