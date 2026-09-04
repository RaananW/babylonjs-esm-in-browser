/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import boundingBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./boundingBlock.pure.js";
import { RegisterBoundingBlock } from "./boundingBlock.pure.js";
RegisterBoundingBlock();
//# sourceMappingURL=boundingBlock.js.map