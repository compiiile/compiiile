<template>
	<button class="fake-input" @click="openSearchModal">
		<svg class="ph-icon search-icon" xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="116" cy="116" r="84" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><line x1="175.4" y1="175.4" x2="224" y2="224" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>
		<span class="search-shortcut">
			<svg class="command-icon ph-icon" xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M180,48h0a28,28,0,0,1,28,28v0a28,28,0,0,1-28,28H152a0,0,0,0,1,0,0V76a28,28,0,0,1,28-28Z" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><path d="M48,48H76a28,28,0,0,1,28,28v0a28,28,0,0,1-28,28h0A28,28,0,0,1,48,76V48A0,0,0,0,1,48,48Z" transform="translate(152 152) rotate(180)" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><path d="M152,152h28a28,28,0,0,1,28,28v0a28,28,0,0,1-28,28h0a28,28,0,0,1-28-28V152A0,0,0,0,1,152,152Z" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><path d="M76,152h0a28,28,0,0,1,28,28v0a28,28,0,0,1-28,28H48a0,0,0,0,1,0,0V180A28,28,0,0,1,76,152Z" transform="translate(152 360) rotate(-180)" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><rect x="104" y="104" width="48" height="48" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></rect></svg>k
		</span>
	</button>

	<div class="search-bar-wrapper" v-if="searchModalOpened">
		<div class="search-overlay" @click="searchModalOpened = false"></div>

		<div class="search-bar">
			<div class="search-input-wrapper">
				<label for="search-input" class="search-label">
					<svg class="ph-icon search-icon" xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="116" cy="116" r="84" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><line x1="175.4" y1="175.4" x2="224" y2="224" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>
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
	import SearchResult from "./SearchResult.vue"
	import {searchIndex} from "../../utils/searchIndex"

	const RESULT_PREVIEW_CHARACTER_OFFSET = 120

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
			searchShortcut() {
				const isSmallScreen = window.innerWidth <= 800 && window.innerHeight <= 600

				if (isSmallScreen) {
					return ""
				}

				const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)

				const modifier = isMac ? '⌘' : 'Ctrl'
				return `${modifier} + k`
			}
		},
		methods: {
			search() {
				if (this.searchValue.trim().length > 1) {
					const results = searchIndex.find(this.searchValue.trim())

					const formattedResults = {}

					for (const result of results) {
						const uuid = result.item.uuid

						if (!formattedResults[uuid]) {
							const file = this.$context.fileList.find(file => file.uuid === uuid)
							formattedResults[uuid] = {
								...file,
								contentMatches: []
							}
						}

						let {markdownContent} = formattedResults[uuid]

						const matchEndIndex = result.item.startIndex + result.end

						let contentSlice = markdownContent.slice(
							Math.max(result.item.startIndex + result.start - RESULT_PREVIEW_CHARACTER_OFFSET, 0),
							result.item.startIndex + result.start
						)

						contentSlice += `<mark>`

						contentSlice += markdownContent.slice(result.item.startIndex + result.start, matchEndIndex)

						contentSlice += `</mark>`

						contentSlice += markdownContent.slice(
							matchEndIndex,
							Math.min(markdownContent.length, matchEndIndex + RESULT_PREVIEW_CHARACTER_OFFSET)
						)

						formattedResults[uuid].contentMatches.push(contentSlice)
					}

					this.searchResults = Object.values(formattedResults)
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

				const searchInput = document.querySelector("#search-input")
				searchInput.focus()
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
				let nextSearchResult = e.target.nextElementSibling
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
		mounted() {
			document.onkeydown = (e) => {
				const key = e.which || e.keyCode

				if ((e.ctrlKey || e.metaKey) && key === 75) {
					this.openSearchModal()
				}
			}
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
		width: 100vw;
		height: 100vh;
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
		width: min(95%, 600px);
		padding: 10px;
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
		margin-left: auto;
	}

	.search-icon {
		color: var(--dimmed-text-color);
		width: 18px;
		height: 18px;
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
		border: none;
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
