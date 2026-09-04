/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import blurPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./blurPostProcess.pure.js";
import { RegisterBlurPostProcess } from "./blurPostProcess.pure.js";
RegisterBlurPostProcess();
//# sourceMappingURL=blurPostProcess.js.map