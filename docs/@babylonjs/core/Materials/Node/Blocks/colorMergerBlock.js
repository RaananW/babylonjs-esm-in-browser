/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import colorMergerBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./colorMergerBlock.pure.js";
import { RegisterColorMergerBlock } from "./colorMergerBlock.pure.js";
RegisterColorMergerBlock();
//# sourceMappingURL=colorMergerBlock.js.map