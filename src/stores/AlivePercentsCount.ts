import type { BoardStore } from './Board';
import type { AliveCountStore } from './AliveCount';
import { derived, type Readable } from 'svelte/store';

export type AlivePercentsCountStore = Readable<number>;

export function createAlivePercentsCount(
    board: BoardStore,
    aliveCount: AliveCountStore
): AlivePercentsCountStore {
    let initialAliveCount = 0;

    const alivePercentsCountStore = derived([board, aliveCount], ([$board, $aliveCount]) => {
        if ($board.steps === 0) {
            initialAliveCount = $aliveCount;
            return ($aliveCount > 0) ? 100 : 0;
        }

        return Math.round($aliveCount / initialAliveCount * 100);
    });

    return alivePercentsCountStore;
}