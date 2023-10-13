import Context from "./models/Context.js"

const source = "."

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

			const context = new Context()
			context.filesTree = await context.scanDirectoryRecursively(source)
			process.env.context = JSON.stringify(context)

			return `const fileList = ${JSON.stringify(context.fileList)};\n\n
            const filesTree = ${JSON.stringify(context.filesTree)};\n\n
            const routeList = ${JSON.stringify(context.routeList)};\n\n
            const site = ${JSON.stringify(context.site)};\n\n
            export { fileList, filesTree, routeList, site };`
		}
	}
}
