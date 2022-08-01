<template>
	<a class="fake-input" @click="openSearchModal" href="#">
		<svg class="search-icon search-icon--fake-input" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><circle cx="116" cy="116" r="84" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><line x1="175.39356" y1="175.40039" x2="223.99414" y2="224.00098" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>
		<span class="search-shortcut">{{ searchShortcut }}</span>
	</a>

	<div class="search-bar-wrapper" v-if="searchModalOpened">
		<div class="search-overlay" @click="searchModalOpened = false"></div>

		<div class="search-bar">
			<div class="search-input-wrapper">
				<label for="search-input">
					<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><circle cx="116" cy="116" r="84" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><line x1="175.39356" y1="175.40039" x2="223.99414" y2="224.00098" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>
				</label>
				<input @input="search"
				       v-model="searchValue"
				       class="search-input"
				       id="search-input"
				       @keyup.down="focusFirstSearchResult"
				       @keyup.up="focusLastSearchResult"
				       @keyup.esc="searchModalOpened = false"/>
			</div>

			<ul class="search-results"><!--  v-if="searchResults.length > 0 && displaySearchResults" -->
				<search-result v-for="searchResult in searchResults"
				               :searchResult="searchResult"
				               @onSearchResultClick="onSearchResultSelected"
				               @keyup.down.prevent="onSearchResultDownKeyPress"
				               @keyup.up.prevent="onSearchResultUpKeyPress"
				               @keyup.enter="onSearchResultSelected"/>
			</ul>
		</div>
	</div>
</template>

<script>
	import SearchResult from "./SearchResult.vue";

	const RESULT_PREVIEW_CHARACTER_OFFSET = 120;

	export default {
		name: "SearchBar",
		components: {SearchResult},
		data() {
			return {
				searchValue: "",
				searchResults: [],
				searchModalOpened: false,
			}
		},
		computed: {
			searchShortcut(){
				const isSmallScreen = window.innerWidth <= 800  && window.innerHeight <= 600

				if(isSmallScreen){
					return ""
				}

				const isMac = navigator.platform.toUpperCase().includes('MAC');

				const modifier =  isMac ? 'Cmd' : 'Ctrl'
				return `${ modifier } + k`
			}
		},
		methods: {
			search() {
				if (this.searchValue.length > 0) {
					const results = this.$context.searchIndex.search(`${this.searchValue}`)

					this.searchResults = results.map(result => {
						const path = result.ref
						const file = this.$site.documentsToIndexForSearch.find(document => document.htmlPath === path);
						let {title, rawContent} = file;

						let contentMatches = [];

						const matches = result.matchData.metadata;

						Object.keys(matches).forEach(match => {
							if (matches[match].rawContent) {
								matches[match].rawContent.position.forEach(position => {
									const matchEndIndex = position[0] + position[1];

									let contentSlice = rawContent.slice(
										Math.max(position[0] - RESULT_PREVIEW_CHARACTER_OFFSET, 0),
										position[0]
									)

									contentSlice += `<mark>`;

									contentSlice += rawContent.slice(position[0], matchEndIndex);

									contentSlice += `</mark>`;

									contentSlice += rawContent.slice(
										matchEndIndex,
										Math.min(rawContent.length, matchEndIndex + RESULT_PREVIEW_CHARACTER_OFFSET)
									)

									contentMatches.push(contentSlice);
								})
							}
						})

						return {
							title,
							htmlPath: file.htmlPath,
							filePath: file.filePath,
							contentMatches
						}
					})
				} else {
					this.searchResults = []
				}
			},
			onSearchResultSelected() {
				this.searchModalOpened = false
			},
			async openSearchModal() {
				this.searchValue = ""
				this.searchResults = []

				this.searchModalOpened = true

				await this.$nextTick()

				const searchInput = document.querySelector("#search-input");
				searchInput.focus();
			},
			focusFirstSearchResult() {
				const firstSearchResult = document.querySelector(".search-results .search-result")
				firstSearchResult.focus()
			},
			focusLastSearchResult() {
				const lastSearchResult = document.querySelector(".search-results .search-result:last-child")
				lastSearchResult.focus()
			},
			onSearchResultDownKeyPress(e) {
				let nextSearchResult = e.target.nextElementSibling;
				if (nextSearchResult) {
					nextSearchResult.focus()
				} else {
					this.focusFirstSearchResult()
				}
			},
			onSearchResultUpKeyPress(e) {
				let nextSearchResult = e.target.previousElementSibling
				if (nextSearchResult) {
					nextSearchResult.focus()
				} else {
					this.focusLastSearchResult()
				}
			}
		},
		mounted(){
			console.log(this.$context.searchIndex)

			this.$context.searchIndex.search("purpose")

			document.onkeydown = (e) => {
				const key = e.which || e.keyCode

				if ((e.ctrlKey || e.metaKey) && key === 75) {
					this.openSearchModal()
				}
			};
		}
	}
</script>

<style scoped lang="scss">

	.search-bar-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.search-overlay {
		background-color: rgba(0, 0, 0, 0.3);
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
	}

	.search-bar {
		position: relative;
		width: min(80%, 600px);
		padding: 10px ;
		background-color: var(--search-background);
		border-radius: 4px;

		--shadow-color: 255deg 11% 7%;
		box-shadow: 0px 0.2px 0.3px hsl(var(--shadow-color) / 0.05),
		0px 8.3px 11.9px -0.2px hsl(var(--shadow-color) / 0.22),
		0px 27.5px 39.4px -0.4px hsl(var(--shadow-color) / 0.38);
	}

	.search-input-wrapper {
		position: relative;
	}

	.fake-input {
		width: 100px;
		box-sizing: border-box;
		height: 100%;
		border: solid 1px var(--search-input-border-color);
		border-radius: var(--search-results-border-radius);
		background-color: var(--search-bar-background);
		cursor: pointer;
	}

	.search-icon {
		position: absolute;
		top:0;
		left: 10px;
		height: 100%;
		width: 25px;
		stroke: hsl(210deg, 11%, 46%);

		&.search-icon--fake-input {
			width: 18px;
			left: 30px;
		}
	}

	.search-input {
		width: 100%;
		box-sizing: border-box;
		height: var(--search-input-height);
		border: solid 1px var(--search-input-border-color);
		border-radius: var(--search-results-border-radius);
		background-color: var(--search-bar-background);
		padding: 3px 6px 3px 50px;
		font-size: var(--text-md);
		display: block;
	}

	.search-results {
		padding: 0;
		margin: 10px 0 0;
		list-style-type: none;
		box-sizing: border-box;
		height: min(60vh, 500px);
		overflow: auto;
	}

	.search-shortcut {
		color: hsl(210deg, 11%, 46%);
		font-size: var(--text-sm);
		margin-left: 30px;
	}

</style>
