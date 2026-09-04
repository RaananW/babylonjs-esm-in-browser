/**
 * Re-exports the pure implementation and applies the runtime registration side effect.
 * Import "./KHR_lights_punctual.pure" for tree-shakeable, side-effect-free usage.
 */
export * from "./KHR_lights_punctual.types.js";
export * from "./KHR_lights_punctual.pure.js";
import { RegisterKHR_lights } from "./KHR_lights_punctual.pure.js";
RegisterKHR_lights();
//# sourceMappingURL=KHR_lights_punctual.js.map