<template>
	<ul class="toc text-xs">
		<li v-for="tocItem in tableOfContent" :style="{ marginLeft: `${ 20 * tocItem.level }px`}"
		    class="toc-item">
			<router-link :to="`#${ tocItem.slug }`"
			             :data-slug="tocItem.slug"
			             class="toc-link"
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
			// Track all sections that have an `id` applied
			/*document.querySelectorAll('.markdown-content [id]').forEach((section) => {
				(new IntersectionObserver(entries => {
					entries.forEach(entry => {
						const id = entry.target.getAttribute('id');
						if (entry.intersectionRatio > 0) {
							document.querySelector(`.toc a[data-slug="${id}"]`).classList.add('active');
						} else {
							document.querySelector(`.toc a[data-slug="${id}"]`).classList.remove('active');
						}
					});
				})).observe(section);
			});*/

			/*window.addEventListener("scroll", () => {
				const scrollTop = document.documentElement.scrollTop || document.body.scrollTop

				const tocItems = [...document.querySelectorAll(".toc a")];

				for(const tocItem of tocItems){
					tocItem.classList.remove("active")
				}

				//@TODO start from the end
				//https://stackoverflow.com/questions/65954297/highlighting-item-in-table-of-contents-when-section-is-active-on-page-as-scrolli
				//https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/
				for(const tocItem of tocItems){
					console.log(tocItem.getBoundingClientRect().top)
					if(scrollTop > tocItem.getBoundingClientRect().top - 75){
						tocItem.classList.add("active")
						break;
					}
				}
				/!*!// highlight the last scrolled-to: set everything inactive first
				for (let i = 0; i < th.length; i++){
					$('nav ul li a[href="#' + $(anchors[i]).attr('id') + '"]').removeClass('active');
				}

				// then iterate backwards, on the first match highlight it and break
				for (var i = anchors.length-1; i >= 0; i--){
					if (scrollTop > $(anchors[i]).offset().top - 75) {
						$('nav ul li a[href="#' + $(anchors[i]).attr('id') + '"]').addClass('active');
						break;
					}
				}*!/
			})*/
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
