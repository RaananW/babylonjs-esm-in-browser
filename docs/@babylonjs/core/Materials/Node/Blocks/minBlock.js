/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import minBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./minBlock.pure.js";
import { RegisterMinBlock } from "./minBlock.pure.js";
RegisterMinBlock();
//# sourceMappingURL=minBlock.js.map