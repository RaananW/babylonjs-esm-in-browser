/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_materials_fuzz.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_materials_fuzz.types.js";
export * from "./KHR_materials_fuzz.pure.js";
import { RegisterKHR_materials_fuzz } from "./KHR_materials_fuzz.pure.js";
RegisterKHR_materials_fuzz();
//# sourceMappingURL=KHR_materials_fuzz.js.map