/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import debugBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./debugBlock.pure.js";
import { RegisterMaterialsNodeBlocksDebugBlock } from "./debugBlock.pure.js";
RegisterMaterialsNodeBlocksDebugBlock();
//# sourceMappingURL=debugBlock.js.map