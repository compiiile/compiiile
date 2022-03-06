import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import viteComponents from 'vite-plugin-components'
import compiiile from "./vitePluginCompiiile";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        viteComponents({
            customLoaderMatcher: path => path.endsWith('.md'),
            globs: ["!(./node_modules/**)","!(**.git**)","**.md"],
        }),
        compiiile()
    ]
})
