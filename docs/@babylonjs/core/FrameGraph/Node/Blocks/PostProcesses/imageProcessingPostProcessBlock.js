/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import imageProcessingPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./imageProcessingPostProcessBlock.pure.js";
import { RegisterImageProcessingPostProcessBlock } from "./imageProcessingPostProcessBlock.pure.js";
RegisterImageProcessingPostProcessBlock();
//# sourceMappingURL=imageProcessingPostProcessBlock.js.map