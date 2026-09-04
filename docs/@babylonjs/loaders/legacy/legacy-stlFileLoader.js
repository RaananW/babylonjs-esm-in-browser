/* eslint-disable @typescript-eslint/no-restricted-imports */
import * as Loaders from "../STL/index.js";
/**
 * This is the entry point for the UMD module.
 * The entry point for a future ESM package should be index.ts
 */
const GlobalObject = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : undefined;
if (typeof GlobalObject !== "undefined") {
    for (const key in Loaders) {
        if (!GlobalObject.BABYLON[key]) {
            GlobalObject.BABYLON[key] = Loaders[key];
        }
    }
}
export * from "../STL/index.js";
//# sourceMappingURL=legacy-stlFileLoader.js.map