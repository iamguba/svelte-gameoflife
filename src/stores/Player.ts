import type { BoardStore } from './Board';
import { writable, type Writable } from 'svelte/store';

const DEFAULT_INTERVAL_MS = 1000 / 24;

export type PlayerStore = {
	subscribe: Writable<boolean>['subscribe'];
	play: () => void;
	pause: () => void;
	setNewInterval: (i: number) => void;
};

export function createPlayer(
	board: BoardStore,
	intervalMs: number = DEFAULT_INTERVAL_MS
): PlayerStore {
	const { update, subscribe } = writable(false);

	let interval: NodeJS.Timeout;

	const play = () =>
		update((isPlaying) => {
			if (!isPlaying) {
				interval = setInterval(board.nextGen, intervalMs);
			}

			return true;
		});

	const pause = () =>
		update((isPlaying) => {
			if (isPlaying) {
				clearInterval(interval);
			}

			return false;
		});

	const setNewInterval = (newIntervalMs: number) => {
		intervalMs = newIntervalMs;
	};

	return { subscribe, play, pause, setNewInterval };
}
