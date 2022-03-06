import Context from "./models/Context"

const source = "."

/*class FileTree {
    constructor (filePath, name = null) {
        this.path = filePath.slice(source.length + 1, filePath.length)
        this.link = filePath
        this.text = name
        this.children = []
        this.name = path.parse(filePath).name
        this.markdownContent = null
        this.isFolder = false
        this.htmlContent = null
        this.meta = {
            uuid : uuidv4()
        }
    }
}*/

export default function compiiile() {
    const virtualModuleId = '~compiiile'
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
            export { fileList, filesTree, routeList };`
        }
    }
}
