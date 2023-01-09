import * as context from "virtual:compiiile"

export default {
    install(app, options) {
        app.config.globalProperties.$context = context
    }
}
