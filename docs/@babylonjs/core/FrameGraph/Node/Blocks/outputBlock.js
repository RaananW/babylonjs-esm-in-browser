/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import outputBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./outputBlock.pure.js";
import { RegisterOutputBlock } from "./outputBlock.pure.js";
RegisterOutputBlock();
//# sourceMappingURL=outputBlock.js.map