---
title: "[PRO] Installation"
description: "Compiiile with some spice ! With the pro version, enhance your Markdown files, add diagrams, mindmaps, admonitions, and ready-made components and get your knowledge-base or course ready to be served in one simple command."
---

# Compiiile-pro

Compiiile with some spice :cherries:! With the **_pro_** version, enhance your Markdown files, add diagrams, mindmaps, admonitions, and ready-made components and get your knowledge-base or course ready to be served in one simple command :sparkles:.

## Installation

You can install `compiiile-pro` either globally or per-project:

### Globally

Open a terminal and type one of these commands, whether using [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) depending on which package manager you are using:

```bash
yarn global add @compiiile/compiiile-pro # install globally with yarn
# or
npm install -g @compiiile/compiiile-pro # install globally with npm
```

### Per-project

Open a terminal inside the folder containing your markdown files. Then, add `compiiile-pro` as a local command using yarn or npm:

```bash
yarn add @compiiile/compiiile-pro # install as a project dependency with yarn
# or
npm install @compiiile/compiiile-pro # install as a project dependency with npm
```

## Usage

Once installed, 3 commands are available that act the same as the usual `compiiile` command:

- `compiiile-pro dev`
- `compiiile-pro build`
- `compiiile-pro preview`

## License

Compiiile-pro is free to try in development, but **you need a license to use it in production**. This is a personal **lifetime** license: buy once without any subscription, and enjoy it as long as you want! It also allows you to use compiiile for commercial projects.

<a style="background-color:var(--highlight-color);color:#f7fafc;display:block;text-align:center;border-radius:4px;text-decoration:none;padding:10px;" href="https://compiiile.lemonsqueezy.com/buy/1900be98-a8c2-4aa5-a06e-e0f5f26843b4" target="_blank">Purchase a license for compiiile-pro</a>

Once purchased, you will receive an email with your personal license key.

To use your license for the `build` command, you can use the next following ways (**from higher priority to lower priority**):

### Set it with environment variables

You have 2 environment variables that you can pass to the build command to use your licence: `COMPIIILE_PRO_LICENSE="<YOUR-LICENCE>"` and `COMPIIILE_PRO_EMAIL="<YOUR-EMAIL-USED-FOR-PURCHASE>"`.

Here is the complete command as example:

```bash
COMPIIILE_PRO_LICENSE="XXXX-XXXX-XXXX-XXXX" COMPIIILE_PRO_EMAIL="john.doe@mail.com" compiiile-pro build
```

### Set it as build arguments

Similarly, you have 2 parameters that you can pass to the build command to use your licence: `--pro.license="<YOUR-LICENCE>"` and `--pro.email="<YOUR-EMAIL-USED-FOR-PURCHASE>"`.

Here is the complete command as example:

```bash
compiiile-pro build --pro.license="XXXX-XXXX-XXXX-XXXX" --pro.email="john.doe@mail.com"
```

### Set it globally

To use the same license on multiple projects, you can create a `.compiiilerc` file at the root of your user folder (`~/.compiiilerc`).

Here is the content that you will have to specify:

You can use this one-line command to create this file (make sure to replace the values with the corresponding ones):

```bash
echo 'pro.license=<your-license-key>\npro.email=<your-email>' > ~/.compiiilerc
```

Your file should contain these 2 parameters:

```
pro.license=<your-license-key>
pro.email=<your-email>
```

## Affiliate

You can become an affiliate and earn 20% on each sale by referring new customers (or should we say... _compiiilers ?_):

<a style="background-color:var(--highlight-color);color:#f7fafc;display:block;text-align:center;border-radius:4px;text-decoration:none;padding:10px;" href="https://compiiile.lemonsqueezy.com/affiliates" target="_blank">Become an affiliate</a>

## Added features

Here is a list of features that the pro version adds:

- add a button to copy code blocks and be able to specify the code block file name
- add admonitions (or alerts) with different semantic colors
- use any [Phosphor Icon](https://phosphoricons.com/) in your Markdown files or Vue components
- add [MermaidJs](https://mermaid.js.org/#/) integration to write diagrams in Markdown, without compromising on style
- add [Markmap](https://markmap.js.org/) integration to write mindmaps in Markdown from bullet-points lists
- add [d2](https://d2lang.com/) integration to write diagrams
- use ready-to-use components (for slides layouts, etc) in `mdx` files

See an overview of these features in the next page.
