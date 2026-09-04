/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryStepBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryStepBlock.pure.js";
import { RegisterGeometryStepBlock } from "./geometryStepBlock.pure.js";
RegisterGeometryStepBlock();
//# sourceMappingURL=geometryStepBlock.js.map