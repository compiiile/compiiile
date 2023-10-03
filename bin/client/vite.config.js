import {defineConfig,searchForWorkspaceRoot} from 'vite'
import vue from '@vitejs/plugin-vue'
import compiiile from "./vitePluginCompiiile"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        compiiile()
    ],
    base: "./",
    server: {
        fs: {
            allow: [
                searchForWorkspaceRoot(process.cwd()),
                '.'
            ],
        },
    },
})
