import remarkEmoji from "remark-emoji"
import rehypeImagePlugin from "./rehypeImagePlugin.js"
import rehypeLinkPlugin from "./rehypeLinkPlugin.js"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { h } from "hastscript"
import rehypeHandleYamlMatterPlugin from "./rehypeHandleYamlMatterPlugin.js"
import { unified } from "@astrojs/markdown-remark"

export const remarkPlugins = [remarkEmoji]
export const rehypePlugins = (sharedContext) => [
	rehypeImagePlugin,
	rehypeSlug,
	[
		rehypeAutolinkHeadings,
		{
			behavior: "prepend",
			content: () => [h("span", "#")],
			properties: {
				ariaHidden: true,
				tabIndex: -1,
				class: "header-anchor"
			}
		}
	],
	rehypeHandleYamlMatterPlugin,
	[rehypeLinkPlugin, sharedContext]
]

export const shikiConfig = { theme: "css-variables" }

export default (sharedContext) => ({
	processor: unified({
		remarkPlugins,
		rehypePlugins: rehypePlugins(sharedContext)
	}),
	shikiConfig
})
