/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryOutputBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryOutputBlock.pure.js";
import { RegisterGeometryOutputBlock } from "./geometryOutputBlock.pure.js";
RegisterGeometryOutputBlock();
//# sourceMappingURL=geometryOutputBlock.js.map