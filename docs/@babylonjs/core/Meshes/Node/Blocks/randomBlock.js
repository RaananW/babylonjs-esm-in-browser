/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import randomBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./randomBlock.pure.js";
import { RegisterRandomBlock } from "./randomBlock.pure.js";
RegisterRandomBlock();
//# sourceMappingURL=randomBlock.js.map