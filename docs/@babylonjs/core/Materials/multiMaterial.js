/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import multiMaterial.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./multiMaterial.pure.js";
export * from "./multiMaterial.types.js";
import { RegisterMultiMaterial } from "./multiMaterial.pure.js";
RegisterMultiMaterial();
//# sourceMappingURL=multiMaterial.js.map