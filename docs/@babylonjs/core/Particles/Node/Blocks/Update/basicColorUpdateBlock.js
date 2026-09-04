/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import basicColorUpdateBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./basicColorUpdateBlock.pure.js";
import { RegisterBasicColorUpdateBlock } from "./basicColorUpdateBlock.pure.js";
RegisterBasicColorUpdateBlock();
//# sourceMappingURL=basicColorUpdateBlock.js.map