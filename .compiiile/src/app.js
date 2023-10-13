import * as context from "virtual:compiiile"

export default (app) => {
	app.config.globalProperties.$context = context
}
