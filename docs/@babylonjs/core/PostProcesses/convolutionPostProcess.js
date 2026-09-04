/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import convolutionPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./convolutionPostProcess.pure.js";
import { RegisterConvolutionPostProcess } from "./convolutionPostProcess.pure.js";
RegisterConvolutionPostProcess();
//# sourceMappingURL=convolutionPostProcess.js.map