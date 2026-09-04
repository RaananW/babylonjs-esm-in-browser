/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./EXT_lights_ies.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./EXT_lights_ies.types.js";
export * from "./EXT_lights_ies.pure.js";
import { RegisterEXT_lights_ies } from "./EXT_lights_ies.pure.js";
RegisterEXT_lights_ies();
//# sourceMappingURL=EXT_lights_ies.js.map