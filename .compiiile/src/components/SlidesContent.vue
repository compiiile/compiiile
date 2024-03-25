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
				.map((section) => {
					// Handle fragments, `--` processed as `<p>—</p>` in HTML
					const fragments = section.split("<p>—</p>")
					return fragments.length === 1
						? section
						: `<div class="fragment">` + fragments.join(`</div><div class="fragment">`) + "</div>"
				})
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
				maxScale: 1,
				pdfSeparateFragments: false
			})

			await Reveal.initialize({
				slideNumber: "c/t"
			})

			this.$refs.slidesDeckWrapper.style.opacity = 1

			Reveal.on("slidechanged", (event) => {
				history.replaceState({}, "", `?slide=${event.indexh}`)
				Reveal.nextFragment()
			})

			Reveal.on("fragmenthidden", function (event) {
				if (
					event.fragment.hasAttribute("data-fragment-index") &&
					parseInt(event.fragment.dataset.fragmentIndex) === 0
				) {
					Reveal.prev()
				}
			})

			Reveal.slide(new URLSearchParams(window.location.search).get("slide") || 0)
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
