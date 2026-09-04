/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryDotBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryDotBlock.pure.js";
import { RegisterGeometryDotBlock } from "./geometryDotBlock.pure.js";
RegisterGeometryDotBlock();
//# sourceMappingURL=geometryDotBlock.js.map