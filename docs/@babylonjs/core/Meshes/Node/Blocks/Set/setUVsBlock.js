/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import setUVsBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./setUVsBlock.pure.js";
import { RegisterSetUVsBlock } from "./setUVsBlock.pure.js";
RegisterSetUVsBlock();
//# sourceMappingURL=setUVsBlock.js.map