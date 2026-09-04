/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphSequenceBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphSequenceBlock.pure.js";
import { RegisterFlowGraphSequenceBlock } from "./flowGraphSequenceBlock.pure.js";
RegisterFlowGraphSequenceBlock();
//# sourceMappingURL=flowGraphSequenceBlock.js.map