/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import randomNumberBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./randomNumberBlock.pure.js";
import { RegisterRandomNumberBlock } from "./randomNumberBlock.pure.js";
RegisterRandomNumberBlock();
//# sourceMappingURL=randomNumberBlock.js.map