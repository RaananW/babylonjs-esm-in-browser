/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphMultiGateBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphMultiGateBlock.pure.js";
import { RegisterFlowGraphMultiGateBlock } from "./flowGraphMultiGateBlock.pure.js";
RegisterFlowGraphMultiGateBlock();
//# sourceMappingURL=flowGraphMultiGateBlock.js.map