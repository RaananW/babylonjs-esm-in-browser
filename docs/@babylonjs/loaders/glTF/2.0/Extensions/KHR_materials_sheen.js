/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_materials_sheen.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_materials_sheen.types.js";
export * from "./KHR_materials_sheen.pure.js";
import { RegisterKHR_materials_sheen } from "./KHR_materials_sheen.pure.js";
RegisterKHR_materials_sheen();
//# sourceMappingURL=KHR_materials_sheen.js.map