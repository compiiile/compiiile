#! /usr/bin/env node

import { build, dev, preview } from "astro"
import vue from "@astrojs/vue"
import compiiile from "./vitePluginCompiiile/index.js"
import mdx from "@astrojs/mdx"
import path from "node:path"
import { copyFileSync, cpSync } from "node:fs"
import markdownConfig from "./vitePluginCompiiile/markdownConfig.js"

const source = process.cwd()
process.env.COMPIIILE_SOURCE = source

const CONFIG_FILE = "compiiile.config.js"

import yargs from "yargs/yargs"
import { hideBin } from "yargs/helpers"

/*
 Order of options by priority:
 1. command arguments
 2. user-defined config in dedicated file
 3. default config as fallback
 */
let configFromFile = {}
try {
	configFromFile = (await import(path.join(source, CONFIG_FILE))).default
} catch {
	// This means that no config file was provided: getting parameters from script parameters instead
}

const argv = yargs(hideBin(process.argv))
	.parserConfiguration({
		"deep-merge-config": true
	})
	.config(configFromFile)
	.command("dev", "launch development server")
	.command("build", "build")
	.command("preview", "preview")
	.help().argv

const IS_DEV = argv._.length === 0 || argv._.includes("dev")
const IS_BUILD = argv._.includes("build")
const IS_PREVIEW = argv._.includes("preview")

process.env.VITE_COMPIIILE_SITE_URL = argv.siteUrl ?? ""

process.env.VITE_COMPIIILE_TITLE = argv.title ?? ""
process.env.VITE_COMPIIILE_DESCRIPTION = argv.description ?? ""

// Handling logo and favicon
process.env.VITE_COMPIIILE_LOGO = null

const publicDir = path.resolve(source, "./.compiiile/public")

if (argv.logo) {
	try {
		cpSync(new URL("../.compiiile/public", import.meta.url).pathname, publicDir, { recursive: true })
		copyFileSync(path.resolve(source, argv.logo), path.resolve(publicDir, "favicon.png"))
		// Set the logo to be displayed on the top bar if we were able to copy
		process.env.VITE_COMPIIILE_LOGO = argv.logo
	} catch (e) {
		console.log(e)
		console.error("Could not load provided logo: set a relative url from the current folder")
	}
}

const astroConfig = {
	root: new URL("../.compiiile", import.meta.url).pathname,
	srcDir: new URL("../.compiiile/src", import.meta.url).pathname,
	outDir: path.join(source, argv.dest || ".compiiile/dist"),
	...(argv.logo ? { publicDir } : {}),
	integrations: [
		vue({ appEntrypoint: "/src/app.js" }),
		mdx(),
		...(configFromFile.integrations ?? [])
	],
	vite: {
		plugins: [compiiile()],
		resolve: {
			alias: {
				"@source": source
			}
		}
	},
	markdown: markdownConfig,
	...(configFromFile.astroConfig ?? {})
}

const NODE_ENV_DEVELOPMENT = "development"
const NODE_ENV_PRODUCTION = "production"

if (IS_DEV) {
	process.env.NODE_ENV = NODE_ENV_DEVELOPMENT

	await dev(astroConfig)
} else if (IS_BUILD) {
	process.env.NODE_ENV = NODE_ENV_PRODUCTION

	await build(astroConfig)
} else if (IS_PREVIEW) {
	process.env.NODE_ENV = NODE_ENV_PRODUCTION

	await preview(astroConfig)
}
