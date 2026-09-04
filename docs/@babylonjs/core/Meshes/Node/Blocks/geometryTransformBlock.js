/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryTransformBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryTransformBlock.pure.js";
import { RegisterGeometryTransformBlock } from "./geometryTransformBlock.pure.js";
RegisterGeometryTransformBlock();
//# sourceMappingURL=geometryTransformBlock.js.map