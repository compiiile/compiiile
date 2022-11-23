<template>
	<li class="nav-list-item no-wrap">
		<template v-if="item.isDirectory">
			<svg class="directory-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 256 256">
				<path d="M216.9,208H39.4a7.4,7.4,0,0,1-7.4-7.4V80H216a8,8,0,0,1,8,8V200.9A7.1,7.1,0,0,1,216.9,208Z" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
				<path d="M32,80V56a8,8,0,0,1,8-8H92.7a7.9,7.9,0,0,1,5.6,2.3L128,80" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
			</svg>

			<span class="directory-name">{{ item.name }}</span>
			<ul v-if="item.children.length > 0"
			    class="nav-list-item-children">
				<nav-list-item v-for="child in item.children"
				               :item="child"
				               :key="child.uuid"/>
			</ul>
		</template>

		<template v-else>
			<router-link :to="{ name: route.name, hash: '' }"
			             class="link">
				<svg class="file-icon" v-if="!route.meta.asSlides" xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 256 256">
					<path d="M200,224H56a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96l56,56V216A8,8,0,0,1,200,224Z" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
					<polyline points="152 32 152 88 208 88" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline>
				</svg>

				<svg class="file-icon" v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 256 256">
					<rect width="256" height="256" fill="none"></rect>
					<line x1="48" y1="184" x2="48" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
					<line x1="208" y1="72" x2="208" y2="184" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
					<rect x="32" y="40" width="192" height="32" rx="8" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></rect>
					<line x1="128" y1="184" x2="128" y2="216" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
					<circle cx="128" cy="232" r="16" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle>
					<line x1="32" y1="184" x2="224" y2="184" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line>
				</svg>

				<span class="link-name">{{ item.name }}</span>
			</router-link>
		</template>
	</li>
</template>

<script>

	export default {
		name: "NavListItem",
		props: {
			item: {}
		},
		computed: {
			route() {
				return this.$context.routeList.find(route => route.name === this.item.uuid)
			}
		}
	}
</script>

<style scoped lang="scss">

	.nav-list-item-children {
		list-style-type: none;
		padding-left: 20px;
		margin-top:3px;
	}

	.nav-list-item {
		padding: 5px 0;
		color: var(--dimmed-text-color);
		line-height: 1rem;
	}

	.directory-icon {
		margin-left: 2px;
	}

	.directory-icon path {
		stroke: var(--dimmed-text-color);
		fill: var(--dimmed-text-color);
		display: inline-block;
	}

	.directory-name {
		display: inline;
		margin-left: 3px;
		position: relative;
		top: -2px;
	}

	.file-icon {
		stroke: var(--dimmed-text-color);
	}

	.link-name {
		position: relative;
		top: -2px;
		margin-left: 2px;
	}

	.link {
		text-decoration: none;
		color: inherit;
	}

	.router-link-active {
		font-weight: bold;
		color: var(--text-color-base);

		path {
			stroke:var(--text-color-base);
		}
	}

</style>
