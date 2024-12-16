<template><div></div></template>

<script>
	export default {
		name: "ClientScript",
		beforeRouteUpdate() {
			window.removeEventListener("scroll", this.onScroll)
		},
		mounted() {
			window.addEventListener("scroll", this.onScroll)

			if (import.meta.env.MODE === "development") {
				console.group("Compiiile context")
				console.log(this.$context)
				console.groupEnd()
			}

			const activeLink = document.querySelector(".nav-list-item .link-active")
			const nav = document.querySelector("body > .page > nav")

			const activeLinkTop = activeLink?.getBoundingClientRect()?.y
			if (activeLink && nav && activeLinkTop > window.innerHeight) {
				nav.scrollTop = activeLinkTop - window.innerHeight + nav.offsetTop
			}
		},
		methods: {
			async onScroll() {
				const tocItems = [...document.querySelectorAll(".toc a")]
				const anchors = [...document.querySelectorAll(".header-anchor")]

				const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
				const cursor = document.querySelector(".cursor")

				// Iterate backwards, on the first match highlight it and break
				for (let i = tocItems.length - 1; i >= 0; i--) {
					if (scrollTop > anchors[i].offsetTop) {
						for (let j = 0; j < tocItems.length; j++) {
							tocItems[j].classList.remove("active")
						}

						const activeTocItem = tocItems[i]
						activeTocItem.classList.add("active")
						if (activeTocItem && cursor) {
							const activeTocItemBounds = activeTocItem.getBoundingClientRect()

							const tocWrapperTop = document.querySelector(".toc")?.getBoundingClientRect()?.top
							cursor.style.height = `${activeTocItemBounds.height}px`
							cursor.style.transform = `translateY(${activeTocItemBounds.top - tocWrapperTop}px)`
						}
						break
					}
				}
			}
		}
	}
</script>
