/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import interpolateValueAction.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./interpolateValueAction.pure.js";
import { RegisterInterpolateValueAction } from "./interpolateValueAction.pure.js";
RegisterInterpolateValueAction();
//# sourceMappingURL=interpolateValueAction.js.map