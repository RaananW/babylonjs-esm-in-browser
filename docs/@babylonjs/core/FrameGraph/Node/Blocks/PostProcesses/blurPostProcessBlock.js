/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import blurPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./blurPostProcessBlock.pure.js";
import { RegisterBlurPostProcessBlock } from "./blurPostProcessBlock.pure.js";
RegisterBlurPostProcessBlock();
//# sourceMappingURL=blurPostProcessBlock.js.map