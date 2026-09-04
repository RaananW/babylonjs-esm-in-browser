/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import grainPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./grainPostProcessBlock.pure.js";
import { RegisterGrainPostProcessBlock } from "./grainPostProcessBlock.pure.js";
RegisterGrainPostProcessBlock();
//# sourceMappingURL=grainPostProcessBlock.js.map