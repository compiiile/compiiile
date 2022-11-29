# Compiiile

> Compiiile is the most convenient way to render a folder of markdown files. Previewing and searching markdown files
has never been that easy (I mean, it's just a command away ! :zap:)

## Purpose

I document everything in markdown and have always been frustrated not having a simple tool to just preview a whole
folder, being able to search through it, and get a production-ready build of all the files as a knowledge base. On
top of that, finding a tool with a sweet and simple UI is not that easy.

That's what compiiile does. And it does it hassle-free ! :ok_woman:

## Features

- [x] 📦 No config required, everything just works out of the box, without changing your files
- [x] :link: Quick access to your files via the navbar and links to the previous and next file
- [x] :tv: Display some files as slides
- [x] :mag: Quick search with content preview
- [x] :bulb: Can serve as knowledge base
- [x] :wrench: Customizable by env variables or config file, it's up to you
- [x] :star2: You get it, it simply does the job, period.

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

- `compiiile dev` : creates a web server to check your markdown files
- `compiiile build` : builds all the files for you to serve them production-ready
- `compiiile preview` : preview your production-ready build

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

By adding the frontmatter parameter, the page will directly open up as slides.

To separate your slides, just separate the content of your markdown with:

```md

---

```

> There must be an empty line before and after the `---`

This feature uses [reveal.js](https://revealjs.com/).

### Routing

The home page of compiiile (`/`) points to a `README.md` file located at the root of your folder.

## Custom configuration

You can override the default config in 2 ways :

### Script arguments

Config parameters can be passed by script arguments.

For example, if you want to change the title, just run compiiile like so:

```bash
compiiile dev --title="My knowledge base 🚀"
```

### Config file

Another way to set default config parameters is to set them in a dedicated file named `compiiile.config.js` in the
root of your folder.

This should export an object, like in this example that shows common use cases :

```js
module.exports = {
    // Setting the title
    title: "Compiiile"
}
```

> ⚠️ You should bear in mind that script arguments have priority over config file parameters.

## Directory structure

When running compiiile in a project folder, it creates a `.compiiile` folder at the root of your project.

Built files are located in `.compiiile/dist`. You can override this by changing the `dest` parameter:

```bash
compiiile build --dest="./custom-dist"
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




TODO:
Update dependencies
hamburger
logo + title
SEO
Marketing messages
theme switcher
css external
thanking libs
What it is, what it isn't (vuepress / vitepress, docusaurus)
GIF
git flow + npm
