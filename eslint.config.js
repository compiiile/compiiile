import js from "@eslint/js"
import pluginVue from "eslint-plugin-vue"
import pluginPrettier from "eslint-config-prettier"
import globals from "globals"
import { includeIgnoreFile } from "@eslint/compat"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")

export default [
	js.configs.recommended,
	...pluginVue.configs["flat/base"],
	...pluginVue.configs["flat/recommended"],
	pluginPrettier,
	includeIgnoreFile(gitignorePath),
	{
		files: ["**/*.js", "**/*.vue", "**/*.ts"],
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest",
				parser: "@babel/eslint-parser",
				requireConfigFile: false,
				sourceType: "module",
				babelOptions: {
					parserOpts: {
						plugins: ["jsx", "flow"]
					}
				}
			},
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			"vue/no-v-html": 0,
			"no-unused-vars": ["error", { caughtErrors: "none" }]
		}
	}
]
