/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import fragmentOutputBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./fragmentOutputBlock.pure.js";
import { RegisterFragmentOutputBlock } from "./fragmentOutputBlock.pure.js";
RegisterFragmentOutputBlock();
//# sourceMappingURL=fragmentOutputBlock.js.map