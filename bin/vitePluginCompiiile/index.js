import { createMarkdownProcessor } from "@astrojs/markdown-remark"
import { rehypePlugins, remarkPlugins, shikiConfig } from "./markdownConfig.js"
import path from "node:path"
import { loadConfig } from "../loadConfig.js"
import { promises as fs } from "node:fs"

const pathFromSource = (filePath) => {
	return filePath?.replace(process.env.COMPIIILE_SOURCE + "/", "")
}

export default function compiiile(sharedContext) {
	const virtualModuleId = "virtual:compiiile"
	const resolvedVirtualModuleId = "\0" + virtualModuleId

	return {
		name: "compiiile",
		resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId
			}
		},
		async load(id) {
			if (id !== resolvedVirtualModuleId) {
				return
			}

			return `const fileList = ${JSON.stringify(sharedContext.fileList)};\n\n
            const filesTree = ${JSON.stringify(sharedContext.filesTree)};\n\n
            const routeList = ${JSON.stringify(sharedContext.routeList)};\n\n
            const site = ${JSON.stringify(sharedContext.site)};\n\n
            export { fileList, filesTree, routeList, site };`
		},
		async hotUpdate({ file, read }) {
			let shouldReloadPlugin = false
			const absolutePath = pathFromSource(file)

			if (file.match(/.*\.mdx?/)) {
				try {
					const content = await read()

					const routeListItem = sharedContext.routeList.find((route) => route.fullPath === absolutePath)

					const markdownProcessor = await createMarkdownProcessor({
						remarkPlugins,
						rehypePlugins: rehypePlugins(sharedContext),
						shikiConfig
					})
					const renderedMarkdown = await markdownProcessor.render(content)

					const title = sharedContext.getFileTitleFromProcessedMarkdown(renderedMarkdown)
					const meta = renderedMarkdown.metadata.frontmatter
					meta.title = title || path.parse(file).name

					const fileMetaChanged = JSON.stringify(routeListItem?.meta || {}) !== JSON.stringify(meta)

					shouldReloadPlugin = fileMetaChanged || !routeListItem

					const prevStateWasAsSlides = !!routeListItem?.meta?.asSlides
					const currentStateIsAsSlides = !!meta.asSlides

					if (prevStateWasAsSlides !== currentStateIsAsSlides) {
						const newRoutePath = sharedContext.generateRoutePathFromFilePath(
							routeListItem.fullPath,
							"",
							currentStateIsAsSlides,
							sharedContext.getEntryFileMatcher([routeListItem.fullPath])
						)

						this.environment.hot.send({
							type: "custom",
							event: "switch-page-render",
							data: {
								oldRoutePath: routeListItem.path,
								newRoutePath: newRoutePath
							}
						})
					}
				} catch (e) {
					if (e.code === "ENOENT") {
						// The file has been deleted
						shouldReloadPlugin = true
					}
				}
			}

			const compiiileConfigFilePath = pathFromSource(process.env.COMPIIILE_CONFIG_FILE)
			const compiiileConfigFileNewlyCreated =
				absolutePath.match(/^compiiile\.config\.(m|c)?js$/) &&
				process.env.COMPIIILE_CONFIG_FILE === "compiiile.config"

			if (absolutePath === compiiileConfigFilePath || compiiileConfigFileNewlyCreated) {
				shouldReloadPlugin = true

				// WHY we do all this stuff and don't just import the config:
				// "the file change callback may fire too fast before the editor finishes updating the file"
				// https://vite.dev/guide/api-plugin.html#handlehotupdate

				try {
					const compiiileConfigFileContent = await read()
					const tempConfigName = `${Date.now()}-temp-compiiile`
					const tempDir = path.join(process.env.COMPIIILE_SOURCE, ".compiiile", ".temp")
					await fs.mkdir(tempDir, { recursive: true }).catch(console.error)
					const filePath = path.join(tempDir, tempConfigName + ".config.mjs")
					await fs.writeFile(filePath, compiiileConfigFileContent)
					process.env.COMPIIILE_TEMP_DIR = tempDir
					process.env.COMPIIILE_TEMP_CONFIG_NAME = tempConfigName
				} catch (e) {
					// Config file has been deleted
				}

				// Whether the config file has been created / updated / deleted, we reload the whole config with args + env parameters
				await loadConfig()
			}

			if (shouldReloadPlugin) {
				// Invalidate the plugin module so it gets re-imported
				const pluginModule = this.environment.moduleGraph.getModuleById(resolvedVirtualModuleId)
				if (pluginModule) {
					this.environment.moduleGraph.invalidateModule(pluginModule)
				}

				this.environment.hot.send({ type: "full-reload" })

				return []
			}
		}
	}
}
