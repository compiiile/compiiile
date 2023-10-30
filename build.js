import { build } from "vite"
import { unlinkSync } from "node:fs"

const jsFileName = "style.es.js"
await build({
	build: {
		lib: {
			entry: new URL("./.compiiile/src/utils/styles.js", import.meta.url).pathname,
			name: "style",
			formats: ["es"],
			fileName: (_) => jsFileName
		}
	}
})

await unlinkSync(`./dist/${jsFileName}`)
