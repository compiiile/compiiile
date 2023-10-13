import { visit } from "unist-util-visit"

const filterObjectDefinedValuesOnly = (obj) =>
	Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))

export default function rehypeImagePlugin() {
	const processImageNode = (altAttributeValue) => {
		if (altAttributeValue) {
			const matchWidth = altAttributeValue.match(/(?<altValue>.*)\|.*?(?<width>\d+(px|%)?)/)?.groups || {}
			const matchNoMargin = altAttributeValue.match(/(?<altValue>.*)\|.*?(?<noMargin>no-margin)/)?.groups || {}

			return {
				...filterObjectDefinedValuesOnly(matchWidth),
				...filterObjectDefinedValuesOnly(matchNoMargin)
			}
		}
		return null
	}

	const buildImageStyleAttribute = (parsedAltValue) => {
		return `${parsedAltValue.width ? "width:" + parsedAltValue.width + ";height:auto;" : ""}${
			parsedAltValue.noMargin ? "margin:0" : ""
		}`
	}

	return (tree) => {
		visit(tree, "element", function (node) {
			if (node.tagName === "img") {
				const parsedAltValue = processImageNode(node.properties?.alt)
				if (parsedAltValue) {
					node.properties.style = buildImageStyleAttribute(parsedAltValue)
					node.properties.alt = parsedAltValue.altValue
				}
			}
		})
		visit(tree, "mdxJsxFlowElement", function (node) {
			if (node.name === "astro-image") {
				const alt = node.attributes?.find((attr) => attr.name === "alt")
				const parsedAltValue = processImageNode(alt?.value)
				if (parsedAltValue) {
					node.attributes.push({
						name: "style",
						type: "mdxJsxAttribute",
						value: buildImageStyleAttribute(parsedAltValue)
					})
					alt.value = parsedAltValue.altValue
				}
			}
		})
	}
}
