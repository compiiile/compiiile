#! /usr/bin/env node

const {createServer, build, preview} = require('vite')
const {readdirSync, rmSync, mkdirSync, existsSync, copyFileSync} = require("fs")
const path = require("path")
const {config} = require("./client/config")
const dns = require('dns')
const source = process.cwd()
const DEST_FOLDER = '.compiiile'
const CONFIG_FILE = 'compiiile.config.js'

const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')

const devCommandDescription = "launch development server"

// This allows us to serve to localhost by default instead of 127.0.0.1
dns.setDefaultResultOrder('verbatim')

/*
 Order of options by priority:
 1. command arguments
 2. user-defined config in dedicated file
 3. default config as fallback
 */
const argv = yargs(hideBin(process.argv))
    .parserConfiguration({
        'deep-merge-config': true
    })
    .config({
        extends: path.join(source, CONFIG_FILE)
    })
    .config({
        dest: `${DEST_FOLDER}/dist`,
    })
    .command("dev", devCommandDescription)
    .command("build", "build")
    .command("preview", "preview")
    .help()
    .argv


const IS_DEV = argv._.length === 0 || argv._.includes('dev')
const IS_BUILD = argv._.includes('build')
const IS_PREVIEW = argv._.includes('preview')


;(async () => {
    process.env.COMPIIILE_SOURCE = source

    const viteConfig = {
        configFile: path.resolve(__dirname, "client/vite.config.js"),
        root: path.resolve(__dirname, "client"),
        server: {
            port: 3000,
            host: 'localhost'
        },

        build: {
            outDir: path.join(source, argv.dest),
            emptyOutDir: true
        },

        preview: {
            port: 8080,
            open: true
        }
    }

    process.env.VITE_COMPIIILE_SITE_URL = argv.siteUrl ?? ''

    process.env.VITE_COMPIIILE_TITLE = argv.title ?? ''
    process.env.VITE_COMPIIILE_DESCRIPTION = argv.description ?? ''

    // Handling logo and favicon
    process.env.VITE_COMPIIILE_LOGO = null
    if(argv.logo)  {
        try {
            copyFileSync(path.resolve(source, argv.logo), path.resolve(__dirname, "./client/public/favicon.png"))
            // Set the logo to be displayed on the top bar if we were able to copy
            process.env.VITE_COMPIIILE_LOGO = argv.logo
        } catch (e) {
            console.log(e)
            console.error("Could not load provided logo: set a relative url from the current folder")
        }
    } else {
        // Using default favicon if a logo is not provided
        copyFileSync(path.resolve(__dirname, "./client/src/assets/logo.png"), path.resolve(__dirname, "./client/public/favicon.png"))
    }


    if (IS_DEV) {
        process.env.NODE_ENV = "development"

        const server = await createServer(viteConfig)

        await server.listen()

        server.printUrls()
    } else if (IS_BUILD) {
        process.env.NODE_ENV = "production"

        const publicImagesDirectory = path.resolve(__dirname, `./client/public/${config.publicImagesDirectoryName}`)
        if (existsSync(publicImagesDirectory)) {
            readdirSync(publicImagesDirectory).forEach(f => rmSync(`${publicImagesDirectory}/${f}`))
        } else {
            mkdirSync(publicImagesDirectory)
        }

        await build(viteConfig)
    } else if (IS_PREVIEW) {
        process.env.NODE_ENV = "production"

        await preview(viteConfig)
    }
})()
