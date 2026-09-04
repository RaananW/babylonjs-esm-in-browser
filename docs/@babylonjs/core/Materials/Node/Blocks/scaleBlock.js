/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import scaleBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./scaleBlock.pure.js";
import { RegisterScaleBlock } from "./scaleBlock.pure.js";
RegisterScaleBlock();
//# sourceMappingURL=scaleBlock.js.map