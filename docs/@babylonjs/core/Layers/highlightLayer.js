export * from "./highlightLayer.types.js";
/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import highlightLayer.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./highlightLayer.pure.js";
import { RegisterHighlightLayer } from "./highlightLayer.pure.js";
RegisterHighlightLayer();
//# sourceMappingURL=highlightLayer.js.map