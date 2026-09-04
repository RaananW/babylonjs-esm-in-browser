/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import systemBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./systemBlock.pure.js";
import { RegisterSystemBlock } from "./systemBlock.pure.js";
RegisterSystemBlock();
//# sourceMappingURL=systemBlock.js.map