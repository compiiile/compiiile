<template>
	<div ref="slidesDeckWrapper" :class="['slides-deck-wrapper', `text-align-${textAlign}`]" :style="{ textAlign }">
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: "SlidesContent",
		props: {
			textAlign: {
				type: String,
				default: "center"
			}
		},
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
				embedded: true,
				pdfMaxPagesPerSlide: 1,
				width: "100%",
				height: "100%",
				margin: 0,
				minScale: 1,
				maxScale: 1
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
