/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import latticeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./latticeBlock.pure.js";
import { RegisterLatticeBlock } from "./latticeBlock.pure.js";
RegisterLatticeBlock();
//# sourceMappingURL=latticeBlock.js.map