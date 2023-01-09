<template>
	<div>
		<table-of-content :tableOfContent="file?.toc" class="no-print"/>

		<div v-html="file?.htmlContent" class="markdown-content"/>

		<div class="siblings no-print"
		     v-if="fileSiblings.prev || fileSiblings.next"
		     :style="{ justifyContent: !fileSiblings.prev ? 'flex-end' : 'space-between'}">
			<router-link class="sibling-link"
			             v-if="fileSiblings.prev"
			             :to="{ name: fileSiblings.prev.uuid }">
				<ph-arrow-left/>
				{{ fileSiblings.prev.title }}
			</router-link>
			<router-link class="sibling-link sibling-link--next"
			             v-if="fileSiblings.next"
			             :to="{ name: fileSiblings.next.uuid }">
				{{ fileSiblings.next.title }}
				<ph-arrow-right/>
			</router-link>
		</div>
	</div>
</template>

<script>

	import TableOfContent from "./TableOfContent.vue"
	import {PhArrowLeft, PhArrowRight} from "phosphor-vue"
	import {useHead} from "@vueuse/head"
	import {useRoute} from "vue-router"

	export default {
		name: "Content",
		components: {TableOfContent, PhArrowLeft, PhArrowRight},
		setup(){
			const titleTemplate = import.meta.env.VITE_COMPIIILE_TITLE ? ` | ${ import.meta.env.VITE_COMPIIILE_TITLE }` : ''
			const description = useRoute().meta.description || import.meta.env.VITE_COMPIIILE_DESCRIPTION

			const title = useRoute().meta.title

			useHead({
				title,
				titleTemplate: `%s${ titleTemplate }`,
				meta: [
					{ name: 'og:title', content: title + titleTemplate },
					{ name: 'description', content: description },
					{ name: 'og:description', content: description },
					{ name: 'og:image', content: `${window.location.host}/favicon.png` },
				],
			})
		},
		computed: {
			fileIndex() {
				return this.$context.fileList.findIndex(file => file.uuid === this.$route.name)
			},
			file() {
				return this.fileIndex > -1 ?
					this.$context.fileList[this.fileIndex]
					: null
			},
			fileSiblings() {
				return {
					prev: this.$context.fileList[this.fileIndex - 1] ?? null,
					next: this.$context.fileList[this.fileIndex + 1] ?? null
				}
			}
		},
		mounted() {
			// use anchors as vue-router and not as simple `a` tags
			document.querySelectorAll('.header-anchor').forEach(a => {
				a.addEventListener('click', (e) => {
					e.preventDefault()
					this.$router.push({hash: a.attributes.href.value})
				})
			})
		}
	}
</script>

<style scoped lang="scss">

	:deep(.markdown-content) {
		margin-right: calc(var(--toc-width) + 80px);

		h2, h3, h4 {
			margin: 10px 0;
		}

		h2 {
			margin-top: 40px;
		}

		p code, li code {
			padding: 2px 4px;
			border-radius: 3px;
			background-color: var(--code-background-color);
			border: solid 1px var(--code-background-color); /* same color, useful when printing without background graphics */
			color: var(--code-color);
			font-family: var(--monospace);
			font-size: 0.85rem;
		}

		p, ul {
			line-height: 1.618rem;
			margin-bottom: 1rem;
		}

		ul {
			padding-left: 40px;
		}

		hr {
			margin: 40px 0;
			background-color: var(--separator-color);
			height: 1px;
			border: 0;
		}

		blockquote {
			background-color: var(--blockquote-background-color);
			border: solid 1px var(--blockquote-border-color);
			border-radius: 8px;
			padding: 0.5em 1em;
			color: #babfc4;
			margin: 20px 0;

			p {
				margin-bottom: 0;
			}
		}

		img {
			max-width: 100%;
			margin: 0 auto;
			display: block;
			object-fit: contain;
		}

		a {
			color: var(--link-color);
		}

		table {
			padding: 0;
			border-collapse: collapse;
			margin-bottom: 20px;
		}

		table tr {
			border-top: 1px solid var(--table-border-color);
			background-color: var(--table-odd-lines-background-color);
			margin: 0;
			padding: 0;
		}

		table tr:nth-child(2n) {
			background-color: var(--table-even-lines-background-color);
		}

		table tr th {
			font-weight: bold;
			border: 1px solid var(--table-border-color);
			text-align: left;
			margin: 0;
			padding: 6px 13px;
		}

		table tr td {
			border: 1px solid var(--table-border-color);
			text-align: left;
			margin: 0;
			padding: 6px 13px;
		}

		table tr th :first-child, table tr td :first-child {
			margin-top: 0;
		}

		table tr th :last-child, table tr td :last-child {
			margin-bottom: 0;
		}

		pre code {
			margin-bottom: 1rem;
		}

		pre.hljs {
			margin-bottom: 20px;
			font-size: 0.85rem;
		}

		.header-anchor {
			float: left;
			margin-left: -0.87em;
			padding-right: 0.23em;
			font-weight: 500;
			opacity: 0;
			transition: opacity .25s;
			text-decoration: none;
		}

		h1:hover .header-anchor,
		h2:hover .header-anchor,
		h3:hover .header-anchor,
		h4:hover .header-anchor,
		.header-anchor:focus {
			opacity: 1;
		}
	}

	.siblings {
		display: flex;
		margin-right: calc(var(--toc-width) + 80px);
		color: var(--link-color);
		margin-top: 80px;
		gap: 20px;
		flex-wrap: wrap;

		.sibling-link {
			text-decoration: none;
		}

		.sibling-link--next {
			text-align: right;
			margin-left: auto;
		}
	}

</style>
