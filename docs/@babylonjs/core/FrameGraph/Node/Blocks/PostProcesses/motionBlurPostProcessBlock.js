/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import motionBlurPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./motionBlurPostProcessBlock.pure.js";
import { RegisterMotionBlurPostProcessBlock } from "./motionBlurPostProcessBlock.pure.js";
RegisterMotionBlurPostProcessBlock();
//# sourceMappingURL=motionBlurPostProcessBlock.js.map