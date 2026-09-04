/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./fbxFileLoader.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./fbxFileLoader.types.js";
export * from "./fbxFileLoader.pure.js";
import { RegisterFBXFileLoader } from "./fbxFileLoader.pure.js";
RegisterFBXFileLoader();
//# sourceMappingURL=fbxFileLoader.js.map