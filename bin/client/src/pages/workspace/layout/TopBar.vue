<template>
	<div class="top-bar no-print">
		<div class="centered-layout">
			<div class="top-bar-content">
				<hamburger-button/>
				<router-link to="/" class="home-link">
					<img src="/favicon.png" :width="30" :height="30" class="logo" v-if="isLogoDefined"/>
					<h1 class="title">{{ title }}</h1>
				</router-link>
				<search-bar/>
			</div>
		</div>
	</div>
</template>

<script>
	import SearchBar from "../../../components/searchBar/SearchBar.vue"
	import HamburgerButton from "./HamburgerButton.vue"

	export default {
		name: "TopBar",
		components: {HamburgerButton, SearchBar},
		computed: {
			title() {
				return import.meta.env.VITE_COMPIIILE_TITLE
			},
			isLogoDefined(){
				return import.meta.env.VITE_COMPIIILE_LOGO !== 'null'
			}
		}
	}
</script>

<style scoped>

	.top-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		border-bottom: solid 1px var(--separator-color);
		background-color: var(--layout-background-color);
		z-index: 3;
	}

	.top-bar-content {
		padding: 20px var(--layout-padding);
		height: var(--top-bar-height);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.home-link {
		color: var(--text-color-base) !important;
		text-decoration: none;
		display: flex;
		align-items: center;
	}

	.title {
		margin: 0;
		font-size: 1.5rem;
		max-width: 100%;
		display: inline-block;
		-webkit-box-orient: vertical;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: normal;
	}

	.logo {
		margin-right: 10px;
		border-radius: 2px;
	}

</style>
