const { createServer, build, preview } = require('vite')
const {readdirSync, rmSync, mkdirSync, existsSync} = require("fs")
const path = require("path")
const { config } = require("./client/config")

;(async () => {
    //@TODO only if production
    const publicImagesDirectory = path.resolve(__dirname, `./client/public/${ config.publicImagesDirectoryName }`)
    if(existsSync(publicImagesDirectory)){
        readdirSync(publicImagesDirectory).forEach(f => rmSync(`${publicImagesDirectory}/${f}`));
    } else {
        mkdirSync(publicImagesDirectory);
    }

    process.env.NODE_ENV = "development"
    process.env.COMPIIILE_SOURCE = process.cwd()

    const server = await createServer({
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

    await server.listen()

    server.printUrls()
})()
