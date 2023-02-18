import { writable, derived, type Writable, type Readable } from 'svelte/store';

type BoardGrid = Array<Array<boolean>>;

export type BoardStore = {
    subscribe: Writable<BoardGrid>['subscribe'],
    rowsCount: () => number,
    colsCount: () => number,
    aliveCount: Readable<number>,
    stepsCount: Readable<number>,
    toggle: (row: number, column: number) => void,
    importFrom: (importData: string) => void,
    reset: () => void,
    nextGen: () => void,
    randomSeed: () => void
};

const DEAD = false;
const ALIVE = true;

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

function countAlive(grid: BoardGrid): number {
    let count = 0;

    grid.forEach((rowCells) => {
        rowCells.forEach((cell) => count += (cell === ALIVE ? 1 : 0));
    });

    return count;
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

function getNextGen(grid: BoardGrid): BoardGrid {
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

    return newGrid;
}

export function createBoard(rows: number, cols: number): BoardStore {
    const gridWritable = writable(getEmptyGrid(rows, cols));
    const { subscribe, set, update } = gridWritable;

    const aliveCount = derived(gridWritable, (grid) => countAlive(grid));

    const stepsCount = writable(0);
    const { update: updateSteps, set: setSteps } = stepsCount;

    const rowsCount = () => rows;
    const colsCount = () => cols;

    const toggle = (row: number, column: number) => update((grid) => {
        grid[row][column] = !grid[row][column];
        return grid;
    });

    const reset = () => {
        set(getEmptyGrid(rows, cols));
        setSteps(0);
    };

    const nextGen = () => {
        update((grid) => getNextGen(grid));
        updateSteps((steps) => steps + 1);
    }

    const randomSeed = () => {
        set(getRandomSeedGrid(rows, cols));
        setSteps(0);
    };

    const importFrom = (importData: string) => {
        set(getImportedGrid(rows, cols, importData));
        setSteps(0);
    };

    return {
        subscribe,
        toggle,
        reset,
        randomSeed,
        nextGen,
        rowsCount,
        colsCount,
        aliveCount,
        stepsCount: derived(stepsCount, (steps) => steps),
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