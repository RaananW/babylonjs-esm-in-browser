/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_materials_unlit.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_materials_unlit.types.js";
export * from "./KHR_materials_unlit.pure.js";
import { RegisterKHR_materials_unlit } from "./KHR_materials_unlit.pure.js";
RegisterKHR_materials_unlit();
//# sourceMappingURL=KHR_materials_unlit.js.map