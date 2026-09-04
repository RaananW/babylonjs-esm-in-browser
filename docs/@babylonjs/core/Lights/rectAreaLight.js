/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import rectAreaLight.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./rectAreaLight.pure.js";
import { RegisterRectAreaLight } from "./rectAreaLight.pure.js";
RegisterRectAreaLight();
//# sourceMappingURL=rectAreaLight.js.map