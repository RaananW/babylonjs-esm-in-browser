/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphGetVariableBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphGetVariableBlock.pure.js";
import { RegisterFlowGraphGetVariableBlock } from "./flowGraphGetVariableBlock.pure.js";
RegisterFlowGraphGetVariableBlock();
//# sourceMappingURL=flowGraphGetVariableBlock.js.map