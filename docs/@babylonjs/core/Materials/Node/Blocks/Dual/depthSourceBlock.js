/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import depthSourceBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./depthSourceBlock.pure.js";
import { RegisterDepthSourceBlock } from "./depthSourceBlock.pure.js";
RegisterDepthSourceBlock();
//# sourceMappingURL=depthSourceBlock.js.map