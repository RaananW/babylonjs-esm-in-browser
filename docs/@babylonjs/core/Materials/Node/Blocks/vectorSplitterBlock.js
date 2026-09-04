/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import vectorSplitterBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./vectorSplitterBlock.pure.js";
import { RegisterVectorSplitterBlock } from "./vectorSplitterBlock.pure.js";
RegisterVectorSplitterBlock();
//# sourceMappingURL=vectorSplitterBlock.js.map