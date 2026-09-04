/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import transformBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./transformBlock.pure.js";
import { RegisterTransformBlock } from "./transformBlock.pure.js";
RegisterTransformBlock();
//# sourceMappingURL=transformBlock.js.map