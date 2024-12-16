import { build } from "vite"
import { unlinkSync } from "node:fs"

const fileName = "style"
await build({
	build: {
		lib: {
			entry: new URL("./.compiiile/src/utils/styles.js", import.meta.url).pathname,
			name: "style",
			formats: ["es"],
			fileName
		}
	}
})

await unlinkSync(`./dist/${fileName}.js`)
