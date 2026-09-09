# Babylon.js native ES modules in the browser

This project demonstrates how to load Babylon.js directly as native browser ES
modules. An [import map](https://developer.mozilla.org/docs/Web/HTML/Element/script/type/importmap)
maps Babylon.js package specifiers to self-hosted package files, jsDelivr, or
unpkg, so the application does not bundle Babylon.js.

Import maps are supported by all current major browsers. See
[Can I use import maps](https://caniuse.com/import-maps) for exact browser
versions.

## How to use

The root page is a lobby for three versions of the same application:

| Demo | Babylon.js module source |
| --- | --- |
| [Self-hosted](https://raananw.github.io/babylonjs-esm-in-browser/self-hosted/) | Package files copied into the deployment |
| [jsDelivr](https://raananw.github.io/babylonjs-esm-in-browser/jsdelivr/) | Pinned npm packages served by jsDelivr |
| [unpkg](https://raananw.github.io/babylonjs-esm-in-browser/unpkg/) | Pinned npm packages served by unpkg |

All three pages run the same compiled `index.js`; only their import maps differ.
The build transpiles `src/index.ts` with TypeScript, copies the static files in
`public`, and copies `@babylonjs/core` and `@babylonjs/loaders` into `dist` for
the self-hosted variant. No bundler or framework is involved: the browser loads
the original Babylon.js ES modules.

The build reads the installed Babylon.js version and stamps it into every demo,
including the pinned CDN URLs. This keeps all variants on the same version.
Dependabot checks weekly for new Babylon.js releases.

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

Add the package to `package.json`, map it in each demo HTML file, and include it
in `babylonPackages` in `scripts/build.mjs` for the self-hosted variant. Then
run `npm run build`.
