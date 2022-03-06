<template>
	<div>
		<div v-html="content"/>
	</div>
</template>

<script>
	export default {
		name: "Content",
		computed: {
			content() {
				return this.$context.fileList.find(file => file.uuid === this.$route.name)?.htmlContent
			}
		}
	}
</script>

<style scoped>

</style>
