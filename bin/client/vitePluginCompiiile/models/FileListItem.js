export default class {
    constructor(uuid, markdownContent = null, htmlContent = null, meta = {}, toc = null) {
        this.uuid = uuid
        this.markdownContent = markdownContent
        this.htmlContent = htmlContent
        this.meta = meta
        this.toc = toc
    }
}
