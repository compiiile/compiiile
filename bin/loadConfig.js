import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import yargs from "yargs/yargs"
import { hideBin } from "yargs/helpers"
import path from "node:path"
import { copyFileSync, cpSync, existsSync, rmSync } from "node:fs"
import { loadConfig as loadConfigFile } from "c12"

export const loadConfig = async () => {
	const source = process.cwd()
	process.env.COMPIIILE_SOURCE = source

	const packageJSON = JSON.parse(await readFile(fileURLToPath(new URL("../package.json", import.meta.url))))

	/*
     Order of options by priority:
     1. command arguments
     2. user-defined config in dedicated file
     3. default config as fallback
     */
	let configFromFile = {}
	let compiiileConfig = {}
	try {
		compiiileConfig = await loadConfigFile({
			name: process.env.COMPIIILE_TEMP_CONFIG_NAME || "compiiile",
			cwd: process.env.COMPIIILE_TEMP_DIR || source
		})
		configFromFile = { ...compiiileConfig.config }
		if (!process.env.COMPIIILE_CONFIG_FILE) {
			process.env.COMPIIILE_CONFIG_FILE = compiiileConfig.configFile
		}
	} catch {
		// This means that no config file was provided: getting parameters from script parameters instead
	}

	if (process.env.COMPIIILE_TEMP_DIR) {
		rmSync(process.env.COMPIIILE_TEMP_DIR, { recursive: true, force: true })
	}

	if (!configFromFile.astroConfig?.base) {
		if (!configFromFile.astroConfig) {
			configFromFile.astroConfig = {}
		}

		configFromFile.astroConfig.base = "/"
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
		.option("printReady", {
			describe: "Add a /print page to display a full ready-to-print content (uses @compiiile/compiiile-print)"
		})
		.help()
		.version(packageJSON.version).argv

	process.env.VITE_COMPIIILE_SITE_URL = argv.siteUrl ?? ""
	process.env.VITE_COMPIIILE_NO_INDEX = /true/i.test(argv.noIndex) // defaults to `false` if not set or not equal to `true`

	process.env.VITE_COMPIIILE_TITLE = argv.title ?? ""
	process.env.VITE_COMPIIILE_DESCRIPTION = argv.description ?? ""

	process.env.VITE_COMPIIILE_LOGO_URL = argv.logoUrl ?? ""

	process.env.VITE_COMPIIILE_THEME = argv.theme ?? "auto"

	process.env.VITE_COMPIIILE_DATA = typeof argv.data === "string" ? argv.data : JSON.stringify(argv.data ?? {})
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

	const localIntegrations = []

	if (/true/i.test(argv.printReady)) {
		const compiiilePrintIntegration = (await import("@compiiile/compiiile-print")).default
		localIntegrations.push(compiiilePrintIntegration())
	}

	process.env.VITE_COMPIIILE_BASE = argv.astroConfig.base
	if (process.env.VITE_COMPIIILE_BASE !== "/" && process.env.VITE_COMPIIILE_BASE.endsWith("/")) {
		process.env.VITE_COMPIIILE_BASE = process.env.VITE_COMPIIILE_BASE.slice(0, -1)
	}

	return {
		argv,
		localIntegrations,
		configFromFile,
		source,
		hasPublicFiles,
		publicDir
	}
}
