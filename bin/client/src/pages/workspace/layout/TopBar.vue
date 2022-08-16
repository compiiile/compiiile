<template>
	<div class="top-bar no-print">
		<div class="centered-layout">
			<div class="top-bar-content">
				<div></div>
				<search-bar />
			</div>
		</div>
	</div>
</template>

<script>
	import SearchBar from "../../../components/searchBar/SearchBar.vue";

	export default {
		name: "TopBar",
		components: {SearchBar}
	}
</script>

<style scoped>

	.top-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		border-bottom: solid 1px var(--separator-color);
		background-color: var(--layout-background-color);
		z-index: 1;
	}

	.top-bar-content {
		padding: 20px var(--content-padding);
		height: var(--top-bar-height);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		width: 120px;
		flex: 0 0 auto;
	}

</style>
