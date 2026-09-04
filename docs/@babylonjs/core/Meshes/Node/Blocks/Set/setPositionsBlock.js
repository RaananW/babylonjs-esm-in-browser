/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import setPositionsBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./setPositionsBlock.pure.js";
import { RegisterSetPositionsBlock } from "./setPositionsBlock.pure.js";
RegisterSetPositionsBlock();
//# sourceMappingURL=setPositionsBlock.js.map