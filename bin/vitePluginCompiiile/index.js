import Context from "./models/Context.js"
import {createMarkdownProcessor} from "@astrojs/markdown-remark";
import markdownConfig from "./markdownConfig.js";
import path from "node:path";
import {loadConfig} from "c12";

const source = "."

let context = null

const pathFromSource = (filePath) => {
	return filePath.replace(process.env.COMPIIILE_SOURCE + "/", "")
}

export default function compiiile() {
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

			context = new Context()
			context.filesTree = await context.scanDirectoryRecursively(source)
			process.env.context = JSON.stringify(context)

			return `const fileList = ${JSON.stringify(context.fileList)};\n\n
            const filesTree = ${JSON.stringify(context.filesTree)};\n\n
            const routeList = ${JSON.stringify(context.routeList)};\n\n
            const site = ${JSON.stringify(context.site)};\n\n
            export { fileList, filesTree, routeList, site };`
		},
		async handleHotUpdate({file, timestamp, modules, read, server}){
			let shouldReloadPlugin = false
			const absolutePath = pathFromSource(file)

			if(file.match(/.*\.mdx?/)){
				console.log("HMR")
				console.log("ctx")
				console.log("file")
				console.log(file)
				console.log("timestamp")
				console.log(timestamp)
				console.log("modules")
				console.log(modules)
				console.log("context")
				//console.log(context?.routeList)


				const content = await read()
				//console.log(content)

				const routeListItem = context.routeList.find(route => route.fullPath === absolutePath)
				const markdownProcessor = await createMarkdownProcessor(markdownConfig)
				const renderedMarkdown = await markdownProcessor.render(content)

				const title = context.getFileTitleFromProcessedMarkdown(renderedMarkdown)
				const meta = renderedMarkdown.metadata.frontmatter
				meta.title = title || path.parse(file).name
				//server.restart()

				const fileMetaChanged = JSON.stringify(routeListItem?.meta || {}) !== JSON.stringify(meta)

				shouldReloadPlugin = fileMetaChanged || !routeListItem
				/*
				if (meta.ignore) {

				}
				*/

				/*
				let firstHeading = null
				if (
					JSON.parse(process.env.VITE_COMPIIILE_USE_AUTO_TITLES) &&
					renderedMarkdown.metadata.headings.length > 0
				) {
					let firstHeadingIndex = 0
					if (Object.keys(renderedMarkdown.metadata.frontmatter).length > 0) {
						// If a frontmatter is set, it is present as the first index in the `headings` array
						firstHeadingIndex = 1
					}
					// Remove the starting '#' from the title
					firstHeading = renderedMarkdown.metadata.headings[firstHeadingIndex]?.text?.slice(1)
				}

				if(firstHeading !== routeListItem.meta.title)
				fileListItem.meta.title = fileListItem.meta.title || fileListItem.title

				 */

				//console.log(context?.filesTree)




				/*

				function findFileListItemByUUID(data, uuid) {
					for (const fileListItem of data) {
						if (fileListItem.uuid === uuid) {
							return fileListItem;
						}
						if (fileListItem.children && fileListItem.children.length > 0) {
							const found = findFileListItemByUUID(fileListItem.children, uuid);
							if (found) return found;
						}
					}
					return null;
				}

				const fileListItem = findFileListItemByUUID(context.filesTree, routeListItem.name)
				routeListItem.name = "coucou"*/

				//server.ws.send({ type: 'full-reload' })


				/*server.ws.send({
					type: 'custom',
					event: 'special-update',
					data: {}
				})
				return []*/
			}
			//console.log("server")
			//console.log(server)
			/*
			file


			path: '/c/test/test',
			name: '0bea781c-875f-44fb-bc9c-b1f71f2c92c1',
			title: 'test',
			fullPath: 'test/test.md',
			meta: { title: 'test' }

			 */

			// Si c'est un nouveau fichier md ou mdx => full reload
			// Si c'est un fichier md ou mdx qu'on a déjà, read file + update meta dans lers clés correspondates
			//server.ws.send({ type: 'full-reload' })
			//return []


			const compiiileConfigFilePath = pathFromSource((await loadConfig({ name: "compiiile" })).configFile)
			if(absolutePath === compiiileConfigFilePath) {
				process.env.VITE_COMPIIILE_TITLE = "salut"
				console.log(process.argv)
				//server.restart()
				//return
				//console.log(server)
				//console.log(process.argv)
				shouldReloadPlugin = true

				/*
                                console.log("full reload")
                                console.log(server.moduleGraph.idToModuleMap.entries())
                                const invalidatedModules = new Set()
                                for(const ah of server.moduleGraph.idToModuleMap.values()){
                                    //console.log("ah")
                                    //console.log(ah.id)
                                    server.moduleGraph.invalidateModule(
                                        ah,
                                        invalidatedModules,
                                        timestamp,
                                        true
                                    )
                                }

                                for (const mod of modules) {
                                    console.log("mod")
                                    console.log(mod)
                                    server.moduleGraph.invalidateModule(
                                        mod,
                                        invalidatedModules,
                                        timestamp,
                                        true
                                    )
                                }
                                server.ws.send({ type: 'full-reload' })
                                return []
                            }*/

			}

			if(shouldReloadPlugin){
				// Invalidate the plugin module so it gets re-imported
				const pluginModule = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
				if (pluginModule) {
					server.moduleGraph.invalidateModule(pluginModule);
				}

				// Trigger full reload
				// if meta.ignore pas de reload
				server.ws.send({ type: "full-reload" });
				// TODO send switch to slides page if meta changed
				// TODO si la propriété ignore a changé
				// TODO store ignore patterns as property and check file path against it
				return []
			}
		}
	}
}
