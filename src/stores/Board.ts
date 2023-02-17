import { writable, type Writable } from 'svelte/store';

type BoardGrid = Array<Array<boolean>>;

export type BoardStore = {
    subscribe: Writable<BoardGrid>['subscribe'],
    rowsCount: () => number,
    colsCount: () => number,
    toggle: (row: number, column: number) => void,
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
            column[index] = Math.round(Math.random()) ? ALIVE : DEAD;
        });

        return column;
    });
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
        .filter((isAlive) => isAlive)
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
    const { subscribe, set, update } = writable(getEmptyGrid(rows, cols));

    const rowsCount = () => rows;
    const colsCount = () => cols;

    const toggle = (row: number, column: number) => update((grid) => {
        grid[row][column] = !grid[row][column];
        return grid;
    });

    const reset = () => set(getEmptyGrid(rows, cols));

    const nextGen = () => update((grid) => getNextGen(grid));

    const randomSeed = () => set(getRandomSeedGrid(rows, cols));

    return { subscribe, toggle, reset, randomSeed, nextGen, rowsCount, colsCount };
}