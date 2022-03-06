export default class {
    constructor(path, name, meta) {
        this.path = path
        this.name = name
        this.meta = meta
        this.alias = this.path === "readme" ? "/" : undefined
    }
}
