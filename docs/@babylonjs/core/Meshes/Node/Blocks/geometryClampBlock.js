/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryClampBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryClampBlock.pure.js";
import { RegisterGeometryClampBlock } from "./geometryClampBlock.pure.js";
RegisterGeometryClampBlock();
//# sourceMappingURL=geometryClampBlock.js.map