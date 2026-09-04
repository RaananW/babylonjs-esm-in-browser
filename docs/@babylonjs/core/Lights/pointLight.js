/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import pointLight.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./pointLight.pure.js";
import { RegisterPointLight } from "./pointLight.pure.js";
RegisterPointLight();
//# sourceMappingURL=pointLight.js.map