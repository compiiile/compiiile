import md from "../markdown";
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from 'uuid'
import FileListItem from "./FileListItem.js";
import FilesTreeItem from "./FilesTreeItem.js";
import RouteListItem from "./RouteListItem.js";
import slugify from "slugify"

export default class {
    constructor(directoryPath) {
        this.fileList = []
        this.filesTree = []
        this.routeList = []
        this.searchIndex = {}

        this.filesTree = this.scanDirectoryRecursively(directoryPath)
    }

    slugifyWithSlashes = (str) => {
        return str.split('/').map(val => slugify(val, { lower: true })).join('/')
    }

    scanDirectoryRecursively = (directoryPath) => {
        const fileArray = []

        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

        fs.readdirSync(directoryPath).sort(collator.compare).forEach(file => {
            if (!['.vuepress', '.git', 'node_modules', 'compiiile', 'bin', '.idea', '.DS_Store', '.gitignore'].includes(file)) {
                const filePath = path.join(directoryPath, file)
                const isDirectory = fs.statSync(filePath).isDirectory()
                const uuid = uuidv4()
                const fileName = path.parse(filePath).name

                let filesTreeItem = new FilesTreeItem(
                    uuid,
                    fileName,
                )

                if (isDirectory) {
                    filesTreeItem.isDirectory = true
                    filesTreeItem.children = this.scanDirectoryRecursively(filePath)
                }

                if (path.extname(file) === '.md' || filesTreeItem?.children.length > 0) {
                    fileArray.push(filesTreeItem)

                    if (!isDirectory) {
                        const fileListItem = new FileListItem(uuid)
                        fileListItem.markdownContent = fs.readFileSync(filePath, {encoding:'utf8'})
                        md.renderer.filePath = filePath
                        fileListItem.htmlContent = md.render(fileListItem.markdownContent)
                        fileListItem.title = fileName
                        fileListItem.meta = md.meta
                        fileListItem.toc = md.toc
                        fileListItem.fullPath = filePath
                        this.fileList.push(fileListItem)

                        md.toc = []

                        const filePathWithoutExtension = filePath.substring(0, filePath.lastIndexOf('.'));
                        const routePath = this.slugifyWithSlashes(filePathWithoutExtension)
                        const routeListItem = new RouteListItem(routePath, uuid, fileName, { asSlides: fileListItem.meta.asSlides})
                        this.routeList.push(routeListItem)
                    }
                }
            }
        })

        return fileArray
    }
}
