<template>
	<div class="page">
		<nav-bar />

		<router-view />
	</div>
</template>

<script>
	import NavBar from "./NavBar.vue";

	export default {
		name: "WorkspacePage",
		components: {NavBar}
	}
</script>

<style scoped>

</style>
