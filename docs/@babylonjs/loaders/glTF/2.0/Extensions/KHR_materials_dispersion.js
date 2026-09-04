/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_materials_dispersion.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_materials_dispersion.types.js";
export * from "./KHR_materials_dispersion.pure.js";
import { RegisterKHR_materials_dispersion } from "./KHR_materials_dispersion.pure.js";
RegisterKHR_materials_dispersion();
//# sourceMappingURL=KHR_materials_dispersion.js.map