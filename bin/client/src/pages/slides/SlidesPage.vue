<template>
	<div>
		<router-view/>
	</div>
</template>

<script>

	import {setUpUseHead} from "../../utils/setUpUseHead.js"

	export default {
		name: "SlidesPage",
		setup(){
			setUpUseHead()
		}
	}

</script>
