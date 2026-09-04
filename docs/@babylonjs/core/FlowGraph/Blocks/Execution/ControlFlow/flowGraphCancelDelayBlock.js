/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphCancelDelayBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphCancelDelayBlock.pure.js";
import { RegisterFlowGraphCancelDelayBlock } from "./flowGraphCancelDelayBlock.pure.js";
RegisterFlowGraphCancelDelayBlock();
//# sourceMappingURL=flowGraphCancelDelayBlock.js.map