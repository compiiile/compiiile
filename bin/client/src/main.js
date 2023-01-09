import {createApp} from 'vue'
import App from './App.vue'
import router from "./router"
import {createHead} from '@vueuse/head'
import basePlugin from "./plugins/basePlugin.js"
import "./assets/style/index.scss"

const head = createHead()

createApp(App)
    .use(router)
    .use(head)
    .use(basePlugin)
    .mount('#app')
