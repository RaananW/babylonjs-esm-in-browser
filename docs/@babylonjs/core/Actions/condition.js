/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import condition.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./condition.pure.js";
import { RegisterCondition } from "./condition.pure.js";
RegisterCondition();
//# sourceMappingURL=condition.js.map