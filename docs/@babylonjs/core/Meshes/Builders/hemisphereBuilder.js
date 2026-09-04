/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import hemisphereBuilder.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./hemisphereBuilder.pure.js";
import { RegisterHemisphereBuilder } from "./hemisphereBuilder.pure.js";
RegisterHemisphereBuilder();
//# sourceMappingURL=hemisphereBuilder.js.map