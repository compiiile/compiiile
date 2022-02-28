import path from "path"
import fs from "fs"

const source = "."

class FileTree {
    constructor (filePath, name = null) {
        //this.path = filePath
        this.path = filePath.slice(source.length, filePath.length)
        this.link = filePath
        this.text = name
        this.children = []
    }
}

const allFiles = []

const readDir = function (filePath) {
    const fileArray = []

    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

    fs.readdirSync(filePath).sort(collator.compare).forEach(file => {
        if (!['.vuepress', '.git', 'node_modules', 'compiiile', 'bin', '.idea', '.DS_Store', '.gitignore'].includes(file)) {
            const fileInfo = new FileTree(`${filePath}/${file}`, file)

            const stat = fs.statSync(fileInfo.link)

            if (stat.isDirectory()) {
                delete fileInfo.path
                delete fileInfo.component
                fileInfo.children = readDir(fileInfo.link)
            }

            if (path.extname(file) === '.md' || (stat.isDirectory() && fileInfo.children.length > 0)) {
                fileArray.push(fileInfo)

                if (!stat.isDirectory()) {
                    allFiles.push(fileInfo)
                }
            }
        }
    })
    return fileArray
}

export default function scanMarkdownFiles() {
    const virtualModuleId = '~ahah'
    const resolvedVirtualModuleId = '\0' + virtualModuleId

    return {
        name: 'scan-markdown-files',
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId
            }
        },
        load(id) {
            if (id !== resolvedVirtualModuleId) {
                return
            }

            const filesTree = readDir(source)

            return `const pages = ${JSON.stringify(allFiles)};\n\nexport default pages;`
        }
    }
}
