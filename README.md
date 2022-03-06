# Compiiile

> Compiiile is the most convenient way to render a folder of markdown files. Previewing and searching markdown files
has never been that easy (I mean, it's just a command away ! :zap:)

## Purpose

I document everything in markdown and have always been frustrated not having a simple tool to just preview a whole
folder, being able to search through it, and get a production-ready build of all the files as a knowledge base. On
top of that, finding a tool with a sweet and simple UI is not that easy.

That's what compiiile does. And it does it hassle-free ! :ok_woman:

## Features

- 📦 No config required, everything just works out of the box, without changing your files
- :link: Quick access to your files via the navbar and links to the previous and next file
- :tv: Display some files as slides
- :mag: Quick search with content preview
- :bulb: Can serve as knowledge base
- :rainbow: A light and a dark theme, that can be customized
- :lock: Basic auth available with 2 environment variables
- :wrench: Customizable by env variables or config file, it's up to you
- :star2: You get it, it simply does the job, period.

> Compiiile is based on [vuepress 2](https://github.com/vuepress/vuepress-next) coupled with [vitejs](https://github.com/vitejs/vite)

## Preview

DEMO link + gif

## Installation

You can install compiiile either globally or per-project:

```bash
yarn global add compiiile # install globally with yarn
# or
npm install -g compiiile # install globally with npm

yarn add compiiile # install as a project dependency with yarn
# or
npm install compiiile # install as a project dependency with npm
```

## Usage

Once installed, 3 commands are available to see your beautiful markdown files :eyes: :

- `compiiile dev` : creates a web server with hot reload to check your markdown files
- `compiiile build` : builds all the files for you to serve them production-ready
- `compiiile preview` : builds the files and preview your production-ready build

To use these commands inside a project, you just have to add these commands to the `scripts` section of your
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

## Write some markdown (compiiile-specific parameters)

The goal of this project is to get it running **without changing any markdown files already written**.

### Slides

To make a file usable as slides, you only have to add this parameter to the `frontmatter` of your markdown
file:

```md
---
asSlides: true
---
```

If you are not acquainted with frontmatter, it's just some file-specific parameters that you can put at the very
beginning of your file to be processed.

By adding the frontmatter parameter, you will see a link : `View in presentation mode` at the top of your page in
compiiile opens a new page with your slides.

To separate your slides, just separate the content of your markdown with:
```md

---

```

> There must be an empty line before and after the `---`

This feature uses [reveal.js](https://revealjs.com/).

### Routing

The home page of compiiile (`/`) points to a `README.md` file located at the root of your folder.

## Custom configuration

As said earlier, compiiile uses vuepress 2.
You can find vuepress config parameters [here](https://v2.vuepress.vuejs.org/reference/config.html).
You can override the vuepress config in 2 ways :

### Script arguments

Vuepress config parameters can be passed by script arguments.

For example, if you want to change the title, just run compiiile like so:

```bash
compiiile dev --title="My knowledge base 🚀"
```

> ⚠️ This doesn't work for things that should be parsed like arrays. In that case, use the config file to set
parameters.

For nested parameters, you can use the dot notation.

### Config file

Another way to set vuepress config parameters is to set them in a dedicated file named `compiiile.config.js` in the
root of your folder.

This should export an object, like in this example that shows common use cases :

```js
module.exports = {
    // Setting the title
    title: "Compiiile",
    // Setting the favicon
    head: [['link', { rel: 'icon', href: '/favicon.svg' }]],
    // Using a custom css file to override styles
    plugins: [
        [
            '@vuepress/plugin-palette',
            {
                userPaletteFile: "./custom-style.css"
            },
        ],
    ]
}
```

> ⚠️ You should bear in mind that script arguments have priority over config file parameters.

## Directory structure

When running compiiile in a project folder, it creates a `.compiiile` folder at the root of your project.

Built files are located in `.compiiile/dist`. You can override this by changing the `dest` parameter:

```bash
compiiile build --dest="./custom-dist"
```

You can put your public files il the `compiiile/public` folder (create it if needed).

For example, you can set the favicon by placing your file in the public directory and change vuepress' `head`
parameter :

```js
// compiiile.config.js
module.exports = {
    head: [['link', { rel: 'icon', href: '/favicon.png' }]]
}
```

And do the same for the logo display in the top bar (this time, using script arguments):

```bash
compiiile dev --themeConfig.logo="/favicon.png"
```

## Environment variables

TODO:
-> Clean du code
-> demo
-> 404 page
-> change contributing link + créer discussions tags dans github
-> credentials not working in prod !
-> export vuepress config + express ?
Env variables (expliquer vercel payant)


Markdown d'exemple

What comes next : config file (color, dest, meta tags ?...), sort files in navbar

Support open source work -> sponsor

Exemple de github CI ?

What it is, what it's not (not a markdown editor)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Support

## Licence

This project is licensed under the terms of the GNU General Public License v3.0.

See [LICENCE.md](./LICENSE.md).
