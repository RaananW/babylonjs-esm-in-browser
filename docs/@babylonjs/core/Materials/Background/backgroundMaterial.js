/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import backgroundMaterial.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./backgroundMaterial.pure.js";
import { RegisterBackgroundMaterial } from "./backgroundMaterial.pure.js";
RegisterBackgroundMaterial();
//# sourceMappingURL=backgroundMaterial.js.map