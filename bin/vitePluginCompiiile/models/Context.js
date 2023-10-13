import path from "node:path"
import fs from "node:fs"
import { v4 as uuidv4 } from "uuid"
import FileListItem from "./FileListItem.js"
import FilesTreeItem from "./FilesTreeItem.js"
import RouteListItem from "./RouteListItem.js"
import { renderMarkdown } from "@astrojs/markdown-remark"
import markdownConfig from "../markdownConfig.js"
import { unemojify } from "node-emoji"
import slugify from "slugify"

export default class {
	WORKSPACE_BASE_PATH = "c"
	SLIDES_BASE_PATH = "s"

	constructor() {
		this.fileList = []
		this.filesTree = []
		this.routeList = []
		this.fileRouteMap = {}

		this.site = {
			title: process.env.VITE_COMPIIILE_TITLE !== "" ? process.env.VITE_COMPIIILE_TITLE : undefined,
			description:
				process.env.VITE_COMPIIILE_DESCRIPTION !== "" ? process.env.VITE_COMPIIILE_DESCRIPTION : undefined,
			logo: process.env.VITE_COMPIIILE_LOGO !== "null" ? process.env.VITE_COMPIIILE_LOGO : undefined,
			siteUrl: process.env.VITE_COMPIIILE_SITE_URL !== "" ? process.env.VITE_COMPIIILE_SITE_URL : undefined
		}
	}

	generateRoutePathFromFilePath(filePath, hash = "", asSlides = false) {
		const filePathWithoutExtension = filePath.substring(0, filePath.lastIndexOf("."))
		const sluggifiedPath = filePathWithoutExtension
			.split("/")
			.map((val) => slugify(val, { lower: true }))
			.join("/")
		if (sluggifiedPath === "readme") {
			return "/"
		}
		return `/${asSlides ? this.SLIDES_BASE_PATH : this.WORKSPACE_BASE_PATH}/${sluggifiedPath}${hash}`
	}

	async scanDirectoryRecursively(directoryPath) {
		const fileArray = []

		const collator = new Intl.Collator(undefined, {
			numeric: true,
			sensitivity: "base"
		})

		const files = fs.readdirSync(directoryPath).sort(collator.compare)

		for (let file of files) {
			if (
				![
					".vuepress",
					".git",
					"node_modules",
					"compiiile",
					"bin",
					".idea",
					".DS_Store",
					".gitignore",
					"vendor"
				].includes(file)
			) {
				const filePath = path.join(directoryPath, file)
				const isDirectory = fs.statSync(filePath).isDirectory()
				const uuid = uuidv4()
				const fileName = path.parse(filePath).name
				const isReadmeFile = !isDirectory && filePath.toLowerCase() === "readme.md"

				let filesTreeItem = new FilesTreeItem(uuid, fileName)

				if (isDirectory) {
					filesTreeItem.isDirectory = true
					filesTreeItem.children = this.scanDirectoryRecursively(filePath)
				}

				if (path.extname(file).match(/^\.mdx?$/) || filesTreeItem?.children.length > 0) {
					if (isReadmeFile) {
						fileArray.unshift(filesTreeItem)
					} else {
						fileArray.push(filesTreeItem)
					}

					if (!isDirectory) {
						const fileListItem = new FileListItem(uuid)
						const markdownContent = fs.readFileSync(filePath, {
							encoding: "utf8"
						})
						const renderedMarkdown = await renderMarkdown(markdownContent, {
							...markdownConfig,
							remarkPlugins: []
						})
						fileListItem.textContent = unemojify(
							renderedMarkdown.metadata.html
								.replace(/<a.*aria-hidden.*>.*?<\/a>|<[^>]*>?/gi, "")
								.replace(/[\r\n]{2,}/g, "\n")
						)
						const meta = renderedMarkdown.vfile.data.matter
						fileListItem.title = meta.title || fileName
						fileListItem.meta = meta
						fileListItem.meta.title = fileListItem.meta.title || fileListItem.title
						fileListItem.fullPath = filePath

						const routePath = this.generateRoutePathFromFilePath(filePath, "", fileListItem.meta.asSlides)

						if (isReadmeFile) {
							this.fileList.unshift(fileListItem)
						} else {
							this.fileList.push(fileListItem)
						}

						// `asSlides` frontmatter param is passed via the meta
						const routeListItem = new RouteListItem(routePath, uuid, fileName, filePath, fileListItem.meta)
						fileListItem.routePath = routeListItem.path
						this.fileRouteMap[filePath] = routeListItem.path
						this.routeList.push(routeListItem)
					}
				}
			}
		}

		return fileArray
	}
}
