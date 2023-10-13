export default class {
	constructor(uuid, name, isDirectory = false, children = []) {
		this.uuid = uuid
		this.name = name
		this.isDirectory = isDirectory
		this.children = children
	}
}
