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
				let visibleFiles = this.$context.fileList
				if (this.file && !this.file.meta.hidden) {
					visibleFiles = visibleFiles.filter((file) => !file.meta.hidden)
				}
				const newIndex = visibleFiles.findIndex((file) => file.uuid === this.name)

				return {
					prev: visibleFiles[newIndex - 1] ?? null,
					next: visibleFiles[newIndex + 1] ?? null
				}
			}
		}
	}
</script>
