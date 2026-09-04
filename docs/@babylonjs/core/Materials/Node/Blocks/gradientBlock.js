/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import gradientBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./gradientBlock.pure.js";
import { RegisterGradientBlock } from "./gradientBlock.pure.js";
RegisterGradientBlock();
//# sourceMappingURL=gradientBlock.js.map