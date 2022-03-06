<template>
    <ul class="files-tree text-xs">
        <nav-list-item v-for="navItem in $context.filesTree"
                       :key="navItem.path"
                       :item="navItem" />
    </ul>
</template>

<script>
    import NavListItem from "./NavListItem.vue";

    export default {
        name: "FilesTree",
        components: {NavListItem}
    }
</script>

<style scoped>

    .files-tree {
        list-style-type: none;
    }

    .files-tree {
        padding-left: 0;
    }

</style>
