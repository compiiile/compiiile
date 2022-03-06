import * as context from "~compiiile"

export default {
    install(app, options) {
        app.config.globalProperties.$context = context;
    }
}
