/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import glowLayerBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./glowLayerBlock.pure.js";
import { RegisterGlowLayerBlock } from "./glowLayerBlock.pure.js";
RegisterGlowLayerBlock();
//# sourceMappingURL=glowLayerBlock.js.map