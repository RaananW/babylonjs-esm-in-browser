/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import flowGraphVectorMathBlocks.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./flowGraphVectorMathBlocks.pure.js";
import { RegisterFlowGraphVectorMathBlocks } from "./flowGraphVectorMathBlocks.pure.js";
RegisterFlowGraphVectorMathBlocks();
//# sourceMappingURL=flowGraphVectorMathBlocks.js.map