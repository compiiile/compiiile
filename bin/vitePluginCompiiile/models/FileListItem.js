export default class {
	constructor(uuid, textContent = null, title, fullPath, meta = {}, routePath = null) {
		this.uuid = uuid
		this.textContent = textContent
		this.title = title
		this.fullPath = fullPath
		this.meta = meta
		this.routePath = routePath
	}
}
