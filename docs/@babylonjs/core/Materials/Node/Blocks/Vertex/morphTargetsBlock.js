/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import morphTargetsBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./morphTargetsBlock.pure.js";
import { RegisterMorphTargetsBlock } from "./morphTargetsBlock.pure.js";
RegisterMorphTargetsBlock();
//# sourceMappingURL=morphTargetsBlock.js.map