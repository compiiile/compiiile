import path from "node:path"
import fs from "node:fs"
import { v4 as uuidv4 } from "uuid"
import FileListItem from "./FileListItem.js"
import FilesTreeItem from "./FilesTreeItem.js"
import RouteListItem from "./RouteListItem.js"
import { createMarkdownProcessor } from "@astrojs/markdown-remark"
import markdownConfig from "../markdownConfig.js"
import { unemojify } from "node-emoji"
import slugify from "slugify"
import parseIgnore from "parse-gitignore"
import { minimatch } from "minimatch"

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
			logoUrl: process.env.VITE_COMPIIILE_LOGO_URL !== "" ? process.env.VITE_COMPIIILE_LOGO_URL : undefined,
			siteUrl: process.env.VITE_COMPIIILE_SITE_URL !== "" ? process.env.VITE_COMPIIILE_SITE_URL : undefined,
			base: process.env.VITE_COMPIIILE_BASE,
			data: JSON.parse(process.env.VITE_COMPIIILE_DATA),
			theme: process.env.VITE_COMPIIILE_THEME
		}
	}

	generateRoutePathFromFilePath(filePath, hash = "", asSlides = false, entryFileMatcher) {
		const filePathWithoutExtension = filePath.substring(0, filePath.lastIndexOf("."))
		const sluggifiedPath = filePathWithoutExtension
			.split("/")
			.map((val) => slugify(val, { lower: true }))
			.join("/")

		if (sluggifiedPath.match(new RegExp(/^/.source + entryFileMatcher.source))) {
			if (process.env.VITE_COMPIIILE_BASE !== "/") {
				return process.env.VITE_COMPIIILE_BASE
			}

			return "/"
		}
		return `${
			process.env.VITE_COMPIIILE_BASE.endsWith("/")
				? process.env.VITE_COMPIIILE_BASE.slice(0, -1)
				: process.env.VITE_COMPIIILE_BASE
		}/${asSlides ? this.SLIDES_BASE_PATH : this.WORKSPACE_BASE_PATH}/${sluggifiedPath}${hash}`
	}

	async scanDirectoryRecursively(directoryPath) {
		const fileArray = []

		const collator = new Intl.Collator(undefined, {
			numeric: true,
			sensitivity: "base"
		})

		const files = fs.readdirSync(directoryPath).sort(collator.compare)

		const entryFileMatcher = files.find((file) => file.toLowerCase().match(/^readme.mdx?$/)) ? /readme/ : /index/

		for (let file of files) {
			if (
				![
					".vuepress",
					".git",
					"node_modules",
					".compiiile",
					"bin",
					".idea",
					".DS_Store",
					".gitignore",
					"vendor"
				].includes(file)
			) {
				const filePath = path.join(directoryPath, file)

				try {
					const compiiileIgnoreFilePath = fs.readFileSync(
						path.join(process.env.COMPIIILE_SOURCE, ".compiiileignore")
					)
					const compiiileIgnore = parseIgnore(compiiileIgnoreFilePath)

					const ignoreGlobs = compiiileIgnore.globs().filter((globType) => globType.type === "ignore")
					const ignorePatterns = ignoreGlobs.reduce((patterns, currentIgnoreGlobItem) => {
						return [...patterns, ...currentIgnoreGlobItem.patterns]
					}, [])

					const isFilePathInIgnoredPatterns = ignorePatterns.some((pattern) => minimatch(filePath, pattern))

					if (isFilePathInIgnoredPatterns) {
						continue
					}
				} catch (e) {
					// No .compiiileignore file found at the root
				}

				const isDirectory = fs.statSync(filePath).isDirectory()
				const uuid = uuidv4()
				const fileName = path.parse(filePath).name
				const isReadmeFile =
					!isDirectory &&
					filePath
						.toLowerCase()
						.match(new RegExp(/^(.*?\/?)/.source + entryFileMatcher.source + /\.mdx?$/.source))

				let filesTreeItem = new FilesTreeItem(uuid, fileName)

				if (isDirectory) {
					filesTreeItem.isDirectory = true
					filesTreeItem.children = await this.scanDirectoryRecursively(filePath)
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

						const markdownProcessor = await createMarkdownProcessor(markdownConfig)
						const renderedMarkdown = await markdownProcessor.render(markdownContent)

						fileListItem.textContent = unemojify(
							renderedMarkdown.code
								.replace(/^<hr>\n<h2(.|\n)*?<\/h2>/g, "")
								.replace(/<br>/g, " ")
								.replace(/<a.*aria-hidden.*>.*?<\/a>|<[^>]*>?/gi, "")
								.replace(/[\r\n]{2,}/g, "\n")
						)

						const meta = renderedMarkdown.metadata.frontmatter

						if (meta.ignore) {
							const fileIndex = fileArray.findIndex((f) => f.uuid === fileListItem.uuid)
							if (fileIndex > -1) {
								fileArray.splice(fileIndex, 1)
							}
							continue
						}

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

						fileListItem.title = meta.title || firstHeading || fileName
						fileListItem.meta = meta
						fileListItem.meta.title = fileListItem.meta.title || fileListItem.title
						fileListItem.fullPath = filePath

						const routePath = this.generateRoutePathFromFilePath(
							filePath,
							"",
							fileListItem.meta.asSlides,
							entryFileMatcher
						)

						if (isReadmeFile) {
							let newIndex = 0

							if (directoryPath !== ".") {
								newIndex = this.fileList.findIndex((f) => f.fullPath.startsWith(directoryPath))
								if (newIndex < 0) {
									newIndex = this.fileList.length
								}
							}

							this.fileList.splice(newIndex, 0, fileListItem)
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
