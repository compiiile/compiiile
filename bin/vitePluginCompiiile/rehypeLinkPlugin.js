import { visit } from "unist-util-visit"

export default function rehypeLinkPlugin() {
	return (tree, file) => {
		const context = JSON.parse(process.env.context || "{}")
		visit(tree, "element", (node) => {
			if (node.tagName === "a") {
				if (node.properties.href.match(/^\.{1,2}\/.*/)) {
					const linkTargetUrl = new URL(node.properties.href, `file://${file.history[0]}`)
					const path = decodeURI(linkTargetUrl.pathname).replaceAll("%20", " ")
					const decodedFilePath = decodeURIComponent(decodeURIComponent(path))
					const filePath = decodedFilePath.replace(process.env.COMPIIILE_SOURCE, "")
					node.properties.href = context.fileRouteMap?.[filePath.substring(1)] + linkTargetUrl.hash
				} else {
					node.properties.target = "_blank"
				}
			}
		})
	}
}
