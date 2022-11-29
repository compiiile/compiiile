<template>
	<div class="hamburger"
	     @click="toggleNavBar">
		<span class="hamburger-line"></span>
		<span class="hamburger-line"></span>
		<span class="hamburger-line"></span>
	</div>
</template>

<script>
	export default {
		name: 'HamburgerButton',
		data() {
			return {
				isOpened: false
			}
		},
		methods: {
			toggleNavBar() {
				const navBar = document.querySelector("nav")
				const hamburger = document.querySelector(".hamburger")

				navBar.classList.toggle("navbar--opened")
				hamburger.classList.toggle("hamburger--opened")
			}
		}
	}
</script>

<style lang="scss" scoped>

	.hamburger {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 13px;
		width: 20px;
		cursor: pointer;

		.hamburger-line {
			display: block;
			height: 1px;
			position: relative;
			background-color: var(--dimmed-text-color);
			transition: transform 0.3s cubic-bezier(0.77, 0.2, 0.05, 1.0),
			width 0.3s ease,
			opacity 0.35s ease;

			&:nth-child(1) {
				transform-origin: top left;
				width: 100%
			}

			&:nth-child(2) {
				width: 50%;
			}

			&:nth-child(3) {
				transform-origin: bottom left;
				width: 75%;
			}
		}

		&.hamburger--opened {
			.hamburger-line:nth-child(1),.hamburger-line:nth-child(3) {
				opacity: 1;
				width: 87.5%;
			}

			.hamburger-line:nth-child(1) {
				transform: translateX(4.5px) rotate(45deg);

			}

			.hamburger-line:nth-child(2) {
				opacity: 0;
				transform: scale(0, 1);
			}

			.hamburger-line:nth-child(3) {
				transform: translateX(4.5px) rotate(-45deg);
			}
		}

		@media screen and (min-width: 900px){
			display: none;
		}
	}

</style>
