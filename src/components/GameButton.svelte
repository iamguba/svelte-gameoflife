<script>
    export let title = '';
    export let disabled = false;
</script>

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
        color: #8f8f8f;
    }
</style>

<button on:click {disabled}>{title}</button>