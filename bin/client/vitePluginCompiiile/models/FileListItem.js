export default class {
    constructor(uuid, markdownContent = null, htmlContent = null, meta = {}) {
        this.uuid = uuid
        this.markdownContent = markdownContent
        this.htmlContent = htmlContent
        this.meta = meta
    }
}
