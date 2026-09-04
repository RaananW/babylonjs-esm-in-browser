/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphDoNBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphDoNBlock.pure.js";
import { RegisterFlowGraphDoNBlock } from "./flowGraphDoNBlock.pure.js";
RegisterFlowGraphDoNBlock();
//# sourceMappingURL=flowGraphDoNBlock.js.map