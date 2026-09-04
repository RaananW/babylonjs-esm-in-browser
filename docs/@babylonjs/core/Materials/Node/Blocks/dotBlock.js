/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import dotBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./dotBlock.pure.js";
import { RegisterDotBlock } from "./dotBlock.pure.js";
RegisterDotBlock();
//# sourceMappingURL=dotBlock.js.map