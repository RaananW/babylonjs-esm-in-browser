/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphSetDelayBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphSetDelayBlock.pure.js";
import { RegisterFlowGraphSetDelayBlock } from "./flowGraphSetDelayBlock.pure.js";
RegisterFlowGraphSetDelayBlock();
//# sourceMappingURL=flowGraphSetDelayBlock.js.map