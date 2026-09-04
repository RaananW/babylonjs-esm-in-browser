/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import smoothStepBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./smoothStepBlock.pure.js";
import { RegisterSmoothStepBlock } from "./smoothStepBlock.pure.js";
RegisterSmoothStepBlock();
//# sourceMappingURL=smoothStepBlock.js.map