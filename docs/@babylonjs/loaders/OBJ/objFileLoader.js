/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./objFileLoader.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./objFileLoader.types.js";
export * from "./objFileLoader.pure.js";
import { RegisterOBJFileLoader } from "./objFileLoader.pure.js";
RegisterOBJFileLoader();
//# sourceMappingURL=objFileLoader.js.map