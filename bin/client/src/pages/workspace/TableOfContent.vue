<template>
	<ul class="toc text-xs" ref="tocWrapper">
		<div class="cursor" ref="cursor"></div>
		<li v-for="tocItem in tableOfContent" :style="{ marginLeft: `${ 20 * tocItem.level }px`}"
		    class="toc-item">
			<router-link :to="`#${ encodeSlug(tocItem.slug) }`"
			             class="toc-link"
			             :data-slug="`#${ tocItem.slug }`"
			             :class="{ active: `#${tocItem.slug}` === $route.hash}">{{ tocItem.title }}
			</router-link>
		</li>
	</ul>
</template>

<script>
	export default {
		name: "TableOfContent",
		props: {
			tableOfContent: Array
		},
		methods: {
			encodeSlug(slug){
				return encodeURI(slug)
			},
			async onScroll(){
				const tocItems = [...document.querySelectorAll(".toc a")];
				const anchors = [...document.querySelectorAll(".header-anchor")];

				const scrollTop = document.documentElement.scrollTop || document.body.scrollTop

				// Iterate backwards, on the first match highlight it and break
				for (let i = tocItems.length - 1; i >= 0; i--){
					if (scrollTop > anchors[i].offsetTop) {
						this.$router.replace({ hash: anchors[i].attributes.href.value, params: {withScroll: false} })

						await this.$nextTick()

						const activeTocItem = document.querySelector(".toc-link.active")
						if(activeTocItem && this.$refs.cursor){
							const activeTocItemBounds = activeTocItem.getBoundingClientRect()

							const tocWrapperTop = this.$refs.tocWrapper?.getBoundingClientRect()?.top
							this.$refs.cursor.style.height = `${activeTocItemBounds.height}px`
							this.$refs.cursor.style.transform = `translateY(${ activeTocItemBounds.top - tocWrapperTop }px)`
						}
						break;
					}
				}
			}
		},
		mounted(){
			window.addEventListener("scroll", this.onScroll)
		},
		beforeRouteUpdate(){
			window.removeEventListener("scroll", this.onScroll)
		}
	}
</script>

<style scoped lang="scss">

	.toc {
		width: var(--toc-width);
		position: sticky;
		right: 0;
		top: 100px;
		float: right;
		padding-left: 15px;
		color: var(--dimmed-text-color);
		list-style-type: none;
		border-left: solid 1px var(--separator-color);
		line-height: 1.3rem;
	}

	.toc-item {
		padding: 2px 0;
	}

	.cursor {
		height: 0px;
		position: absolute;
		left: -1px;
		top: 0;
		width: 2px;
		background-color: var(--highlight-color);
		transition: height 0.2s var(--ease-in-out-quart), transform 0.2s linear;
	}

	.toc-link {
		text-decoration: none;
		transition: color 0.2s linear;

		&.active {
			color: var(--text-color-base);
		}
	}

</style>
