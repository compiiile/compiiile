module.exports = {
	env: {
		node: true
	},
	parserOptions: {
		ecmaVersion: 12,
		parser: "@babel/eslint-parser",
		requireConfigFile: false,
		sourceType: "module"
	},
	extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
	rules: {
		"vue/no-v-html": 0
	}
}
