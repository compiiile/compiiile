<template>
	<ul class="toc text-xs">
		<div ref="cursor" class="cursor"></div>
		<li
			v-for="tocItem in tableOfContent"
			:key="tocItem.slug"
			:style="{ marginLeft: `${20 * (tocItem.depth - 1)}px` }"
			class="toc-item"
		>
			<a :href="`#${tocItem.slug}`" class="toc-link">{{ tocItem.text.substring(1) }}</a>
		</li>
	</ul>
</template>

<script>
	export default {
		name: "TableOfContent",
		props: {
			tableOfContent: {
				type: Array,
				required: true
			}
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
		transition:
			height 0.2s var(--ease-in-out-quart),
			transform 0.2s linear;
	}

	.toc-link {
		text-decoration: none;
		transition: color 0.2s linear;

		&.active {
			color: var(--text-color-base);
		}
	}
</style>
