<template>
	<div class="page">
		<top-bar />

		<nav-bar />

		<div class="centered-layout">
			<div class="content-wrapper">
				<router-view #default="{ Component }">
					<component :is="Component" :key="$route.name" />
				</router-view>
			</div>
		</div>
	</div>
</template>

<script>
	import NavBar from "./layout/navBar/NavBar.vue";
	import TopBar from "./layout/TopBar.vue";

	export default {
		name: "WorkspacePage",
		components: {TopBar, NavBar}
	}
</script>

<style scoped>

	.content-wrapper {
		margin-left: var(--nav-bar-width);
		padding: var(--content-padding);
		position: relative;
	}

	.centered-layout {
		margin-top: var(--top-bar-height);
	}

	@media screen and (min-width: 1100px) {
		.centered-layout {
			max-width: var(--content-max-width);
			margin: var(--top-bar-height) auto 0;
		}
	}

</style>
