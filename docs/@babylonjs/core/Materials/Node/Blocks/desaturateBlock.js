/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import desaturateBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./desaturateBlock.pure.js";
import { RegisterDesaturateBlock } from "./desaturateBlock.pure.js";
RegisterDesaturateBlock();
//# sourceMappingURL=desaturateBlock.js.map