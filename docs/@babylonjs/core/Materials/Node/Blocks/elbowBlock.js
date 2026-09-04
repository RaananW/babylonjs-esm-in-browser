/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import elbowBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./elbowBlock.pure.js";
import { RegisterMaterialsNodeBlocksElbowBlock } from "./elbowBlock.pure.js";
RegisterMaterialsNodeBlocksElbowBlock();
//# sourceMappingURL=elbowBlock.js.map