const { createServer } = require('vite')

;(async () => {
    const server = await createServer({
        configFile: "./bin/client/vite.config.js",
        root: "./bin/client",
        server: {
            port: 3000
        }
    })
    await server.listen()

    server.printUrls()
})()
