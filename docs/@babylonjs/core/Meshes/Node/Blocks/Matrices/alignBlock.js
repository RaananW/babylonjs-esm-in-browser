/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import alignBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./alignBlock.pure.js";
import { RegisterAlignBlock } from "./alignBlock.pure.js";
RegisterAlignBlock();
//# sourceMappingURL=alignBlock.js.map