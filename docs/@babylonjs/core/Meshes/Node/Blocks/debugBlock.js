/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import debugBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./debugBlock.pure.js";
import { RegisterMeshesNodeBlocksDebugBlock } from "./debugBlock.pure.js";
RegisterMeshesNodeBlocksDebugBlock();
//# sourceMappingURL=debugBlock.js.map