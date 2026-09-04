/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./EXT_lights_area.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./EXT_lights_area.types.js";
export * from "./EXT_lights_area.pure.js";
import { RegisterEXT_lights_area } from "./EXT_lights_area.pure.js";
RegisterEXT_lights_area();
//# sourceMappingURL=EXT_lights_area.js.map