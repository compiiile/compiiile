import { visit } from "unist-util-visit"

export default function rehypeLinkPlugin(sharedContext) {
	return (tree, file) => {
		visit(tree, "element", (node) => {
			if (node.tagName === "a") {
				if (node.properties.href.match(/^\.{1,2}\/.*/)) {
					const linkTargetUrl = new URL(node.properties.href, `file://${file.history[0]}`)
					const path = decodeURI(linkTargetUrl.pathname).replaceAll("%20", " ")
					const decodedFilePath = decodeURIComponent(decodeURIComponent(path))
					const filePath = decodedFilePath.replace(process.env.COMPIIILE_SOURCE, "")

					node.properties.href = sharedContext?.fileRouteMap?.[filePath.substring(1)] + linkTargetUrl.hash
				} else if (!node.properties.href.startsWith("#")) {
					node.properties.target = "_blank"
				}
			}
		})
	}
}
