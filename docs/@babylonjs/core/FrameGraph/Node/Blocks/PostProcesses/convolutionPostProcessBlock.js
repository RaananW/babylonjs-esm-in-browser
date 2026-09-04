/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import convolutionPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./convolutionPostProcessBlock.pure.js";
import { RegisterConvolutionPostProcessBlock } from "./convolutionPostProcessBlock.pure.js";
RegisterConvolutionPostProcessBlock();
//# sourceMappingURL=convolutionPostProcessBlock.js.map