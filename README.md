# Compiiile

> Compiiile is the most convenient way to render a folder containing markdown files. Previewing and searching markdown files has never been that easy (it's really just a command away !) :sparkles:

## Preview

![Demo](https://i.imgur.com/nCZlWDE.gif)

> Check the live demo here: https://compiiile.me/

## Purpose

I document everything in markdown and have always been frustrated not having a simple tool to just **preview** a whole
folder, being able to **search** through it, make **slides** out of it, and get a **production-ready** build of all the files as a knowledge base. On
top of that, finding a tool with a sweet and simple UI is not that easy.

That's what Compiiile does. And it does it hassle-free !

## Features

-   [x] 📦 **No config required, everything just works out of the box, without changing your files** (resolves images and relative links (cross-references), print-ready rendering)
-   [x] 🌱 Available everywhere with static files deployment: just host it somewhere and access it in any browser on your computer, phone or whatever you are using
-   [x] :link: Quick access to your files via the navbar and links to the previous and next file (with table of content generation)
-   [x] :tv: Display some files as slides
-   [x] :mag: **Full-text quick search with content preview**
-   [x] :zap: Hot-reload content preview as you edit it
-   [x] :tada: Supports MDX files
-   [x] :bulb: Can serve as knowledge base
-   [x] :wrench: Customizable by env variables or config file, it's up to you
-   [x] :star2: You get it, it simply does the job, period.

### What Compiiile isn't

-   It's not a markdown editor, there are already plenty available, just choose the one that works best for you, even the simplest text editor will do.
-   It's not like VuePress, VitePress, Docusaurus or Notion. Compiiile's goal is to stay simple and stupidly easy without any configuration.

> The goal is to help people rely purely on a **language** (_markdown_), not on _any_ platform.

## Installation

You can install Compiiile either globally or per-project:

### Globally

Open a terminal and type one of these commands, whether using [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) depending on which package manager you are using:

```bash
yarn global add @compiiile/compiiile # install globally with yarn
# or
npm install -g @compiiile/compiiile # install globally with npm
```

### Per-project

Open a terminal inside the folder containing your markdown files. Then, add Compiiile as a local command using yarn or npm:

```bash
yarn add @compiiile/compiiile # install as a project dependency with yarn
# or
npm install @compiiile/compiiile # install as a project dependency with npm
```

## Quick start

To make yourself an idea and quickly get started using Compiiile, here are some commands that you can run in your terminal to get Compiiile running with a couple of markdown files as tests:

```bash
mkdir test-compiiile && cd test-compiiile # creating a new folder and go into this folder
yarn global add @compiiile/compiiile # installing compiiile as global dependency using yarn
echo '# Test Compiiile\n\n> Here is a blockquote for you\n\n## Your markdown awaits below' > README.md # a first test file
echo '---\nasSlides: true\n---\n\n# Slide 1\n\n---\n\n# And this is slide 2' > slides.md # a second test file as slides
compiiile --title="📚 Compiiile" # running Compiiile for these 2 files
```

Et voilà, you should be able to preview your files in your browser :tada:.

## Usage

Once installed, 3 commands are available to see your beautiful markdown files :eyes::

-   `compiiile dev` : creates a web server to check your markdown files (alias to only `compiiile`)
-   `compiiile build` : builds all the files for you to serve them production-ready
-   `compiiile preview` : preview your production-ready build

You can run the command you want in your terminal while being in the desired folder.

To use these commands inside a javascript project, you just have to add these commands to the `scripts` section of your
`package.json` file like so:

```json
{
	"scripts": {
		"dev": "compiiile dev",
		"build": "compiiile build",
		"preview": "compiiile preview"
	}
}
```

You can run these scripts by running `yarn <script>` or `npm run <script>` in your terminal (replacing `<script>`
with your script name).

The build command builds your files in a `.compiiile/dist` folder at the root of your current directory by default.
You can override this parameter (see below on how to use a custom configuration).

## Write some markdown (Compiiile-specific parameters)

The goal of this project is to get it running **without changing any markdown files already written**.
Yet, there are some things to consider to configure some files:

### Slides

To make a file usable as slides, you only have to add this parameter to the `frontmatter` of your markdown
file:

```md
---
asSlides: true
---
```

If you are not acquainted with frontmatter, it's just some file-specific parameters that you can put at the very
beginning of your file to be processed (make sure to separate frontmatter values from your content with an empty line after the last `---`).

By adding the frontmatter parameter, the page will directly open up as slides.

To separate your slides, just separate the content of your markdown with:

```md
---
```

> There must be an empty line before and after the `---`

:star2: You can make your slides print-ready by adding the `print-pdf` query parameter to your page, like: `https://compiiile.me/s/slides-preview?print-pdf`.

Other frontmatter keys are handled:

-   `title`: set the title to be displayed in the navbar and for SEO
-   `description`: set the description for SEO
-   `textAlign`: possible values are [CSS text-align values](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align) (`left`, `center`, ...). This changes the default text alignment in slides. The default value is `center`.

### Routing

The home page of Compiiile (`/`) points to a `README.md` file located at the root of your folder.

## Custom configuration

Here is the list of parameters that you can set to customize Compiiile (none are required):

| Parameter              | Type       | Description                                                                                     |
| ---------------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| `title`                | `string`   | The title to display on the top-left of the User Interface                                      |
| `description`          | `string`   | The description that is rendered by default for the SEO                                         |
| `logo`                 | `string`   | The relative path of the logo to display in the TopBar and as favicon                           |
| `logoUrl`              | `string`   | The url to go to when clicking on the logo, defaults to the home page if not set                |
| `dest`                 | `string`   | The folder in which to build files, defaults to `./.compiiile/dist`                             |
| `siteUrl`              | `string`   | The url of the website in production (without trailing slash), used for the SEO tag `og:image`  |
| `astroConfig`          | `Object`   | Override [default Astro config](https://docs.astro.build/en/reference/configuration-reference/) |
| `data`                 | `Object`   | An object with data to use in MDX files (check use case below)                                  |
| `vite.server.fs.allow` | `string[]` | Add local paths to vite's server fs allow list                                                  |

You can use these parameters in 2 ways:

### Script arguments

Config parameters can be passed by script arguments.

For example, if you want to change the title, just run Compiiile like so:

```bash
compiiile dev --title="My knowledge base 📚"
```

### Config file

Another way to set default config parameters is to set them in a dedicated file named `compiiile.config.js` in the
root of your folder.

This should export an object, like in this example that shows common use cases :

```js
export default {
	title: "Compiiile",
	logo: "./my-logo.png",
	dest: "my-custom-build-folder"
}
```

> ⚠️ You should bear in mind that script arguments have priority over config file parameters.

## Use MDX

v2 of Compiiile allows you to use MDX files with Vue components.

For it to work, you should install some dependencies in your project folder: `yarn add vue astro fzf` (or `npm install vue astro fzf`).

### Using components

Let's say we have Vue a component `Test.vue` making an API request and listing results:

```vue
<template>
	<div>
		<h2>Random users fetched from an API:</h2>
		<ul>
			<li v-for="user in users">
				{{ user.name.first }} <span class="uppercase">{{ user.name.last }}</span>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: "Test",
		data() {
			return {
				users: []
			}
		},
		methods: {
			async loadUsers() {
				const res = await fetch("https://randomuser.me/api/?results=10")
				this.users = (await res.json()).results
			}
		},
		async mounted() {
			await this.loadUsers()
		}
	}
</script>

<style scoped>
	.uppercase {
		text-transform: uppercase;
	}
</style>
```

You can use it your MDX file like so:

```mdx
import Test from "./Test.vue"

<Test client:load />
```

You should use [Astro's client directives](https://docs.astro.build/en/reference/directives-reference/#client-directives) to load your component's script.

### Use config data values

To use config values, you can access it by importing the `site` variable in your MDX file and then access the `data` key:

```mdx
import { site } from "virtual:compiiile"

# {site.data.someProperty}
```

## Common issues

-   Make sure that the absolute path to the folder where you are running Compiiile doesn't contain any special character as it could prevent the project initialization.

## Special thanks

-   [Astro](https://github.com/withastro/astro) for enabling us developers to make lightweight websites
-   [fzf-for-js](https://github.com/ajitid/fzf-for-js) for the search feature
-   [reveal.js](https://revealjs.com/) for displaying markdown files as slides
-   [Vite](https://vitejs.dev/) for helping modern frontend developers keep their mental health sane :heart:

## Contributing

Contributions are welcome after discussing the object of your contribution in the `Issues` pages (because the goal is to keep this project really simple and straightforward).

You can read more about it and the roadmap in the [dedicated contributing guide](./CONTRIBUTING.md).

## Community projects

Here is a list of projects related to Compiiile developed by the community:

-   [compiiile-actions-cloudflare-pages](https://github.com/marketplace/actions/compiiile-cloudflare-pages): A simple GitHub action to deploy a Compiiile site to CloudFlare pages

## Support

Open-source is a wonderful thing, so please if you found this project useful or use it as a part of a commercial project, **consider making a donation**.
You can do it either via [GitHub donations](https://github.com/sponsors/AlbanCrepel) or via [my ko-fi page](https://ko-fi.com/alban_crepel) where you can make a one-time or monthly donation by PayPal or card.
This allows you to use Compiiile as a **pay-what-you-want** service if you are not part of a non-profit project. But if you are **making any revenue** using this project or even use it as a trainer, **making a donation would be expected**.
You can always contact me for a custom use of this project and any licence issue.

Thank you :heart:

## Licence

This project is licensed under the terms of the GNU General Public License v3.0.

See [LICENCE.md](./LICENCE.md).
