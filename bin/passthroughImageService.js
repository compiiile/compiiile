export default {
    validateOptions(options) {
        if (!options.format && typeof options.src === "object") {
            options.format = options.src.format
        }
        return options
    },
    getURL(options) {
        return typeof options.src === "string" ? options.src : options.src.src
    },
    parseURL(url) {
        return { src: url.searchParams.get("href") }
    },
    getHTMLAttributes(options) {
        const { src, format, quality, widths, densities, ...attrs } = options
        return { ...attrs, loading: options.loading ?? "lazy", decoding: options.decoding ?? "async" }
    },
    async transform(inputBuffer, transformOptions) {
        return { data: inputBuffer, format: transformOptions.format }
    },
    propertiesToHash: ["src"]
}
