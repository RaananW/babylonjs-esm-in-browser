/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import powBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./powBlock.pure.js";
import { RegisterPowBlock } from "./powBlock.pure.js";
RegisterPowBlock();
//# sourceMappingURL=powBlock.js.map