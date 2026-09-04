/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import derivativeBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./derivativeBlock.pure.js";
import { RegisterDerivativeBlock } from "./derivativeBlock.pure.js";
RegisterDerivativeBlock();
//# sourceMappingURL=derivativeBlock.js.map