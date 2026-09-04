/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import sphereBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./sphereBuilder.pure.js";
import { RegisterSphereBuilder } from "./sphereBuilder.pure.js";
RegisterSphereBuilder();
//# sourceMappingURL=sphereBuilder.js.map