#! /usr/bin/env node

const { createServer, build, preview } = require('vite')
const {readdirSync, rmSync, mkdirSync, existsSync} = require("fs")
const path = require("path")
const { config } = require("./client/config")

const source = process.cwd()
const DEST_FOLDER = '.compiiile'
const CONFIG_FILE = 'compiiile.config.js'

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const devCommandDescription = "launch development server"

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
        configFile: "./bin/client/vite.config.js",
        root: "./bin/client",
        server: {
            port: 3000
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

    if(IS_DEV){
        process.env.NODE_ENV = "development"

        const server = await createServer(viteConfig)

        await server.listen()

        server.printUrls()
    } else if(IS_BUILD) {
        const publicImagesDirectory = path.resolve(__dirname, `./client/public/${ config.publicImagesDirectoryName }`)
        if(existsSync(publicImagesDirectory)){
            readdirSync(publicImagesDirectory).forEach(f => rmSync(`${publicImagesDirectory}/${f}`));
        } else {
            mkdirSync(publicImagesDirectory);
        }

        await build(viteConfig)
    } else if(IS_PREVIEW){
        await preview(viteConfig)
    }
})()
