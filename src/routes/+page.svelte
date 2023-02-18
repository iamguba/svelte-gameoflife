<script>
    import Game from "../components/Game.svelte";
</script>

<style>
    main {
        display: flex;
        flex-wrap: wrap;
        padding: 2em;
    }
</style>

<main>
    <Game rows={70} cols={140}/>
</main>