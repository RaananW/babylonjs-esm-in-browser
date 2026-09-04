/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import addBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./addBlock.pure.js";
import { RegisterAddBlock } from "./addBlock.pure.js";
RegisterAddBlock();
//# sourceMappingURL=addBlock.js.map