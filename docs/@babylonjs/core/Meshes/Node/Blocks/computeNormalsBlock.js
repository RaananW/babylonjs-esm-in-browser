/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import computeNormalsBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./computeNormalsBlock.pure.js";
import { RegisterComputeNormalsBlock } from "./computeNormalsBlock.pure.js";
RegisterComputeNormalsBlock();
//# sourceMappingURL=computeNormalsBlock.js.map