import * as FileLoader from "../glTF/glTFFileLoader.js";
import * as Validation from "../glTF/glTFValidation.js";
/**
 * This is the entry point for the UMD module.
 * The entry point for a future ESM package should be index.ts
 */
const GlobalObject = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : undefined;
if (typeof GlobalObject !== "undefined") {
    GlobalObject.BABYLON = GlobalObject.BABYLON || {};
    for (const key in FileLoader) {
        GlobalObject.BABYLON[key] = FileLoader[key];
    }
    for (const key in Validation) {
        GlobalObject.BABYLON[key] = Validation[key];
    }
}
export * from "../glTF/glTFFileLoader.js";
export * from "../glTF/glTFValidation.js";
//# sourceMappingURL=legacy-glTF.js.map