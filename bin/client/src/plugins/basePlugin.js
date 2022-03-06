import * as context from "~compiiile"

console.log(context)

export default {
    install(app, options) {
        app.config.globalProperties.$context = context;
    }
}
