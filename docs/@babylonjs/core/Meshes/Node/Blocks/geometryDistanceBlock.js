/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryDistanceBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryDistanceBlock.pure.js";
import { RegisterGeometryDistanceBlock } from "./geometryDistanceBlock.pure.js";
RegisterGeometryDistanceBlock();
//# sourceMappingURL=geometryDistanceBlock.js.map