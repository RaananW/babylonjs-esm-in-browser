/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphMathBlocks.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphMathBlocks.pure.js";
import { RegisterFlowGraphMathBlocks } from "./flowGraphMathBlocks.pure.js";
RegisterFlowGraphMathBlocks();
//# sourceMappingURL=flowGraphMathBlocks.js.map