<script lang="ts">
	export let title: string;
	export let disabled: boolean = false;
</script>

<button on:click {disabled}>{title}</button>

<style>
	button {
		border: 0;
		color: #cacaca;
		background-color: black;
		font-size: 1.4em;
		min-width: 6em;
		cursor: pointer;
		text-transform: lowercase;
	}

	button:hover {
		color: whitesmoke;
	}

	button:disabled {
		cursor: default;
		color: #595959;
	}
</style>
