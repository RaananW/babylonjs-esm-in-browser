/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import mapRangeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./mapRangeBlock.pure.js";
import { RegisterMapRangeBlock } from "./mapRangeBlock.pure.js";
RegisterMapRangeBlock();
//# sourceMappingURL=mapRangeBlock.js.map