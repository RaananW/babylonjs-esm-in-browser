# Babylon.js native ES modules in the browser

This project demonstrates how to load Babylon.js directly as native browser ES
modules. An [import map](https://developer.mozilla.org/docs/Web/HTML/Element/script/type/importmap)
maps Babylon.js package specifiers to locally served package files, so the
application does not bundle Babylon.js.

Import maps are supported by all current major browsers. See
[Can I use import maps](https://caniuse.com/import-maps) for exact browser
versions.

## How to use

The build transpiles `src/index.ts` with TypeScript, copies the static files in
`public`, and copies `@babylonjs/core` and `@babylonjs/loaders` into `dist`. The
import map in `public/index.html` points browsers at those local package copies.
No bundler or framework is involved: the browser loads the original Babylon.js
ES modules.

The application uses deep `.pure.js` imports and explicitly registers the
features it needs. A root import from `@babylonjs/core/pure.js` is convenient
for bundled applications, where tree shaking removes unused exports. In this
unbundled example, that barrel would make the browser fetch every re-exported
module, so granular pure imports keep the initial module graph substantially
smaller. Babylon's dynamic loader registration also defers the glTF
implementation and extensions until a glTF asset is requested.

## TL;dr

```bash
npm install
npm run build
npm run dev
```

`npm run dev` serves `dist` at <http://localhost:3000> and rebuilds when the
TypeScript entry point or public HTML changes. Run `npm run check` for a
standalone TypeScript check.

All deployable files are generated in `dist`.

## Hosting

The live example is hosted by GitHub Pages. Every push to `main` runs the
deployment workflow, which installs the locked dependencies, checks the
TypeScript, builds `dist`, and deploys that directory. The workflow can also be
started manually from the repository's **Actions** tab.

GitHub Pages must use **GitHub Actions** as its publishing source under
**Settings → Pages → Build and deployment**. The generated site includes
canonical and social metadata, structured data, a sitemap, and crawler rules.

## It doesn't work

[View the live example](https://raananw.github.io/babylonjs-esm-in-browser/).
If a local build does not load, confirm that it is being accessed through an
HTTP server rather than directly from the filesystem.

## Adding other babylon packages

Add the package to `package.json`, map it in `public/index.html`, and include it
in `babylonPackages` in `scripts/build.mjs`. Then run `npm run build`.
