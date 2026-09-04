/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphInterpolationBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphInterpolationBlock.pure.js";
import { RegisterFlowGraphInterpolationBlock } from "./flowGraphInterpolationBlock.pure.js";
RegisterFlowGraphInterpolationBlock();
//# sourceMappingURL=flowGraphInterpolationBlock.js.map