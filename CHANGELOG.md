# Changelog

## Upgrading from v1 to v2

v2 now uses Astro under the hood !

**:fire: New features**:

- :tada: Added MDX support
- :zap: Added Hot Reload support

**:wrench: Fix**:

- No more Markdown markup on search results

**:warning: Breaking changes**:

- Config file should now use ESM syntax:
  The file should use `export default {}` instead of `module.exports = {}`
- No more route hash:
  What was before `https://compiiile.me/#/c/markdown-preview` is now `https://compiiile.me/c/markdown-preview`
- No more dynamic section hash on page scroll
- Images size use a new syntax:
  The new syntax must be in the image's `alt` attribute, preceded by a `pipe`: `![Alt text|100px](imageUrl)` (the value can be in `px` or `%` and represents the image's width).
  If no margin must be applied, a special attribute can be added like so: `![Alt text|100px;no-margin](imageUrl)`
