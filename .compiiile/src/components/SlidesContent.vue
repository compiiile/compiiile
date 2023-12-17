<template>
	<div ref="slidesDeckWrapper" class="slides-deck-wrapper">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: "SlidesContent",
		data() {
			return {
				loaded: false
			}
		},
		async mounted() {
			const slidesContent = document.querySelector(".slides-content")
			slidesContent.innerHTML = `<div class="reveal deck"><div class="slides"><section>${slidesContent.innerHTML
				.split("<hr>")
				.join("</section><section>")}</section></div></div>`

			this.loaded = true

			const deck = document.querySelector(".deck")

			const Reveal = (await import("reveal.js")).default(deck, {
				embedded: true
			})

			await Reveal.initialize({
				slideNumber: "c/t"
			})

			this.$refs.slidesDeckWrapper.style.opacity = 1

			Reveal.slide(new URLSearchParams(window.location.search).get("slide") || 0)

			Reveal.on("slidechanged", (event) => {
				history.replaceState({}, "", `?slide=${event.indexh}`)
			})
		}
	}
</script>

<style lang="scss">
	@import "reveal.js/dist/reveal.css";
	@import "reveal.js/dist/theme/black.css";
	@import "../style/slides.scss";

	:global(#app) {
		height: 100%;
	}

	.slides-deck-wrapper {
		opacity: 0;
	}
</style>
