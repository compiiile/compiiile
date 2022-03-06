<template>
	<li class="nav-list-item">
		<template v-if="item.isDirectory">
			<p>{{ item.name }}</p>
			<ul v-if="item.children.length > 0"
			    class="nav-list-item-children">
				<nav-list-item v-for="child in item.children"
				               :item="child"
				               :key="child.uuid"/>
			</ul>
		</template>

		<template v-else>
			<router-link :to="{ name: routeName }"
			             class="link">{{ item.name }}
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
			routeName() {
				return this.$context.routeList.find(route => route.name === this.item.uuid).name
			}
		}
	}
</script>

<style scoped>

	.nav-list-item-children {
		list-style-type: none;
		padding-left: 15px;
	}

	.nav-list-item {
		padding: 5px 0;
		color: var(--nav-list-item-color);
	}

	.link {
		text-decoration: none;
		color: inherit;
	}

	.nuxt-link-exact-active {
		font-weight: bold;
		color: var(--text-color-base);
	}

</style>
