import context from "../utils/context.js"

export default {
    install(app, options) {
        app.config.globalProperties.$context = context;
    }
}
