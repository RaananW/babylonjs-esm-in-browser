/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import curveBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./curveBlock.pure.js";
import { RegisterCurveBlock } from "./curveBlock.pure.js";
RegisterCurveBlock();
//# sourceMappingURL=curveBlock.js.map