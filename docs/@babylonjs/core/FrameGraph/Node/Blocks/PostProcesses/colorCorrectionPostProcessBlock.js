/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import colorCorrectionPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./colorCorrectionPostProcessBlock.pure.js";
import { RegisterColorCorrectionPostProcessBlock } from "./colorCorrectionPostProcessBlock.pure.js";
RegisterColorCorrectionPostProcessBlock();
//# sourceMappingURL=colorCorrectionPostProcessBlock.js.map