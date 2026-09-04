import * as Loaders from "../dynamic.js";
/**
 * This is the entry point for the UMD module.
 * The entry point for a future ESM package should be index.ts
 */
const GlobalObject = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : undefined;
if (typeof GlobalObject !== "undefined") {
    GlobalObject.BABYLON = GlobalObject.BABYLON || {};
    for (const key in Loaders) {
        GlobalObject.BABYLON[key] = Loaders[key];
    }
}
export * from "../dynamic.js";
//# sourceMappingURL=legacy-dynamic.js.map