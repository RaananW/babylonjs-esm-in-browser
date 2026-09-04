/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryPowBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryPowBlock.pure.js";
import { RegisterGeometryPowBlock } from "./geometryPowBlock.pure.js";
RegisterGeometryPowBlock();
//# sourceMappingURL=geometryPowBlock.js.map