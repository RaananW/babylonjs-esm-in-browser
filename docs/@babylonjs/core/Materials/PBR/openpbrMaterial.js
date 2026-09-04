/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import openpbrMaterial.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./openpbrMaterial.pure.js";
import { RegisterOpenpbrMaterial } from "./openpbrMaterial.pure.js";
RegisterOpenpbrMaterial();
//# sourceMappingURL=openpbrMaterial.js.map