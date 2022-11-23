import lunr from "lunr";


import { fileList } from "virtual:compiiile"

export const searchIndex = lunr(function () {

    this.ref('uuid')
    this.field('title')
    this.field('markdownContent')

    // Fix issue with wildcard
    this.pipeline.remove(lunr.trimmer)

    this.metadataWhitelist = ['position']

    fileList.forEach(doc => this.add(doc))
})
