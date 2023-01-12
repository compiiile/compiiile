<template>
	<router-link :to="{ name: searchResult.uuid }"
	             class="search-result search-result-link"
	             @click.stop.prevent="$emit('onSearchResultClick')">
		<li>
			<div class="search-result-header">
				<h4 class="search-result-title" v-html="searchResult.title"></h4>
				<p class="search-result-file-path text-sm">{{ searchResult.fullPath }}</p>
			</div>

			<p v-for="contentMatch in searchResult.contentMatches"
			   v-html="contentMatch" class="text-xs search-result-match-preview"></p>
		</li>
	</router-link>
</template>

<script>
	export default {
		name: "SearchResult",
		emits: ["onSearchResultClick"],
		props: {
			searchResult: Object
		}
	}
</script>

<style scoped lang="scss">

	.search-result, .search-result-header {
		background-color: var(--search-background-color);

		&:hover, &:focus {
			background-color: var(--search-background-color);

			.search-result-header {
				background-color: var(--search-background-color);
			}
		}

		&:focus {
			box-shadow: inset 0 0 2px 2px rgb(153 133 254 / 80%);
			outline: none;
		}
	}

	.search-result {
		padding: 6px 10px;
		display: block;
		color: inherit;
		white-space: normal;
		border-radius: 4px;
		text-decoration: none;

		+ .search-result {
			margin-top: 10px;
		}

		&:last-child {
			border-bottom-left-radius: 6px;
			border-bottom-right-radius: 6px;
		}
	}

	.search-result-header {
		position: sticky;
		top: -1px;
		padding: 5px 0;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
	}

	.search-result-title {
		margin: 0 0 6px 0;
	}

	.search-result-file-path {
		margin: 0;
		color: var(--text-color-light);
		line-height: 12px;
	}

	.search-result-match-preview {
		background-color: var(--darker-background-color);
		padding: 3px 6px;
		border-radius: 6px;
		margin: 5px 0;
	}

</style>
