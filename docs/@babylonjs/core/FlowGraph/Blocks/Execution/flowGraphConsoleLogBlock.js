/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphConsoleLogBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphConsoleLogBlock.pure.js";
import { RegisterFlowGraphConsoleLogBlock } from "./flowGraphConsoleLogBlock.pure.js";
RegisterFlowGraphConsoleLogBlock();
//# sourceMappingURL=flowGraphConsoleLogBlock.js.map