<template>
	<div>
		<table-of-content :table-of-content="tableOfContent" class="no-print" />

		<div class="markdown-content">
			<slot></slot>
		</div>

		<div
			v-if="fileSiblings.prev || fileSiblings.next"
			class="siblings no-print"
			:style="{
				justifyContent: !fileSiblings.prev ? 'flex-end' : 'space-between'
			}"
		>
			<a v-if="fileSiblings.prev" class="sibling-link" :href="fileSiblings.prev.routePath">
				<svg
					class="ph-icon"
					xmlns="http://www.w3.org/2000/svg"
					width="192"
					height="192"
					fill="#000000"
					viewBox="0 0 256 256"
				>
					<rect width="256" height="256" fill="none"></rect>
					<line
						x1="216"
						y1="128"
						x2="40"
						y2="128"
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					></line>
					<polyline
						points="112 56 40 128 112 200"
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					></polyline>
				</svg>
				{{ fileSiblings.prev.title }}
			</a>
			<a v-if="fileSiblings.next" class="sibling-link sibling-link--next" :href="fileSiblings.next.routePath">
				{{ fileSiblings.next.title }}
				<svg
					class="ph-icon"
					xmlns="http://www.w3.org/2000/svg"
					width="192"
					height="192"
					fill="#000000"
					viewBox="0 0 256 256"
				>
					<rect width="256" height="256" fill="none"></rect>
					<line
						x1="40"
						y1="128"
						x2="216"
						y2="128"
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					></line>
					<polyline
						points="144 56 216 128 144 200"
						fill="none"
						stroke="#000000"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					></polyline>
				</svg>
			</a>
		</div>
	</div>
</template>

<script>
	import TableOfContent from "./TableOfContent.vue"

	export default {
		name: "ContentWrapper",
		components: { TableOfContent },
		props: {
			name: {
				type: String,
				required: true
			},
			tableOfContent: {
				type: Array,
				required: true
			}
		},
		computed: {
			fileIndex() {
				return this.$context.fileList.findIndex((file) => file.uuid === this.name)
			},
			file() {
				return this.fileIndex > -1 ? this.$context.fileList[this.fileIndex] : null
			},
			fileSiblings() {
				return {
					prev: this.$context.fileList[this.fileIndex - 1] ?? null,
					next: this.$context.fileList[this.fileIndex + 1] ?? null
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	:deep(.markdown-content) {
		margin-right: calc(var(--toc-width) + 80px);

		h1,
		h2,
		h3,
		h4,
		h5 {
			&:before {
				/* hack to offset scroll on route hash navigation */
				padding-top: calc(var(--top-bar-height) - 1px);
				margin-top: calc((var(--top-bar-height) - 1px) * -1);
				content: " ";
				display: block;
			}
		}

		h2,
		h3,
		h4,
		h5,
		h6 {
			margin: 20px 0 10px;
		}

		h2 {
			margin-top: 40px;
		}

		p code,
		li code,
		table code {
			padding: 2px 4px;
			border-radius: 3px;
			background-color: var(--code-background-color);
			border: solid 1px var(--code-background-color); /* same color, useful when printing without background graphics */
			color: var(--code-color);
			font-family: var(--monospace);
			font-size: 0.85rem;
		}

		p,
		ul {
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
			color: var(--blockquote-color);
			margin: 20px 0;

			p {
				margin-bottom: 0;
			}

			code {
				background-color: rgb(169 156 231 / 22%);
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
            display: block;
            max-width: 100%;
            overflow-x: scroll;
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

		table tr th :first-child,
		table tr td :first-child {
			margin-top: 0;
		}

		table tr th :last-child,
		table tr td :last-child {
			margin-bottom: 0;
		}

		pre code {
			margin-bottom: 1rem;
		}

		pre.astro-code {
			margin-bottom: 20px;
			font-size: 0.85rem;
		}

		.header-anchor {
			float: left;
			margin-left: -0.87em;
			padding-right: 0.23em;
			font-weight: 500;
			opacity: 0;
			transition: opacity 0.25s;
			text-decoration: none;
		}

		h1:hover .header-anchor,
		h2:hover .header-anchor,
		h3:hover .header-anchor,
		h4:hover .header-anchor,
		h5:hover .header-anchor,
		h6:hover .header-anchor,
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
			border-radius: 2px;

			&:focus-visible {
				outline: solid 1px var(--separator-color);
			}
		}

		.sibling-link--next {
			text-align: right;
			margin-left: auto;
		}
	}
</style>
