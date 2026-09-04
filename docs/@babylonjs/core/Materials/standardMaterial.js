/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import standardMaterial.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./standardMaterial.pure.js";
import { RegisterStandardMaterial } from "./standardMaterial.pure.js";
RegisterStandardMaterial();
//# sourceMappingURL=standardMaterial.js.map