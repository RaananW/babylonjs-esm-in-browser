/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import conditionBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./conditionBlock.pure.js";
import { RegisterConditionBlock } from "./conditionBlock.pure.js";
RegisterConditionBlock();
//# sourceMappingURL=conditionBlock.js.map