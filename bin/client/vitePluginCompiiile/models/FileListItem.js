export default class {
    constructor(uuid, markdownContent = null, htmlContent = null, title, fullPath, meta = {}, toc = null) {
        this.uuid = uuid
        this.markdownContent = markdownContent
        this.htmlContent = htmlContent
        this.title = title
        this.fullPath = fullPath
        this.meta = meta
        this.toc = toc
    }
}
