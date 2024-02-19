<template>
	<button class="theme-switcher" @click="toggleTheme">
		<!-- sun-dim -->
		<svg
			class="theme-icon theme-icon--light"
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 256 256"
		>
			<path
				d="M120,40V32a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-8-8A8,8,0,0,0,50.34,61.66Zm0,116.68-8,8a8,8,0,0,0,11.32,11.32l8-8a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l8-8a8,8,0,0,0-11.32-11.32l-8,8A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l8,8a8,8,0,0,0,11.32-11.32ZM40,120H32a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Zm88,88a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-8A8,8,0,0,0,128,208Zm96-88h-8a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Z"
			></path>
		</svg>
		<!-- moon -->
		<svg
			class="theme-icon theme-icon--dark"
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 256 256"
		>
			<path
				d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"
			></path>
		</svg>
	</button>
</template>

<script>
	const THEME_DARK = "dark"
	const THEME_LIGHT = "light"
	export default {
		name: "ThemeSwitcher",
		methods: {
			toggleTheme() {
				const isLight = document.documentElement.classList.contains(`theme--${THEME_LIGHT}`)

				if (isLight) {
					document.documentElement.classList.remove(`theme--${THEME_LIGHT}`)
					document.documentElement.classList.add(`theme--${THEME_DARK}`)
					localStorage.setItem("COMPIIILE_THEME", THEME_DARK)
				} else {
					document.documentElement.classList.remove(`theme--${THEME_DARK}`)
					document.documentElement.classList.add(`theme--${THEME_LIGHT}`)
					localStorage.setItem("COMPIIILE_THEME", THEME_LIGHT)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.theme-switcher {
		position: relative;
		margin-left: 6px;
		padding: 16px;
		appearance: none;
		outline: none;
		border: none;
		cursor: pointer;
		background-color: var(--layout-background-color);
		z-index: 0;
		border-radius: 2px;

		&:focus-visible {
			outline: solid 1px var(--separator-color);
		}
	}

	.theme-icon {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		fill: var(--dimmed-text-color);
		will-change: opacity, transform;
		transform-origin: center;
		transition:
			0.2s opacity,
			0.2s transform var(--ease-in-out-quart);
	}

	:global(html.theme--light .theme-icon--light),
	:global(html.theme--dark .theme-icon--dark) {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}

	:global(html.theme--light .theme-icon--dark),
	:global(html.theme--dark .theme-icon--light) {
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.8);
	}
</style>
