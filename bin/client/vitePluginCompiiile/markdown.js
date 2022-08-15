import MarkdownIt from "markdown-it"
import meta from "markdown-it-meta"
import emoji from "markdown-it-emoji"
import externalLinks from "markdown-it-external-links"
import anchor from "markdown-it-anchor"

import hljs from "highlight.js"

const {copyFileSync} = require("fs")
const path = require("path")
import { config } from "../config";

const md = new MarkdownIt({
    html: true,
    xhtmlOut: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code>${hljs.highlight(str, {
                    language: lang,
                    ignoreIllegals: true
                }).value}</code></pre>`;
            } catch (__) {
            }
        }

        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
});


// Remember old renderer, if overridden, or proxy to default renderer
var defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // If you are sure other plugins can't add `target` - drop check below
    var aIndex = tokens[idx].attrIndex('target');

    /*console.log("ohohoh")
    console.log(tokens[idx])
    console.log(options)
    console.log(env)
    console.log(self)*/
    if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // add new attribute
    } else {
        tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
};

md.renderer.rules.image = function (tokens, idx, options, env, self) {
    var token = tokens[idx]
    token.attrs[token.attrIndex('alt')][1] = self.renderInlineAsText(token.children, options, env)
    // this is the line of code responsible for an additional 'loading' attribute

    const src = token.attrs[token.attrIndex('src')][1]
    const isLocalAssetRegex = /^\.{1,2}\/.*/
    if (isLocalAssetRegex.test(src)) {
        // Set local assets' src to be well served by vite

        const parentDirectoryPathFromSourceDirectory = self.filePath.substring(0, self.filePath.lastIndexOf("/")) || ".";
        let assetPath = new URL(`../../../${parentDirectoryPathFromSourceDirectory}/${src}`, import.meta.url).pathname
        assetPath = assetPath.replaceAll("%20", " ")

        if(process.env.NODE_ENV === "development"){
            token.attrs[token.attrIndex('src')][1] = `@fs${assetPath}`
        } else if(process.env.NODE_ENV === "production") {
            const publicImagesDirectory = path.resolve(__dirname, `../public/${ config.publicImagesDirectoryName }`)

            const assetPathInfo = path.parse(assetPath)
            const fileName = `${assetPathInfo.name}-${ (+new Date).toString(36) }${assetPathInfo.ext}`

            copyFileSync(assetPath, path.resolve(__dirname, `${publicImagesDirectory}/${fileName}`))
            token.attrs[token.attrIndex('src')][1] = `${config.publicImagesDirectoryName}/${fileName}`
        }
    }


    return self.renderToken(tokens, idx, options)
}

md.toc = []

md.use(meta)
    .use(emoji)
    .use(externalLinks, {
        externalTarget: "_blank"
    })
    .use(anchor, {
        callback(itemData, tocItem) {
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
