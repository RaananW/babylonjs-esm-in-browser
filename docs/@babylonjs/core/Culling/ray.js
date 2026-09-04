/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import ray.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./ray.pure.js";
import { RegisterRay } from "./ray.pure.js";
RegisterRay();
//# sourceMappingURL=ray.js.map