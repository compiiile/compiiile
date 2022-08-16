<template>
	<main>
		<router-view></router-view>
	</main>
</template>

<script>

	export default {
		// Style for all icons
		provide: {
			size: 12,
			weight: "regular"
		}
	}

</script>
