<script>
    export let title = '';
    export let disabled = false;
</script>

<style>
    button {
        border: 0;
        color: whitesmoke;
        font-size: 1.6em;
        background-color: black;
        min-width: 8em;
    }
</style>

<button on:click {disabled}>{title}</button>