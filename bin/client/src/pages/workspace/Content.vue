<template>
	<div>
		<div v-html="file?.toc"></div>
		<div v-html="file?.htmlContent" class="markdown-content"/>
	</div>
</template>

<script>
	export default {
		name: "Content",
		computed: {
			fileIndex(){
				return this.$context.fileList.findIndex(file => file.uuid === this.$route.name)
			},
			file(){
				return this.fileIndex > -1 ?
					this.$context.fileList[this.fileIndex]
					: null
			},
			fileSiblings(){
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
		h1 {
			margin-bottom: 15px;
		}

		h2, h3, h4 {
			margin: 10px 0;
		}

		p code, li code {
			padding: 2px;
			border-radius: 3px;
			background-color: var(--code-background-color);
			color: var(--code-color);
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
			padding: 0.5em 1em;
			color: #6a737d;
			margin: 10px 0;
			border-left: .25em solid var(--blockquote-border-color);
			background-color: var(--blockquote-background-color);

			p {
				margin-bottom: 0;
			}
		}

		img {
			max-width: 100%;
			margin: 0 auto;
			display: block;
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
	}

</style>
