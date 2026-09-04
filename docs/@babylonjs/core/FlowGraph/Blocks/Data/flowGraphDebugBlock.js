/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphDebugBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphDebugBlock.pure.js";
import { RegisterFlowGraphDebugBlock } from "./flowGraphDebugBlock.pure.js";
RegisterFlowGraphDebugBlock();
//# sourceMappingURL=flowGraphDebugBlock.js.map