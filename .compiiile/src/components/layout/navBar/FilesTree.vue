<template>
	<ul class="files-tree text-xs">
		<nav-list-item
			v-for="navItem in $context.filesTree"
			:key="navItem.uuid"
			:item="navItem"
			:current-path="currentPath"
		/>
	</ul>
</template>

<script>
	import NavListItem from "./NavListItem.vue"

	export default {
		name: "FilesTree",
		components: { NavListItem },
		props: {
			currentPath: {
				type: String,
				required: true
			}
		}
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
