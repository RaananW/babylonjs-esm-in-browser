/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import discBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./discBlock.pure.js";
import { RegisterDiscBlock } from "./discBlock.pure.js";
RegisterDiscBlock();
//# sourceMappingURL=discBlock.js.map