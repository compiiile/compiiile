<template>
    <nav class="no-print">
        <files-tree />
    </nav>
</template>

<script>
    import FilesTree from "./FilesTree.vue";

    export default {
        name: "NavBar",
        components: {FilesTree},
    }
</script>

<style scoped>

    nav {
        width: var(--nav-bar-width);
        background-color: var(--darker-background-color);
        padding: 30px 8px 30px 30px;
        flex: 0 0 auto;
        position: fixed;
        top: calc(var(--top-bar-height) + 1px);
        left:0;
        height: 100vh;
    }

</style>
