import { build, dev, preview } from "astro"
import vue from "@astrojs/vue"
import { passthroughImageService } from "astro/config"
import compiiile from "./vitePluginCompiiile/index.js"
import mdx from "@astrojs/mdx"
import path from "node:path"
import { copyFileSync, cpSync } from "node:fs"
import markdownConfig from "./vitePluginCompiiile/markdownConfig.js"
import resolvePackagePath from "resolve-package-path"
import requireg from "requireg"

const source = process.cwd()
process.env.COMPIIILE_SOURCE = source

const CONFIG_FILE = "compiiile.config.js"

import yargs from "yargs/yargs"
import { hideBin } from "yargs/helpers"

import { readFile } from "fs/promises"
const packageJSON = JSON.parse(await readFile(new URL("../package.json", import.meta.url)))

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
	.alias("v", "version")
	.config(configFromFile)
	.command("dev", "launch development server")
	.command("build", "build")
	.command("preview", "preview")
	.help()
	.version(packageJSON.version).argv

process.env.VITE_COMPIIILE_SITE_URL = argv.siteUrl ?? ""

process.env.VITE_COMPIIILE_TITLE = argv.title ?? ""
process.env.VITE_COMPIIILE_DESCRIPTION = argv.description ?? ""

process.env.VITE_COMPIIILE_LOGO_URL = argv.logoUrl ?? ""

process.env.VITE_COMPIIILE_THEME = argv.theme ?? "auto"

process.env.VITE_COMPIIILE_DATA = JSON.stringify(argv.data ?? {})
process.env.VITE_COMPIIILE_USE_AUTO_TITLES = /true/i.test(argv.useAutoTitles) // defaults to `false` if not set or not equal to `true`

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

// Making sure fonts are accessible by vite's server
import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
const pathName = require.resolve("@fontsource-variable/archivo")
import { packageDirectory } from "pkg-dir"
const viteServerFsAllowList = [source, new URL("../", import.meta.url).pathname, path.resolve(pathName, "../../")]
const packageDir = await packageDirectory()
if (packageDir) {
	viteServerFsAllowList.push(packageDir)
}

const resolve = (mod) => {
	const resolvedModule = requireg.resolve("vue")
	const packagePath = resolvePackagePath(mod, resolvedModule)
	return packagePath.slice(0, packagePath.lastIndexOf("/"))
}

const astroConfig = {
	root: new URL("../.compiiile", import.meta.url).pathname,
	srcDir: new URL("../.compiiile/src", import.meta.url).pathname,
	outDir: path.join(source, argv.dest || ".compiiile/dist"),
	...(argv.logo ? { publicDir } : {}),
	integrations: [vue({ appEntrypoint: "/src/app.js" }), ...(configFromFile.integrations ?? []), mdx()],
	vite: {
		plugins: [compiiile()],
		resolve: {
			alias: {
				"@source": source,

				// Adding aliases for Compiiile's build command to work when installed globally
				vue: resolve("vue"),
				"@vue/server-renderer": resolve("@vue/server-renderer"),
				"@vue/runtime-dom": resolve("@vue/runtime-dom"),
				"@vue/runtime-core": resolve("@vue/runtime-core"),
				kleur: resolve("kleur"),
				clsx: resolve("clsx"),
				"html-escaper": resolve("html-escaper"),
				cssesc: resolve("cssesc"),
				"@vue/reactivity": resolve("@vue/reactivity"),
				"@vue/shared": resolve("@vue/shared"),
				fzf: resolve("fzf"),
				"@astrojs/internal-helpers": resolve("@astrojs/internal-helpers") + "/dist"
			}
		},
		server: {
			fs: {
				allow: [...viteServerFsAllowList, ...(configFromFile["vite.server.fs.allow"] ?? [])]
			}
		}
	},
	markdown: markdownConfig,
	output: "static",
	base: "/",
	trailingSlash: "never",
	devToolbar: {
		enabled: false
	},
	image: {
		service: passthroughImageService()
	},
	...(configFromFile.astroConfig ?? {})
}

process.env.VITE_COMPIIILE_BASE = astroConfig.base
if (process.env.VITE_COMPIIILE_BASE !== "/" && process.env.VITE_COMPIIILE_BASE.endsWith("/")) {
	process.env.VITE_COMPIIILE_BASE = process.env.VITE_COMPIIILE_BASE.slice(0, -1)
}

const run = async (astroConfig) => {
	const IS_DEV = argv._.length === 0 || argv._.includes("dev")
	const IS_BUILD = argv._.includes("build")
	const IS_PREVIEW = argv._.includes("preview")

	const NODE_ENV_DEVELOPMENT = "development"
	const NODE_ENV_PRODUCTION = "production"
	if (IS_DEV) {
		process.env.NODE_ENV = NODE_ENV_DEVELOPMENT

		const devServer = await dev(astroConfig)
		devServer.watcher.add([source])
		return devServer
	} else if (IS_BUILD) {
		process.env.NODE_ENV = NODE_ENV_PRODUCTION

		return await build(astroConfig)
	} else if (IS_PREVIEW) {
		process.env.NODE_ENV = NODE_ENV_PRODUCTION

		return await preview(astroConfig)
	}
}

export { astroConfig, run }
