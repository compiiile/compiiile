<template>
	<ul class="toc">
		<li v-for="tocItem in tableOfContent" :style="{ marginLeft: `${ 20 * tocItem.level }px`}">
			<router-link :to="`#${ tocItem.slug }`">{{ tocItem.title }}</router-link>
		</li>
	</ul>
</template>

<script>
	export default {
		name: "TableOfContent",
		props: {
			tableOfContent: Array
		}
	}
</script>

<style scoped>

	.toc {
		width: var(--toc-width);
		position: sticky;
		right: 0;
		top: 100px;
		float: right;
		padding-left: 80px;
	}

</style>
