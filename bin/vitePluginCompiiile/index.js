import Context from "./models/Context.js"
import {createMarkdownProcessor} from "@astrojs/markdown-remark";
import markdownConfig from "./markdownConfig.js";
import path from "node:path";
import {loadConfig} from "c12";
import { pathToFileURL } from 'node:url';
import { promises as fs } from 'node:fs';

const source = "."

let context = null

const pathFromSource = (filePath) => {
	return filePath?.replace(process.env.COMPIIILE_SOURCE + "/", "")
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
				const content = await read()

				const routeListItem = context.routeList.find(route => route.fullPath === absolutePath)
				const markdownProcessor = await createMarkdownProcessor(markdownConfig)
				const renderedMarkdown = await markdownProcessor.render(content)

				const title = context.getFileTitleFromProcessedMarkdown(renderedMarkdown)
				const meta = renderedMarkdown.metadata.frontmatter
				meta.title = title || path.parse(file).name

				const fileMetaChanged = JSON.stringify(routeListItem?.meta || {}) !== JSON.stringify(meta)

				shouldReloadPlugin = fileMetaChanged || !routeListItem
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


			const compiiileConfigFilePath = pathFromSource(process.env.COMPIIILE_CONFIG_FILE)
			if(absolutePath === compiiileConfigFilePath) {
				//process.env.VITE_COMPIIILE_TITLE = "salut"
				//console.log(process.argv)
				shouldReloadPlugin = true

				// WHY we do all this stuff and don't just import the config:
				// "the file change callback may fire too fast before the editor finishes updating the file"
				// https://vite.dev/guide/api-plugin.html#handlehotupdate

				const compiiileConfigFileContent = await read()
				console.log(compiiileConfigFileContent)

				try {
					const tempFileName = `compiiile.config.mjs`
					const tempDir = path.join(process.env.COMPIIILE_SOURCE, ".compiiile", ".temp")
					await fs.mkdir(tempDir, { recursive: true }).catch(console.error);
					const filePath = path.join(tempDir, tempFileName)
					await fs.writeFile(filePath, compiiileConfigFileContent);
					const module = await import(pathToFileURL(filePath).href);
					process.env.COMPIIILE_TEMP_DIR = filePath

					console.log(module.default || module)
				} catch(e){
					console.log(e)
				}

				// TODO test without config !
				// TODO test delete config file !
				// TODO astro:server:done cleanup temp dir
				// TODO update roadmap

				/*let newConfig = {}
				const blob = new Blob([compiiileConfigFileContent], { type: "application/javascript" });
				const url = URL.createObjectURL(blob);
				try {
					const module = await import(url);
					URL.revokeObjectURL(url);
					newConfig = module.default || module
				} catch (error) {
					console.error("Error importing module:", error);
				}
				console.log(newConfig)*/
			}

			if(shouldReloadPlugin){
				// Invalidate the plugin module so it gets re-imported
				const pluginModule = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
				if (pluginModule) {
					server.moduleGraph.invalidateModule(pluginModule);
				}

				server.ws.send({ type: "full-reload" });
				return []
			}
		}
	}
}
