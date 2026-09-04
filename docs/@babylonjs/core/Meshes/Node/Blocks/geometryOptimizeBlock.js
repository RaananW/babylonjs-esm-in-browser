/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryOptimizeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryOptimizeBlock.pure.js";
import { RegisterGeometryOptimizeBlock } from "./geometryOptimizeBlock.pure.js";
RegisterGeometryOptimizeBlock();
//# sourceMappingURL=geometryOptimizeBlock.js.map