import * as context from "../utils/context.js"

console.log(context)

export default {
    install(app, options) {
        app.config.globalProperties.$context = context;
    }
}
