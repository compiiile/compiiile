import lunr from "lunr";
import stemmer from "lunr-languages/lunr.stemmer.support"
stemmer(lunr)
import fr from "lunr-languages/lunr.fr"
fr(lunr)
import multi from 'lunr-languages/lunr.multi'
multi(lunr)


import { fileList } from "virtual:compiiile"

export const searchIndex = lunr(function () {
    this.use(lunr.multiLanguage('en', 'fr'))

    this.ref('uuid')
    this.field('title')
    this.field('markdownContent')

    this.metadataWhitelist = ['position']

    fileList.forEach(doc => this.add(doc))
})
