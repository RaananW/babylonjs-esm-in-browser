/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_materials_coat.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_materials_coat.types.js";
export * from "./KHR_materials_coat.pure.js";
import { RegisterKHR_materials_coat } from "./KHR_materials_coat.pure.js";
RegisterKHR_materials_coat();
//# sourceMappingURL=KHR_materials_coat.js.map