/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_materials_transmission.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_materials_transmission.types.js";
export * from "./KHR_materials_transmission.pure.js";
import { RegisterKHR_materials_transmission } from "./KHR_materials_transmission.pure.js";
RegisterKHR_materials_transmission();
//# sourceMappingURL=KHR_materials_transmission.js.map