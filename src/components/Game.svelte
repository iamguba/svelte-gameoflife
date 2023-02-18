<script>
    import Board from "./Board.svelte";
    import { createBoard } from '../stores/Board';

    export let rows;
    export let cols;

    const grid = createBoard(rows, cols);

    /**
	 * @type {string | number | NodeJS.Timeout | null | undefined}
	 */
    let interval = null;

    function handlePlayPause() {
        if (interval) {
            clearInterval(interval);
            interval = null;
            return;
        }

        interval = setInterval(grid.nextGen, 30);
    }
</script>

<Board {grid}/>
<button on:click={handlePlayPause}>{interval ? 'Pause' : 'Play'}</button>
<button on:click={grid.nextGen}>Next Step</button>
<button on:click={grid.reset}>Reset</button>
<button on:click={grid.randomSeed}>Random</button>