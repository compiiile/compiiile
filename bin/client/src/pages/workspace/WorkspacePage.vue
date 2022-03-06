<template>
	<div class="page">
		<top-bar />

		<nav-bar />

		<div class="centered-layout">
			<div class="content-wrapper">
				<router-view #default="{ Component }">
					<transition name="slide-in-bottom" mode="out-in">
						<component :is="Component"/>
					</transition>
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
		margin-right: var(--toc-width);
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
