/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometrySmoothStepBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometrySmoothStepBlock.pure.js";
import { RegisterGeometrySmoothStepBlock } from "./geometrySmoothStepBlock.pure.js";
RegisterGeometrySmoothStepBlock();
//# sourceMappingURL=geometrySmoothStepBlock.js.map