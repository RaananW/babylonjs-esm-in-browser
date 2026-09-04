/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import inputBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./inputBlock.pure.js";
import { RegisterFrameGraphNodeBlocksInputBlock } from "./inputBlock.pure.js";
RegisterFrameGraphNodeBlocksInputBlock();
//# sourceMappingURL=inputBlock.js.map