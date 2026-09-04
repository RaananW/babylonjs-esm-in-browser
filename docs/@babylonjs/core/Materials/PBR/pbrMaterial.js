/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import pbrMaterial.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./pbrMaterial.pure.js";
import { RegisterPbrMaterial } from "./pbrMaterial.pure.js";
RegisterPbrMaterial();
//# sourceMappingURL=pbrMaterial.js.map