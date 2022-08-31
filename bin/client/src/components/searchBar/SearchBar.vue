<template>
	<button class="fake-input" @click="openSearchModal">
		<ph-magnifying-glass :size="18" class="search-icon" />
		<span class="search-shortcut"><ph-command class="command-icon" />k</span>
	</button>

	<div class="search-bar-wrapper" v-if="searchModalOpened">
		<div class="search-overlay" @click="searchModalOpened = false"></div>

		<div class="search-bar">
			<div class="search-input-wrapper">
				<label for="search-input" class="search-label">
					<ph-magnifying-glass :size="18" class="search-icon" />
				</label>
				<input @input="search"
				       v-model="searchValue"
				       class="search-input"
				       id="search-input"
				       @keyup.down="focusFirstSearchResult"
				       @keyup.up="focusLastSearchResult"
				       @keyup.esc="searchModalOpened = false"/>
			</div>

			<ul class="search-results">
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
	import { searchIndex } from "../../utils/searchIndex";
	import { PhMagnifyingGlass, PhCommand } from "phosphor-vue"

	export default {
		name: "SearchBar",
		components: {SearchResult, PhMagnifyingGlass, PhCommand},
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
					const results = searchIndex.search(`${this.searchValue}`)

					this.searchResults = results.map(result => {
						const fileUuid = result.ref
						const file = this.$context.fileList.find(file => file.uuid === fileUuid);
						let {markdownContent} = file;

						let contentMatches = [];

						const matches = result.matchData.metadata;

						Object.keys(matches).forEach(match => {
							if (matches[match].markdownContent) {
								matches[match].markdownContent.position.forEach(position => {
									const matchEndIndex = position[0] + position[1];

									let contentSlice = markdownContent.slice(
										Math.max(position[0] - RESULT_PREVIEW_CHARACTER_OFFSET, 0),
										position[0]
									)

									contentSlice += `<mark>`;

									contentSlice += markdownContent.slice(position[0], matchEndIndex);

									contentSlice += `</mark>`;

									contentSlice += markdownContent.slice(
										matchEndIndex,
										Math.min(markdownContent.length, matchEndIndex + RESULT_PREVIEW_CHARACTER_OFFSET)
									)

									contentMatches.push(contentSlice);
								})
							}
						})

						return {
							...file,
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

	.search-label {
		position: absolute;
		left: 10px;
		top: 10px;
	}

	.search-bar {
		position: relative;
		width: min(80%, 600px);
		padding: 10px ;
		background-color: var(--search-background-color);
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
		border: solid 1px var(--search-input-border-color);
		border-radius: 8px;
		background-color: var(--darker-background-color);
		height: 35px;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
	}

	.search-icon {
		color: var(--dimmed-text-color);
	}

	.search-input {
		width: 100%;
		box-sizing: border-box;
		height: 40px;
		border-radius: 8px;
		background-color: var(--darker-background-color);
		padding: 10px 20px 10px 40px;
		font-size: var(--text-md);
		color: var(--text-color-light);
		border:none;
		display: block;
		outline: none;

		&:focus {
			box-shadow: inset 0 0 2px 2px rgb(153 133 254 / 80%);;
		}
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
		color: var(--dimmed-text-color);
		font-size: var(--text-sm);
		display: flex;
		align-items: center;
		border: solid 1px var(--dimmed-text-color);
		border-radius: 4px;
		padding: 0 4px;
	}

	.command-icon {
		margin-right: 3px;
	}

</style>
