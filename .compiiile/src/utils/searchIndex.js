import { fileList } from "virtual:compiiile"
import { Fzf } from "fzf"

const fileParagraphs = fileList
	.reduce((accumulator, currentValue) => {
		const splitter = "\n"
		const paragraphs = currentValue.textContent.split(splitter)

		let currentIndex = 0

		for (const paragraph of paragraphs) {
			accumulator.push({
				uuid: currentValue.uuid,
				paragraph,
				startIndex: currentIndex,
				endIndex: currentIndex + paragraph.length
			})

			currentIndex += paragraph.length + splitter.length
		}
		return accumulator
	}, [])
	.filter((paragraph) => paragraph.paragraph)

export const searchIndex = new Fzf(fileParagraphs, {
	selector: (item) => item.paragraph,
	fuzzy: false
})
