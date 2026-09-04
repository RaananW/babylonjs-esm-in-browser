/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import spotLight.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./spotLight.pure.js";
import { RegisterSpotLight } from "./spotLight.pure.js";
RegisterSpotLight();
//# sourceMappingURL=spotLight.js.map