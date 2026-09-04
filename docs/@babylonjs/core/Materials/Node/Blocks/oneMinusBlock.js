/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import oneMinusBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./oneMinusBlock.pure.js";
import { RegisterOneMinusBlock } from "./oneMinusBlock.pure.js";
RegisterOneMinusBlock();
//# sourceMappingURL=oneMinusBlock.js.map