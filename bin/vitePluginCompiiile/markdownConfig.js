import emoji from "remark-emoji"
import rehypeImagePlugin from "./rehypeImagePlugin.js"
import rehypeLinkPlugin from "./rehypeLinkPlugin.js"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { h } from "hastscript"
import rehypeHandleYamlMatterPlugin from "./rehypeHandleYamlMatterPlugin.js"

export default {
	remarkPlugins: [emoji],
	rehypePlugins: [
		rehypeImagePlugin,
		rehypeLinkPlugin,
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
		rehypeHandleYamlMatterPlugin
	],
	shikiConfig: { theme: "css-variables" }
}
