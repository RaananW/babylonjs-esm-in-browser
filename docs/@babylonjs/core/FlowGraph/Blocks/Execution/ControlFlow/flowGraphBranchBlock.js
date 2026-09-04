/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphBranchBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphBranchBlock.pure.js";
import { RegisterFlowGraphBranchBlock } from "./flowGraphBranchBlock.pure.js";
RegisterFlowGraphBranchBlock();
//# sourceMappingURL=flowGraphBranchBlock.js.map