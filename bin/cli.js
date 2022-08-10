const { createServer, build, preview } = require('vite')

;(async () => {
    const server = await preview({
        configFile: "./bin/client/vite.config.js",
        root: "./bin/client",
        server: {
            port: 3000
        },

        preview: {
            port: 8080,
            open: true
        }
    })

    /*await server.listen()

    server.printUrls()*/
})()
