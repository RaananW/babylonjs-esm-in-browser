/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import hemisphericLight.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./hemisphericLight.pure.js";
import { RegisterHemisphericLight } from "./hemisphericLight.pure.js";
RegisterHemisphericLight();
//# sourceMappingURL=hemisphericLight.js.map