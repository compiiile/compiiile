import MarkdownIt from "markdown-it"
import meta from "markdown-it-meta"
import emoji from "markdown-it-emoji"
import externalLinks from "markdown-it-external-links"
import hljs from "highlight.js"

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

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});

md.use(meta)
    .use(emoji)
    .use(externalLinks, {
        externalTarget: "_blank"
    })

export default md
