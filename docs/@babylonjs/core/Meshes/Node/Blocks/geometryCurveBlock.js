/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import geometryCurveBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./geometryCurveBlock.pure.js";
import { RegisterGeometryCurveBlock } from "./geometryCurveBlock.pure.js";
RegisterGeometryCurveBlock();
//# sourceMappingURL=geometryCurveBlock.js.map