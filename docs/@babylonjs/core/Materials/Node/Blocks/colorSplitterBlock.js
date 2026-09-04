/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import colorSplitterBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./colorSplitterBlock.pure.js";
import { RegisterColorSplitterBlock } from "./colorSplitterBlock.pure.js";
RegisterColorSplitterBlock();
//# sourceMappingURL=colorSplitterBlock.js.map