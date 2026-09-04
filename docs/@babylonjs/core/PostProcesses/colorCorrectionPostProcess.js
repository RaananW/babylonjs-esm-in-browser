/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import colorCorrectionPostProcess.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./colorCorrectionPostProcess.pure.js";
import { RegisterColorCorrectionPostProcess } from "./colorCorrectionPostProcess.pure.js";
RegisterColorCorrectionPostProcess();
//# sourceMappingURL=colorCorrectionPostProcess.js.map