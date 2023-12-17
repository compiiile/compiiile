<template>
	<div class="top-bar no-print">
		<div class="centered-layout">
			<div class="top-bar-content">
				<hamburger-button />
				<span class="home-link-wrapper">
					<a :href="logoUrl">
						<img
							v-if="isLogoDefined"
							:src="`${base}favicon.png`"
							:width="30"
							:height="30"
							class="logo"
							alt="logo"
						/>
					</a>

					<a :href="base" class="home-link">
						<h1 class="title">{{ title }}</h1>
					</a>
				</span>
				<search-bar />
			</div>
		</div>
	</div>
</template>

<script>
	import SearchBar from "../searchBar/SearchBar.vue"
	import HamburgerButton from "./HamburgerButton.vue"
	import { site } from "virtual:compiiile"

	export default {
		name: "TopBar",
		components: { HamburgerButton, SearchBar },
		computed: {
			title() {
				return site.title
			},
			isLogoDefined() {
				return site.logo !== undefined
			},
			base() {
				let base = import.meta.env.BASE_URL

				if (!base.endsWith("/")) {
					base += "/"
				}

				return base
			},
			logoUrl() {
				return site.logoUrl ?? this.base
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

	.home-link-wrapper {
		display: flex;
		align-items: center;
	}

	.home-link {
		color: var(--text-color-base) !important;
		text-decoration: none;
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
		display: block;
	}
</style>
