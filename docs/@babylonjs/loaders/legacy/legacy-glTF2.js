/* eslint-disable @typescript-eslint/no-restricted-imports */
import * as Extensions from "../glTF/2.0/Extensions/index.js";
import * as Interfaces from "../glTF/2.0/glTFLoaderInterfaces.js";
import * as GLTF2 from "../glTF/2.0/index.js";
const LoaderExtensions = { ...Extensions };
const GLTF2Loader = {
    ...Interfaces,
    ["Extensions"]: LoaderExtensions,
};
const GLTF2Legacy = {
    ...GLTF2,
    ["Loader"]: GLTF2Loader,
};
/**
 * This is the entry point for the UMD module.
 * The entry point for a future ESM package should be index.ts
 */
const GlobalObject = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : undefined;
if (typeof GlobalObject !== "undefined") {
    GlobalObject.BABYLON = GlobalObject.BABYLON || {};
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const BABYLON = GlobalObject.BABYLON;
    BABYLON.GLTF2 = BABYLON.GLTF2 || {};
    BABYLON.GLTF2.Loader = BABYLON.GLTF2.Loader || {};
    BABYLON.GLTF2.Loader.Extensions = BABYLON.GLTF2.Loader.Extensions || {};
    const keys = ["Loader"];
    for (const key in LoaderExtensions) {
        BABYLON.GLTF2.Loader.Extensions[key] = LoaderExtensions[key];
        keys.push(key);
    }
    for (const key in GLTF2Loader) {
        if (key === "Extensions") {
            continue;
        }
        BABYLON.GLTF2.Loader[key] = GLTF2Loader[key];
        keys.push(key);
    }
    for (const key in GLTF2Legacy) {
        // Prevent Reassignment.
        if (keys.indexOf(key) > -1) {
            continue;
        }
        BABYLON.GLTF2[key] = GLTF2Legacy[key];
    }
}
export { GLTF2Legacy as GLTF2 };
//# sourceMappingURL=legacy-glTF2.js.map