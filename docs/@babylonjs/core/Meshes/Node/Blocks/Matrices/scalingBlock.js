/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import scalingBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./scalingBlock.pure.js";
import { RegisterScalingBlock } from "./scalingBlock.pure.js";
RegisterScalingBlock();
//# sourceMappingURL=scalingBlock.js.map