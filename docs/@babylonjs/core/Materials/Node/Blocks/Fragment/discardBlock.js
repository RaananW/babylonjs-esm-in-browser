/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import discardBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./discardBlock.pure.js";
import { RegisterDiscardBlock } from "./discardBlock.pure.js";
RegisterDiscardBlock();
//# sourceMappingURL=discardBlock.js.map