import { build, dev, preview } from "astro"
import vue from "@astrojs/vue"
import { passthroughImageService } from "astro/config"
import compiiile from "./vitePluginCompiiile/index.js"
import mdx from "@astrojs/mdx"
import path from "node:path"
import { copyFileSync, cpSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import markdownConfig from "./vitePluginCompiiile/markdownConfig.js"
import resolvePackagePath from "resolve-package-path"
import requireg from "requireg"
import sitemap from "@astrojs/sitemap"

const source = process.cwd()
process.env.COMPIIILE_SOURCE = source

const CONFIG_FILE = "compiiile.config.js"

import yargs from "yargs/yargs"
import { hideBin } from "yargs/helpers"

import { readFile } from "fs/promises"
const packageJSON = JSON.parse(await readFile(fileURLToPath(new URL("../package.json", import.meta.url))))

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
	.option("port", {
		describe: "Port to use",
		default: 4321
	})
	.option("host", {
		describe: "Host to use",
		default: "127.0.0.1"
	})
	.option("title", {
		describe: "The title to display on the top-left of the User Interface"
	})
	.option("description", {
		describe: "The description that is rendered by default for the SEO"
	})
	.option("logo", {
		describe: "The relative path of the logo to display in the TopBar and as favicon"
	})
	.option("logoUrl", {
		describe: "The url to go to when clicking on the logo, defaults to the home page if not set"
	})
	.option("dest", {
		describe: "The folder in which to build files, defaults to `./.compiiile/dist`"
	})
	.option("siteUrl", {
		describe: "The url of the website in production (without trailing slash), used for the SEO tag `og:image`"
	})
	.option("astroConfig", {
		describe: "Override default Astro config (https://docs.astro.build/en/reference/configuration-reference/)"
	})
	.option("data", {
		describe: "An object with data to use in MDX files"
	})
	.option("theme", {
		describe:
			"The website theme, value can be : `auto` (default value: adapts to system preferences) | `light` | `dark`"
	})
	.option("useAutoTitles", {
		describe:
			"If set to `true`, use the first file heading as title to be displayed in the navbar and for SEO. Defaults to `false`"
	})
	.option("noIndex", {
		describe:
			"If set to `true`, the `robots.txt` file will disallow all routes, preventing indexation. Defaults to `false`"
	})
	.option("publicDir", {
		describe: "The folder name in which you can serve public files, defaults to `public`"
	})
	.option("vite.server.fs.allow", {
		describe: "Add local paths to vite's server fs allow list"
	})
	.help()
	.version(packageJSON.version).argv

process.env.VITE_COMPIIILE_SITE_URL = argv.siteUrl ?? ""
process.env.VITE_COMPIIILE_NO_INDEX = /true/i.test(argv.noIndex) // defaults to `false` if not set or not equal to `true`

process.env.VITE_COMPIIILE_TITLE = argv.title ?? ""
process.env.VITE_COMPIIILE_DESCRIPTION = argv.description ?? ""

process.env.VITE_COMPIIILE_LOGO_URL = argv.logoUrl ?? ""

process.env.VITE_COMPIIILE_THEME = argv.theme ?? "auto"

process.env.VITE_COMPIIILE_DATA = JSON.stringify(argv.data ?? {})
process.env.VITE_COMPIIILE_USE_AUTO_TITLES = /true/i.test(argv.useAutoTitles) // defaults to `false` if not set or not equal to `true`

// Handling logo and favicon
process.env.VITE_COMPIIILE_LOGO = null

const publicDir = path.resolve(source, "./.compiiile/public")

const localPublicDirName = argv.publicDir ?? "public"
const localPublicDir = path.resolve(source, localPublicDirName)
const localPublicDirExists = existsSync(localPublicDir)

const hasPublicFiles = localPublicDirExists || argv.logo
if (hasPublicFiles) {
	cpSync(fileURLToPath(new URL("../.compiiile/public", import.meta.url)), publicDir, { recursive: true })
}

if (localPublicDirExists) {
	cpSync(localPublicDir, publicDir, { recursive: true })
}

if (argv.logo) {
	try {
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
const viteServerFsAllowList = [source, fileURLToPath(new URL("../", import.meta.url)), path.resolve(pathName, "../../")]
const packageDir = await packageDirectory()
if (packageDir) {
	viteServerFsAllowList.push(packageDir)
}

const resolve = (mod) => {
	const resolvedModule = requireg.resolve("vue")
	const packagePath = resolvePackagePath(mod, resolvedModule)
	// Check to work on both Windows (using `\`) and UNIX systems (using `/`)
	return packagePath.slice(
		0,
		packagePath.lastIndexOf("/") < 0 ? packagePath.lastIndexOf("\\") : packagePath.lastIndexOf("/")
	)
}

const astroConfig = {
	server: {
		host: argv.host,
		port: argv.port
	},
	root: fileURLToPath(new URL("../.compiiile", import.meta.url)),
	srcDir: fileURLToPath(new URL("../.compiiile/src", import.meta.url)),
	outDir: path.join(source, argv.dest || ".compiiile/dist"),
	...(hasPublicFiles ? { publicDir } : {}),
	integrations: [
		vue({ appEntrypoint: "/src/app.js" }),
		...(configFromFile.integrations ?? []),
		mdx(),
		...(process.env.VITE_COMPIIILE_SITE_URL ? [sitemap()] : [])
	],
	...(process.env.VITE_COMPIIILE_SITE_URL ? { site: process.env.VITE_COMPIIILE_SITE_URL } : {}),
	vite: {
		plugins: [compiiile()],
		resolve: {
			preserveSymlinks: true,
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
