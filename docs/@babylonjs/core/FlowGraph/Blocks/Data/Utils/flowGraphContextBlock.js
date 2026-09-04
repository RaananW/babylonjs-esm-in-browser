/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphContextBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphContextBlock.pure.js";
import { RegisterFlowGraphContextBlock } from "./flowGraphContextBlock.pure.js";
RegisterFlowGraphContextBlock();
//# sourceMappingURL=flowGraphContextBlock.js.map