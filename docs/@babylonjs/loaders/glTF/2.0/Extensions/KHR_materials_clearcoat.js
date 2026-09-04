/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_materials_clearcoat.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_materials_clearcoat.types.js";
export * from "./KHR_materials_clearcoat.pure.js";
import { RegisterKHR_materials_clearcoat } from "./KHR_materials_clearcoat.pure.js";
RegisterKHR_materials_clearcoat();
//# sourceMappingURL=KHR_materials_clearcoat.js.map