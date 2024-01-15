<script>
	import Game from '../components/Game.svelte';
</script>

<main>
	<Game rows={200} cols={400} />
</main>

<style>
	main {
		display: flex;
		flex-wrap: wrap;
		padding: 2em;
	}
</style>
