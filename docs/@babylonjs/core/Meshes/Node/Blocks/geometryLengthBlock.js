/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryLengthBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryLengthBlock.pure.js";
import { RegisterGeometryLengthBlock } from "./geometryLengthBlock.pure.js";
RegisterGeometryLengthBlock();
//# sourceMappingURL=geometryLengthBlock.js.map