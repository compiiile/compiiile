import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import viteComponents from 'vite-plugin-components'
import scanMarkdownFiles from "./vitePluginScanMarkdownFiles";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        viteComponents({
            customLoaderMatcher: path => path.endsWith('.md'),
            globs: ["!(./node_modules/**)","!(**.git**)","**.md"],
        }),
        scanMarkdownFiles()
    ]
})
