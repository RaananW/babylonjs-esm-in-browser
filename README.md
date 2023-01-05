# Babylon.js in-browser es modules support

**EXPERIMENTAL**

This project is an example of how to use babylon in a modules-script in-browser.

It is using the import-map feature, which sadly is not available in all browsers (I am looking at you, Apple. AGAIN.).

To check in which browser(s) it does work, see [caniuse import-maps](https://caniuse.com/import-maps).

## How to use

To get started you need to serve the @babylonjs/core (and /loaders) folders, along with your own code. The `npm run build` command will do that for you.

Afterwards you can either open a web-server in the dist folder, or run `npm run watch` to start a web-server and watch for changes.

## TL;dr

```bash
npm install
npm run build
npm run watch # or serve the dist folder on your own
```

All files you need are now in the dist folder.

## Why rollup

Rollup is NOT needed in this project. I only use rollup's plugin system to run the copy plugin. Otherwise, you can use pure typescript to compile your file(s).
You can technically ignore the rollup unresolved import warning - it is quite expected.

## It doesn't work

[Yes it does...](https://raananw.github.io//babylonjs-esm-in-browser/)
 If it doesn't, you are probably using a browser that doesn't support import-maps or es modules. Note that IE11 is already retired. And Apple browsers are always behind.

## Adding other babylon packages

Go right ahead. Just make sure to run `npm run build` afterwards.
