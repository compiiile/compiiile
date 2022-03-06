<template>
	<div>
		<div v-html="content" />
	</div>
</template>

<script>
	export default {
		name: "Content",
		computed: {
			content(){
				return this.$context.pages.find(file => file.meta.uuid === this.$route.meta.uuid)?.htmlContent
			}
		},
		mounted(){
			console.log(this.$route)
		}
	}
</script>

<style scoped>

</style>
