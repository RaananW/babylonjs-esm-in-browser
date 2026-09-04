/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphSetVariableBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphSetVariableBlock.pure.js";
import { RegisterFlowGraphSetVariableBlock } from "./flowGraphSetVariableBlock.pure.js";
RegisterFlowGraphSetVariableBlock();
//# sourceMappingURL=flowGraphSetVariableBlock.js.map