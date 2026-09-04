/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import fxaaPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./fxaaPostProcessBlock.pure.js";
import { RegisterFxaaPostProcessBlock } from "./fxaaPostProcessBlock.pure.js";
RegisterFxaaPostProcessBlock();
//# sourceMappingURL=fxaaPostProcessBlock.js.map