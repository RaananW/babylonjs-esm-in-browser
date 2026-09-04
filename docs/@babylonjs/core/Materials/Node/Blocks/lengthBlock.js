/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import lengthBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./lengthBlock.pure.js";
import { RegisterLengthBlock } from "./lengthBlock.pure.js";
RegisterLengthBlock();
//# sourceMappingURL=lengthBlock.js.map