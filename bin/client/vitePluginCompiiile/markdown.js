import MarkdownIt from "markdown-it"
import meta from "markdown-it-meta"
import emoji from "markdown-it-emoji"
import externalLinks from "markdown-it-external-links"
import anchor from "markdown-it-anchor"
import checkbox from "markdown-it-task-checkbox"
import imsize from "markdown-it-imsize"

import hljs from "highlight.js"
import {config} from "../config"

const {copyFileSync} = require("fs")
const path = require("path")

const isLocalPathRegex = /^\.{1,2}\/.*/

const md = (new MarkdownIt({
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
                }).value}</code></pre>`
            } catch (__) {
            }
        }

        return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
    }
})).use(imsize)

const resolveFileFromRelativePath = (filePath, relativePath) => {
    const parentDirectoryPathFromSourceDirectory = filePath.substring(0, filePath.lastIndexOf("/")) || "."
    const url = new URL(`../../../${parentDirectoryPathFromSourceDirectory}/${relativePath}`, import.meta.url)

    return {
        path: url.pathname.replaceAll("%20", " "),
        hash: url.hash
    }
}

// Remember old renderer, if overridden, or proxy to default renderer
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
}

// Set local links href to be the correct routes
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    var hrefAttributeIndex = tokens[idx].attrIndex('href')

    const href = tokens[idx].attrs[hrefAttributeIndex][1]

    let file = resolveFileFromRelativePath(self.filePath, href)
    file.path = file.path.replace(process.env.COMPIIILE_SOURCE, "")

    if (isLocalPathRegex.test(href)) {
        tokens[idx].attrs[hrefAttributeIndex][1] = `#/${config.router.workspaceBasePath}${config.router.generateRoutePathFromFilePath(file.path, file.hash)}`
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self)
}

// Set local assets' src to be well served by vite
md.renderer.rules.image = function (tokens, idx, options, env, self) {
    var token = tokens[idx]
    token.attrs[token.attrIndex('alt')][1] = self.renderInlineAsText(token.children, options, env)

    const src = token.attrs[token.attrIndex('src')][1]
    if (isLocalPathRegex.test(src)) {
        let assetPath = resolveFileFromRelativePath(self.filePath, src).path

        if (process.env.NODE_ENV === "development") {
            token.attrs[token.attrIndex('src')][1] = `@fs${assetPath}`
        } else if (process.env.NODE_ENV === "production") {
            const publicImagesDirectory = path.resolve(__dirname, `../public/${config.publicImagesDirectoryName}`)

            const assetPathInfo = path.parse(assetPath)
            const fileName = `${assetPathInfo.name}-${(+new Date).toString(36)}${assetPathInfo.ext}`

            copyFileSync(assetPath, path.resolve(__dirname, `${publicImagesDirectory}/${fileName}`))
            token.attrs[token.attrIndex('src')][1] = `${config.publicImagesDirectoryName}/${fileName}`
        }
    }


    return self.renderToken(tokens, idx, options)
}

md.toc = []

md.use(meta)
    .use(emoji)
    .use(checkbox)
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
