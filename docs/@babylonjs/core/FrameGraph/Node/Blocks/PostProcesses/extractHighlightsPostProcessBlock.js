/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import extractHighlightsPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./extractHighlightsPostProcessBlock.pure.js";
import { RegisterExtractHighlightsPostProcessBlock } from "./extractHighlightsPostProcessBlock.pure.js";
RegisterExtractHighlightsPostProcessBlock();
//# sourceMappingURL=extractHighlightsPostProcessBlock.js.map