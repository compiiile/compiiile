import { build, dev, preview } from "astro"
import vue from "@astrojs/vue"
import { passthroughImageService } from "astro/config"
import compiiile from "./vitePluginCompiiile/index.js"
import mdx from "@astrojs/mdx"
import path from "node:path"
import { fileURLToPath } from "node:url"
import markdownConfig from "./vitePluginCompiiile/markdownConfig.js"
import sitemap from "@astrojs/sitemap"

// Making sure fonts are accessible by vite's server
import { createRequire } from "node:module"
import { packageDirectory } from "package-directory"

import { loadConfig } from "./loadConfig.js"

const { argv, localIntegrations, configFromFile, source, hasPublicFiles, publicDir } = await loadConfig()

// Get command and set env
const IS_DEV = argv._.length === 0 || argv._.includes("dev")
const IS_BUILD = argv._.includes("build")
const IS_PREVIEW = argv._.includes("preview")

const NODE_ENV_DEVELOPMENT = "development"
const NODE_ENV_PRODUCTION = "production"
if (IS_DEV) {
	process.env.NODE_ENV = NODE_ENV_DEVELOPMENT
} else if (IS_BUILD || IS_PREVIEW) {
	process.env.NODE_ENV = NODE_ENV_PRODUCTION
}

const require = createRequire(import.meta.url)
const pathName = require.resolve("@fontsource-variable/archivo")

const viteServerFsAllowList = [source, fileURLToPath(new URL("../", import.meta.url)), path.resolve(pathName, "../../")]
const packageDir = await packageDirectory()
if (packageDir) {
	viteServerFsAllowList.push(packageDir)
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
		...(localIntegrations ?? []),
		mdx(),
		...(process.env.VITE_COMPIIILE_SITE_URL ? [sitemap()] : []),
		{
			name: "include-dependencies",
			hooks: {
				"astro:build:setup": ({ vite }) => {
					vite.ssr.noExternal.push(
						"kleur",
						"clsx",
						"vue",
						"@vue/compiler-dom",
						"@vue/compiler-core",
						"@vue/shared",
						"@babel/parser",
						"estree-walker",
						"source-map-js",
						"@vue/runtime-dom",
						"@vue/runtime-core",
						"@vue/reactivity",
						"@vue/server-renderer",
						"@vue/compiler-ssr",
						"html-escaper",
						"@oslojs/encoding",
						"cssesc",
						"fzf",
						"@astrojs/internal-helpers",
						"mrmime",
						"zod",
						"entities"
					)
				}
			}
		}
	],
	...(process.env.VITE_COMPIIILE_SITE_URL ? { site: process.env.VITE_COMPIIILE_SITE_URL } : {}),
	vite: {
		plugins: [compiiile()],
		resolve: {
			preserveSymlinks: true,
			alias: {
				"@source": source
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
	...(configFromFile.astroConfig ?? {}),
	...(argv.astroConfig ?? {})
}

const run = async (astroConfig) => {
	if (IS_DEV) {
		const devServer = await dev(astroConfig)
		devServer.watcher.add([source])
		return devServer
	} else if (IS_BUILD) {
		return await build(astroConfig)
	} else if (IS_PREVIEW) {
		return await preview(astroConfig)
	}
}

export { astroConfig, run, argv }
