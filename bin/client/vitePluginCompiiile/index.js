import Context from "./models/Context"

const source = "."

export default function compiiile() {
    const virtualModuleId = 'virtual:compiiile'
    const resolvedVirtualModuleId = '\0' + virtualModuleId

    return {
        name: 'compiiile',
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }
        },
        load(id) {
            if (id !== resolvedVirtualModuleId) {
                return
            }

            const context = new Context(source)

            return `const fileList = ${JSON.stringify(context.fileList)};\n\n
            const filesTree = ${JSON.stringify(context.filesTree)};\n\n
            const routeList = ${JSON.stringify(context.routeList)};\n\n
            const searchIndex = ${JSON.stringify(context.searchIndex)};\n\n
            export { fileList, filesTree, routeList, searchIndex };`
        }
    }
}
