/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryEaseBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryEaseBlock.pure.js";
import { RegisterGeometryEaseBlock } from "./geometryEaseBlock.pure.js";
RegisterGeometryEaseBlock();
//# sourceMappingURL=geometryEaseBlock.js.map