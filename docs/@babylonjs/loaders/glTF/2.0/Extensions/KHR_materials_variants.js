/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_materials_variants.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_materials_variants.types.js";
export * from "./KHR_materials_variants.pure.js";
import { RegisterKHR_materials_variants } from "./KHR_materials_variants.pure.js";
RegisterKHR_materials_variants();
//# sourceMappingURL=KHR_materials_variants.js.map