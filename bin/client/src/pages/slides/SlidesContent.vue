<template>
	<div class="reveal deck">
		<div class="slides">
			<section v-for="slide in slides" v-html="slide"></section>
		</div>
	</div>
</template>

<script>

	export default {
		name: "SlidesContent",
		computed: {
			slides(){
				return this.$context.fileList.find(file => file.uuid === this.$route.name).htmlContent.split("\n<hr />\n")
			}
		},
		async mounted() {
			const Reveal = (await import("reveal.js")).default(document.querySelector('.deck'), {
				embedded: true
			});

			await Reveal.initialize({
				slideNumber: 'c/t',
			});

			Reveal.slide(this.$route.query.slide || 0);

			Reveal.on('slidechanged', event => {
				this.$router.replace({query: {...this.$route.query, slide: event.indexh}})
			});

			document.querySelectorAll('img').forEach(async image => {
				console.log(image.attributes.src.value)
				console.log(import.meta.url)
				//const imageUrl = new URL(image.attributes.src.value, import.meta.url).href
				//const imageUrl = new URL("../../../../../" + image.attributes.src.value, import.meta.url).href

				const ah = (await import("../../../../../jazzercise.gif")).default

				console.log(ah)
				image.src = ah
			})
		}
	}
</script>

<style lang="scss">

	@import "reveal.js/dist/reveal.css";
	@import "reveal.js/dist/theme/black.css";
	@import "../../assets/style/slides.scss";

	:global(#app) {
		height: 100%;
	}

</style>
