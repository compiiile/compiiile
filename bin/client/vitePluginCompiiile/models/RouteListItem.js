export default class {
    constructor(path, name, title, meta) {
        this.path = path
        this.name = name
        this.title = title
        this.meta = meta
        this.alias = this.path === "readme" ? "/" : undefined
    }
}
