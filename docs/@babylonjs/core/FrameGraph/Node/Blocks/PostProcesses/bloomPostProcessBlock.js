/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import bloomPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./bloomPostProcessBlock.pure.js";
import { RegisterBloomPostProcessBlock } from "./bloomPostProcessBlock.pure.js";
RegisterBloomPostProcessBlock();
//# sourceMappingURL=bloomPostProcessBlock.js.map