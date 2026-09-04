/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryInputBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryInputBlock.pure.js";
import { RegisterGeometryInputBlock } from "./geometryInputBlock.pure.js";
RegisterGeometryInputBlock();
//# sourceMappingURL=geometryInputBlock.js.map