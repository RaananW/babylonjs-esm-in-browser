/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import prePassOutputBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./prePassOutputBlock.pure.js";
import { RegisterPrePassOutputBlock } from "./prePassOutputBlock.pure.js";
RegisterPrePassOutputBlock();
//# sourceMappingURL=prePassOutputBlock.js.map