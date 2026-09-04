/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import negateBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./negateBlock.pure.js";
import { RegisterNegateBlock } from "./negateBlock.pure.js";
RegisterNegateBlock();
//# sourceMappingURL=negateBlock.js.map