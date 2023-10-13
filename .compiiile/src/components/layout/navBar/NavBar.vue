<template>
	<nav class="no-print">
		<files-tree :current-path="currentPath" />
	</nav>
</template>

<script>
	import FilesTree from "./FilesTree.vue"

	export default {
		name: "NavBar",
		components: { FilesTree },
		props: {
			currentPath: {
				type: String,
				required: true
			}
		}
	}
</script>

<style scoped lang="scss">
	nav {
		width: var(--nav-bar-width);
		background-color: var(--darker-background-color);
		padding: 30px 8px 30px var(--layout-padding);
		flex: 0 0 auto;
		position: fixed;
		top: calc(var(--top-bar-height) + 1px);
		left: 0;
		height: calc(100vh - var(--top-bar-height) + 1px);
		overflow: auto;
		z-index: 1;
		transition:
			width 0.3s var(--ease-in-out-quart),
			transform 0.1s ease;

		@media screen and (max-width: 900px) {
			width: 0;
			transform: translateX(-100%);

			&.navbar--opened {
				width: 100vw;
				transform: translateX(0);
			}
		}
	}
</style>
