/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryInfoBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryInfoBlock.pure.js";
import { RegisterGeometryInfoBlock } from "./geometryInfoBlock.pure.js";
RegisterGeometryInfoBlock();
//# sourceMappingURL=geometryInfoBlock.js.map