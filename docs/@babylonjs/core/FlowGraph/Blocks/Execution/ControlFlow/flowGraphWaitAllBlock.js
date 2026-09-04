/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphWaitAllBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphWaitAllBlock.pure.js";
import { RegisterFlowGraphWaitAllBlock } from "./flowGraphWaitAllBlock.pure.js";
RegisterFlowGraphWaitAllBlock();
//# sourceMappingURL=flowGraphWaitAllBlock.js.map