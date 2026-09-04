/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import animation.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./animation.pure.js";
export * from "./animation.types.js";
import { RegisterAnimation } from "./animation.pure.js";
RegisterAnimation();
//# sourceMappingURL=animation.js.map