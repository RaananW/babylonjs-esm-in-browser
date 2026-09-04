/* eslint-disable @typescript-eslint/no-restricted-imports */
import * as GLTF1 from "../glTF/1.0/index.js";
/**
 * This is the entry point for the UMD module.
 * The entry point for a future ESM package should be index.ts
 */
const GlobalObject = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : undefined;
if (typeof GlobalObject !== "undefined") {
    GlobalObject.BABYLON = GlobalObject.BABYLON || {};
    GlobalObject.BABYLON.GLTF1 = GlobalObject.BABYLON.GLTF1 || {};
    for (const key in GLTF1) {
        GlobalObject.BABYLON.GLTF1[key] = GLTF1[key];
    }
}
export { GLTF1 };
//# sourceMappingURL=legacy-glTF1.js.map