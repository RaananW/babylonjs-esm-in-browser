/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import divideBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./divideBlock.pure.js";
import { RegisterDivideBlock } from "./divideBlock.pure.js";
RegisterDivideBlock();
//# sourceMappingURL=divideBlock.js.map