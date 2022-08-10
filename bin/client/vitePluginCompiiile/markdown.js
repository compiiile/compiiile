import MarkdownIt from "markdown-it"
import meta from "markdown-it-meta"
import emoji from "markdown-it-emoji"
import externalLinks from "markdown-it-external-links"
import anchor from "markdown-it-anchor"

import hljs from "highlight.js"

const fs = require("fs")
const path = require("path")

const md = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
            } catch (__) {}
        }

        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
});

md.renderer.rules.image = function (tokens, idx, options, env, slf) {
    var token = tokens[idx]
    token.attrs[token.attrIndex('alt')][1] = slf.renderInlineAsText(token.children, options, env)
    // this is the line of code responsible for an additional 'loading' attribute

    const src = token.attrs[token.attrIndex('src')][1]
    if(true){ // @TODO if local asset
        // Set local assets src to be well served by vite

        // @TODO clean that + hash filenames
        // Work for dev
        token.attrs[token.attrIndex('src')][1] = `@fs${new URL(`../../../${ src }`, import.meta.url).pathname}`


        // Work for prod
        const assetPath = new URL(`../../../${ src }`, import.meta.url).pathname

        const fileName = assetPath.substring(assetPath.lastIndexOf("/") + 1)
        const ah = fs.copyFileSync(assetPath, path.resolve(__dirname,`../public/${ fileName }`))
        token.attrs[token.attrIndex('src')][1] = fileName
    }


    return slf.renderToken(tokens, idx, options)
}

md.toc = []

md.use(meta)
    .use(emoji)
    .use(externalLinks, {
        externalTarget: "_blank"
    })
    .use(anchor, {
        callback(itemData, tocItem){
            md.toc.push({
                slug: tocItem.slug,
                title: tocItem.title,
                children: itemData.children,
                level: itemData.markup.length - 2
            })
        },
        permalink: anchor.permalink.ariaHidden({
            placement: 'before'
        }),
        level: 2
    })

export default md
