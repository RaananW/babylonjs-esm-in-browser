/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphStopAnimationBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphStopAnimationBlock.pure.js";
import { RegisterFlowGraphStopAnimationBlock } from "./flowGraphStopAnimationBlock.pure.js";
RegisterFlowGraphStopAnimationBlock();
//# sourceMappingURL=flowGraphStopAnimationBlock.js.map