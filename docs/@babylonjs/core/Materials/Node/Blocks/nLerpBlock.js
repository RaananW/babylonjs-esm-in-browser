/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import nLerpBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./nLerpBlock.pure.js";
import { RegisterNLerpBlock } from "./nLerpBlock.pure.js";
RegisterNLerpBlock();
//# sourceMappingURL=nLerpBlock.js.map