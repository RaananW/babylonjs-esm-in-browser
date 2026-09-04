/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphThrottleBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphThrottleBlock.pure.js";
import { RegisterFlowGraphThrottleBlock } from "./flowGraphThrottleBlock.pure.js";
RegisterFlowGraphThrottleBlock();
//# sourceMappingURL=flowGraphThrottleBlock.js.map