<template>
	<ul class="toc text-xs">
		<li v-for="tocItem in tableOfContent" :style="{ marginLeft: `${ 20 * tocItem.level }px`}"
		    class="toc-item">
			<router-link :to="`#${ tocItem.slug }`"
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
		mounted(){
			const tocItems = [...document.querySelectorAll(".toc a")];
			const anchors = [...document.querySelectorAll(".header-anchor")];

			window.addEventListener("scroll", () => {
				const scrollTop = document.documentElement.scrollTop || document.body.scrollTop

				// Iterate backwards, on the first match highlight it and break
				for (let i = tocItems.length - 1; i >= 0; i--){
					if (scrollTop > anchors[i].offsetTop) {
						this.$router.replace({ hash: anchors[i].attributes.href.value, params: {withScroll: false} })
						break;
					}
				}
			})
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
		padding-left: 15px;
		color: var(--dimmed-text-color);
		list-style-type: none;
		border-left: solid 1px var(--separator-color);
	}

	.toc-link:before {
		content: '';
		height: 20px;
		position: absolute;
		left: -1px;
		margin-top: 2px;
		border-left: solid 1px var(--separator-color);
	}

	.toc-link.active:before {
		left: -1.5px;
		border-left: solid 2px var(--highlight-color);
	}

	.toc-link {
		text-decoration: none;
	}

</style>
