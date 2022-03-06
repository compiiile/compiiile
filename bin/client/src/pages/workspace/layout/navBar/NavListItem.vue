<template>
    <li class="nav-list-item">
        <template v-if="item.isFolder">
            <p :to="item.path">{{ item.name }}</p>
            <ul v-if="item.children.length > 0"
                class="nav-list-item-children">
                <nav-list-item v-for="child in item.children"
                               :item="child"
                               :key="child.path"/>
            </ul>
        </template>

        <template v-else>
            <router-link :to="link"
                       class="link">{{ item.name }}</router-link>
        </template>
    </li>
</template>

<script>
    export default {
        name: "NavListItem",
        props: {
            item: {}
        },
        computed : {
            link(){
                const filePathWithoutExtension = this.item.path.slice(0, this.item.path.lastIndexOf("."));
                return `/${ this.$route.params.displayName }/${ this.$route.params.workspace }/${ filePathWithoutExtension }`;
            }
        }
    }
</script>

<style scoped>

    .nav-list-item-children {
        list-style-type: none;
        padding-left: 15px;
    }

    .nav-list-item {
        padding: 5px 0;
        color: var(--nav-list-item-color);
    }

    .link {
        text-decoration: none;
        color: inherit;
    }

    .nuxt-link-exact-active {
        font-weight: bold;
        color: var(--text-color-base);
    }

</style>
