/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import motionBlurPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./motionBlurPostProcess.pure.js";
import { RegisterMotionBlurPostProcess } from "./motionBlurPostProcess.pure.js";
RegisterMotionBlurPostProcess();
//# sourceMappingURL=motionBlurPostProcess.js.map