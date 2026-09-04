/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import tonemapPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./tonemapPostProcessBlock.pure.js";
import { RegisterTonemapPostProcessBlock } from "./tonemapPostProcessBlock.pure.js";
RegisterTonemapPostProcessBlock();
//# sourceMappingURL=tonemapPostProcessBlock.js.map