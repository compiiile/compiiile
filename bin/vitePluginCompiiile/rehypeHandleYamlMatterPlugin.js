import { matter } from "vfile-matter"

export default function rehypeHandleYamlMatterPlugin() {
	return function (_, file) {
		matter(file)
		file.data.astro.frontmatter = file.data.matter
	}
}
