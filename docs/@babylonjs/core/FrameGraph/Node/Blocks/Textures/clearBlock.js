/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import clearBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./clearBlock.pure.js";
import { RegisterClearBlock } from "./clearBlock.pure.js";
RegisterClearBlock();
//# sourceMappingURL=clearBlock.js.map