/**
 * Re-exports pure implementation and applies runtime side effects.
 * Import sharpenPostProcessBlock.pure for tree-shakeable, side-effect-free usage.
 */
export * from "./sharpenPostProcessBlock.pure.js";
import { RegisterSharpenPostProcessBlock } from "./sharpenPostProcessBlock.pure.js";
RegisterSharpenPostProcessBlock();
//# sourceMappingURL=sharpenPostProcessBlock.js.map