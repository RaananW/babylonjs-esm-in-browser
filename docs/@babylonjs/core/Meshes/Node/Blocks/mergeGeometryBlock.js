/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import mergeGeometryBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./mergeGeometryBlock.pure.js";
import { RegisterMergeGeometryBlock } from "./mergeGeometryBlock.pure.js";
RegisterMergeGeometryBlock();
//# sourceMappingURL=mergeGeometryBlock.js.map