/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import heightToNormalBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./heightToNormalBlock.pure.js";
import { RegisterHeightToNormalBlock } from "./heightToNormalBlock.pure.js";
RegisterHeightToNormalBlock();
//# sourceMappingURL=heightToNormalBlock.js.map