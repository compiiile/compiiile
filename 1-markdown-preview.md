---
title: "Markdown preview"
description: Here is how you can write some Markdown and see how it will look on the page thanks to Compiiile.
---

# Markdown preview

> This test file serves as a cheatsheet and markdown preview. It is inspired by the one from the [markdown-here repository](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

:eyes: Here is how you can write some markdown and see how it will look on the page:

## Titles

```md
# H1

## H2

### H3

#### H4

##### H5

###### H6
```

# H1

## H2

### H3

#### H4

##### H5

###### H6

## Emphasis

```md
Emphasis, aka italics, with single asterisks or _underscores_.

Strong emphasis, aka bold, with **asterisks** or double underscores.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~
```

Emphasis, aka italics, with single asterisks or _underscores_.

Strong emphasis, aka bold, with **asterisks** or double underscores.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

## Lists

```md
1. First ordered list item
2. Another item
    - Unordered sub-list.
3. Third item
    1. Ordered sub-list
4. And another item.

    You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

    To have a line break without a paragraph, you will need to use two trailing spaces.
    Note that this line is separate, but within the same paragraph.

-   Unordered list can use asterisks

*   Or minuses

-   Or pluses
```

1. First ordered list item
2. Another item
    - Unordered sub-list.
3. Third item
    1. Ordered sub-list
4. And another item.

    You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

    To have a line break without a paragraph, you will need to use two trailing spaces.
    Note that this line is separate, but within the same paragraph.

-   Unordered list can use asterisks

*   Or minuses

-   Or pluses

## Links

```md
[I'm an inline-style link](https://github.com/AlbanCrepel/compiiile)

[I'm an inline-style link with title](https://github.com/AlbanCrepel/compiiile "Compiiile's Repository")

[I am a cross-reference link](./README.md)

[I am a cross-reference link pointing to an achor](./README.md#support)

URLs and URLs in angle brackets will automatically get turned into links.
https://github.com/AlbanCrepel/compiiile or <https://github.com/AlbanCrepel/compiiile>.
```

[I'm an inline-style link](https://github.com/AlbanCrepel/compiiile)

[I'm an inline-style link with title](https://github.com/AlbanCrepel/compiiile "Compiiile's Repository")

[I am a cross-reference link](./README.md)

[I am a cross-reference link pointing to an achor](./README.md#support)

URLs and URLs in angle brackets will automatically get turned into links.
https://github.com/AlbanCrepel/compiiile or <https://github.com/AlbanCrepel/compiiile>.

## Images

You can specify the title, alt text, and size of any image:

```md
![Favicon alt text|100px](./.compiiile/public/favicon.png "Favicon title")
![Favicon alt text|100px|no-margin](./.compiiile/public/favicon.png "Favicon without margin")
```

![Favicon alt text|100px](./.compiiile/public/favicon.png "Favicon title")

![Favicon alt text|100px|no-margin](./.compiiile/public/favicon.png "Favicon without margin")

## Code and syntax highlight

````
    ```javascript
    var s = "JavaScript syntax highlighting";
    alert(s);
    ```

    ```python
    s = "Python syntax highlighting"
    print s
    ```

    ```
    No language indicated, so no syntax highlighting.
    But let's throw in a <b>tag</b>.
    ```
````

```javascript
var s = "JavaScript syntax highlighting"
alert(s)
```

```python
s = "Python syntax highlighting"
print s
```

```
No language indicated, so no syntax highlighting.
But let's throw in a <b>tag</b>.
```

## Tables

```md
| First column | Second column      |
| ------------ | ------------------ |
| Some content | Some other content |
```

| First column | Second column      |
| ------------ | ------------------ |
| Some content | Some other content |

## Blockquotes

```md
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can _put_ **Markdown** into a blockquote.
```

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can _put_ **Markdown** into a blockquote.

## Emojis

```md
:ok_woman: :zap: :sparkles:
```

:ok_woman: :zap: :sparkles:

## Checkboxes

```md
-   [ ] a todo item
-   [x] I've done this one
```

-   [ ] a todo item
-   [x] I've done this one

## Inline HTML

```md
<ul>
  <li>An html list item</li>
  <li>A second list item</li>
</ul>
```

<ul>
  <li>An html list item</li>
  <li>A second list item</li>
</ul>

## Separators

```md
Three or more Hyphens

---
```

Three or more Hyphens

---
