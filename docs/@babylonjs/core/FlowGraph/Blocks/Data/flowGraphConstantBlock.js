/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphConstantBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphConstantBlock.pure.js";
import { RegisterFlowGraphConstantBlock } from "./flowGraphConstantBlock.pure.js";
RegisterFlowGraphConstantBlock();
//# sourceMappingURL=flowGraphConstantBlock.js.map