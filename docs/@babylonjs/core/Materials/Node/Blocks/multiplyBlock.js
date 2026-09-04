/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import multiplyBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./multiplyBlock.pure.js";
import { RegisterMultiplyBlock } from "./multiplyBlock.pure.js";
RegisterMultiplyBlock();
//# sourceMappingURL=multiplyBlock.js.map