/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import highlightLayerBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./highlightLayerBlock.pure.js";
import { RegisterHighlightLayerBlock } from "./highlightLayerBlock.pure.js";
RegisterHighlightLayerBlock();
//# sourceMappingURL=highlightLayerBlock.js.map