/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import replaceColorBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./replaceColorBlock.pure.js";
import { RegisterReplaceColorBlock } from "./replaceColorBlock.pure.js";
RegisterReplaceColorBlock();
//# sourceMappingURL=replaceColorBlock.js.map