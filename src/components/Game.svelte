<script>
    import Board from "./Board.svelte";
    import GameButton from "./GameButton.svelte";
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

        interval = setInterval(grid.nextGen, 300);
    }
</script>

<Board {grid}/>

<GameButton title={interval ? 'Pause' : 'Play'} on:click={handlePlayPause}/>
<GameButton title="Next Step" on:click={grid.nextGen}/>
<GameButton title="Reset" on:click={grid.reset}/>
<GameButton title="Random" on:click={grid.randomSeed}/>