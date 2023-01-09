<template>
	<div class="page">
		<top-bar/>

		<nav-bar/>

		<div class="centered-layout">
			<div class="content-wrapper">
				<router-view #default="{ Component }">
					<component :is="Component" :key="$route.name"/>
				</router-view>

				<p v-if="$route.name === notFoundRoute" class="text-center not-found">404</p>
			</div>
		</div>
	</div>
</template>

<script>
	import NavBar from "./layout/navBar/NavBar.vue"
	import TopBar from "./layout/TopBar.vue"
	import {NOT_FOUND} from "../../router/index.js"

	export default {
		name: "WorkspacePage",
		components: {TopBar, NavBar},
		computed: {
			notFoundRoute() {
				return NOT_FOUND
			}
		}
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

	.not-found {
		font-weight: bold;
		font-family: var(--monospace);
		font-size: 4rem;
		margin-top: 60px;
	}

	@media screen and (min-width: 1100px) {
		.centered-layout {
			max-width: var(--content-max-width);
			margin: var(--top-bar-height) auto 0;
		}
	}

</style>
